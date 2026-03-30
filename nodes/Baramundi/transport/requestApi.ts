import type {
  IExecuteFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';
import {
  extractStatusCode,
  formatTroubleshootingHints,
  getEnhancedErrorInfo,
  getNetworkErrorInfo,
  getSslErrorInfo,
  isNetworkError,
  isSslError,
} from '../utils/errorMessages';

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
  const credentials = await this.getCredentials('bconnectApi');

  const options: IHttpRequestOptions = {
    method,
    baseURL: credentials.baseUrl as string,
    url: endpoint,
    qs,
    body,
    json: true,
    skipSslCertificateValidation: credentials.ignoreSslIssues as boolean,
    auth: {
      username: credentials.username as string,
      password: credentials.password as string,
    },
  };

  if (Object.keys(body).length === 0) {
    delete options.body;
  }

  try {
    const response = await this.helpers.httpRequest(options);
    return response as JsonObject;
  } catch (error) {
    const fullUrl = `${options.baseURL}${options.url}`;
    const errorMessage = (error as Error).message || 'Unknown error';

    // Check for network errors first
    if (isNetworkError(error)) {
      const networkErrorInfo = getNetworkErrorInfo(error, options.baseURL as string);
      const troubleshooting = formatTroubleshootingHints(networkErrorInfo.troubleshooting);

      throw new NodeApiError(this.getNode(), error as JsonObject, {
        message: `${networkErrorInfo.message}${troubleshooting}\n\nURL: ${fullUrl}`,
      });
    }

    // Check for SSL errors
    if (isSslError(error)) {
      const sslErrorInfo = getSslErrorInfo(error);
      const troubleshooting = formatTroubleshootingHints(sslErrorInfo.troubleshooting);

      throw new NodeApiError(this.getNode(), error as JsonObject, {
        message: `${sslErrorInfo.message}${troubleshooting}\n\nURL: ${fullUrl}`,
      });
    }

    // Handle HTTP status code errors
    const statusCode = extractStatusCode(error);
    if (statusCode > 0) {
      const operation = `${method} ${endpoint}`;
      const enhancedError = getEnhancedErrorInfo(statusCode, errorMessage, operation);
      const troubleshooting = formatTroubleshootingHints(enhancedError.troubleshooting);

      throw new NodeApiError(this.getNode(), error as JsonObject, {
        message: `${enhancedError.message}${troubleshooting}\n\nURL: ${fullUrl}`,
        httpCode: String(statusCode),
      });
    }

    // Fallback for unknown errors
    throw new NodeApiError(this.getNode(), error as JsonObject, {
      message: `bConnect API Error: ${errorMessage}\n\nURL: ${fullUrl}\n\nTroubleshooting:\n1. Check the error message above for details\n2. Verify your credentials and permissions\n3. Review baramundi server logs`,
    });
  }
}

/**
 * Make an API request to bConnect V2.0 and return all results (handles pagination)
 */
export async function apiRequestAllItems(
  this: IExecuteFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: object = {},
  qs: Record<string, string | number> = {},
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

    returnData.push(...data);

    // Check if there are more pages
    hasMorePages = hasNext && data.length > 0;
    page++;

    // Safety limit to prevent infinite loops
    if (page > 1000) {
      break;
    }
  }

  return returnData;
}
