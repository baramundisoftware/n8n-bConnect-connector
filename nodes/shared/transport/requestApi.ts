import type {
  IExecuteFunctions,
  INode,
  IHttpRequestMethods,
  IHttpRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError, sleep } from 'n8n-workflow';
import {
  extractStatusCode,
  formatTroubleshootingHints,
  getEnhancedErrorInfo,
  getNetworkErrorInfo,
  getSslErrorInfo,
  isNetworkError,
  isSslError,
} from '../utils/errorMessages';
import { normalizeBaseUrl } from '../utils/validation';

const GUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Safely coerce an unknown caught value to the JsonObject shape required by NodeApiError. */
function toJsonObject(e: unknown): JsonObject {
  return (typeof e === 'object' && e !== null ? e : { message: String(e) }) as JsonObject;
}

/**
 * Build the NodeApiError thrown to the workflow, keeping our message.
 *
 * NodeApiError replaces the message with n8n's generic text when the error carries a
 * well-known code (ECONNREFUSED, ENOTFOUND, ETIMEDOUT, …), e.g. "The service refused the
 * connection - perhaps it is offline". Ours names the server and how to fix it, and with
 * "Continue on Fail" the message is all that reaches the output item, so restore it.
 */
function toNodeApiError(
  node: INode,
  error: unknown,
  message: string,
  httpCode?: number,
): NodeApiError {
  const apiError = new NodeApiError(node, toJsonObject(error), {
    message,
    ...(httpCode ? { httpCode: String(httpCode) } : {}),
  });
  if (apiError.message !== message) {
    apiError.messages = apiError.messages.filter((m) => m !== message);
    apiError.message = message;
  }
  return apiError;
}

const RETRY_STATUS_CODES = new Set([429, 503]);
const MAX_RETRIES = 3;

/** Returns true for status codes that are worth retrying (rate-limit / server unavailable). */
function isRetryableError(error: unknown): boolean {
  const status = extractStatusCodeFromError(error);
  if (RETRY_STATUS_CODES.has(status)) return true;
  // Retry on timeout (the request never reached the server)
  const code = (error as Record<string, unknown>)?.code;
  return code === 'ETIMEDOUT';
}

function extractStatusCodeFromError(error: unknown): number {
  const response = (error as Record<string, unknown>)?.response as Record<string, unknown> | undefined;
  const status = response?.status ?? response?.statusCode;
  return typeof status === 'number' ? status : 0;
}

/** Exponential backoff with jitter: base 100ms, doubles each attempt, ±50ms jitter. */
function backoffMs(attempt: number): number {
  return Math.pow(2, attempt) * 100 + Math.floor(Math.random() * 100);
}

/** Parse Retry-After header value (seconds or HTTP-date) → ms to wait, or null. */
function retryAfterMs(error: unknown): number | null {
  const headers = ((error as Record<string, unknown>)?.response as Record<string, unknown>)?.headers as Record<string, string> | undefined;
  const value = headers?.['retry-after'];
  if (!value) return null;
  const seconds = Number(value);
  if (!isNaN(seconds) && seconds > 0) return seconds * 1000;
  const date = Date.parse(value);
  if (!isNaN(date)) return Math.max(0, date - Date.now());
  return null;
}

/**
 * Sanitise a full API URL for error messages — strips GUIDs to avoid leaking identifiers.
 * Returns `{baseUrl}/.../{lastResourceSegment}`.
 */
function sanitiseUrl(baseUrl: string, endpoint: string): string {
  const segments = endpoint.split('/').filter(Boolean);
  const lastResource =
    [...segments].reverse().find((s) => !GUID_PATTERN.test(s)) ?? segments[segments.length - 1];
  return `${baseUrl}/.../${lastResource ?? ''}`;
}

/**
 * Make an API request to bConnect
 */
export async function apiRequest(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: object = {},
  qs: Record<string, string | number> = {},
): Promise<JsonObject> {
  // Server URL and TLS setting only: authentication is added by the credential's
  // `authenticate` (httpRequestWithAuthentication below).
  const credentials = await this.getCredentials('bconnectApi');

  const options: IHttpRequestOptions = {
    method,
    baseURL: normalizeBaseUrl(credentials.baseUrl),
    url: endpoint,
    qs,
    body,
    json: true,
    skipSslCertificateValidation: credentials.ignoreSslIssues as boolean,
  };

  if (Object.keys(body).length === 0) {
    delete options.body;
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await this.helpers.httpRequestWithAuthentication.call(this, 'bconnectApi', options);
      return response as JsonObject;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES && isRetryableError(error)) {
        const wait = retryAfterMs(error) ?? backoffMs(attempt);
        await sleep(wait);
        continue;
      }
      break;
    }
  }

  {
    const error = lastError;
    const safeUrl = sanitiseUrl(options.baseURL as string, options.url as string);
    const errorMessage = (error as Error).message || 'Unknown error';

    // Check for network errors first
    if (isNetworkError(error)) {
      const networkErrorInfo = getNetworkErrorInfo(error, options.baseURL as string);
      const troubleshooting = formatTroubleshootingHints(networkErrorInfo.troubleshooting);

      throw toNodeApiError(
        this.getNode(),
        error,
        `${networkErrorInfo.message}${troubleshooting}\n\nURL: ${safeUrl}`,
      );
    }

    // Check for SSL errors
    if (isSslError(error)) {
      const sslErrorInfo = getSslErrorInfo(error);
      const troubleshooting = formatTroubleshootingHints(sslErrorInfo.troubleshooting);

      throw toNodeApiError(
        this.getNode(),
        error,
        `${sslErrorInfo.message}${troubleshooting}\n\nURL: ${safeUrl}`,
      );
    }

    // Handle HTTP status code errors
    const statusCode = extractStatusCode(error);
    if (statusCode > 0) {
      const operation = `${method} ${safeUrl}`;
      const enhancedError = getEnhancedErrorInfo(statusCode, errorMessage, operation);
      const troubleshooting = formatTroubleshootingHints(enhancedError.troubleshooting);

      throw toNodeApiError(
        this.getNode(),
        error,
        `${enhancedError.message}${troubleshooting}\n\nURL: ${safeUrl}`,
        statusCode,
      );
    }

    // Fallback for unknown errors
    throw toNodeApiError(
      this.getNode(),
      error,
      `bConnect API Error: ${errorMessage}\n\nURL: ${safeUrl}\n\nTroubleshooting:\n1. Check the error message above for details\n2. Verify your credentials and permissions\n3. Review baramundi server logs`,
    );
  }
}

/** Maximum number of pages fetched by apiRequestAllItems regardless of maxItems. */
export const MAX_PAGE_CAP = 50;

/**
 * Make an API request to bConnect V2.0 and return all results (handles pagination).
 *
 * @param maxItems  Stop collecting once this many items have been retrieved.
 *                  When the cap is hit a sentinel `{ _truncated: true, _message: "..." }`
 *                  is appended so callers can surface a warning to users.
 *                  Defaults to 5000 (50 pages × 100 items).
 */
export async function apiRequestAllItems(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: object = {},
  qs: Record<string, string | number> = {},
  maxItems = 5000,
): Promise<JsonObject[]> {
  const returnData: JsonObject[] = [];
  let page = 0;
  const pageSize = 100;

  qs.PageSize = pageSize;

  let hasMorePages = true;

  while (hasMorePages) {
    qs.Page = page;

    const response = await apiRequest.call(this, method, endpoint, body, qs);

    // V2.0 API returns { data: [...], totalItems: n, hasNextPage: boolean }
    const data = (response.data as JsonObject[]) || [];
    const hasNext = (response.hasNextPage as boolean) || false;

    for (const item of data) {
      if (returnData.length >= maxItems) {
        returnData.push({
          _truncated: true,
          _message: `Result set truncated at ${maxItems} items. Increase Max Items or filter results.`,
        });
        return returnData;
      }
      returnData.push(item);
    }

    // Check if there are more pages
    hasMorePages = hasNext && data.length > 0;
    page++;

    // Safety cap to prevent runaway pagination
    if (page >= MAX_PAGE_CAP) {
      if (hasMorePages) {
        returnData.push({
          _truncated: true,
          _message: `Result set truncated at ${MAX_PAGE_CAP} pages (${returnData.length} items). Increase Max Items or filter results.`,
        });
      }
      break;
    }
  }

  return returnData;
}
