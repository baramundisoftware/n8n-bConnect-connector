/**
 * Error Message Utilities for baramundi n8n Node
 *
 * Provides contextual error messages with troubleshooting hints
 * for common HTTP status codes and baramundi API error scenarios
 */

import type { ErrorLike } from './types';

/** Narrow an unknown caught value to ErrorLike for safe field access. */
function asErrorLike(error: unknown): ErrorLike {
	return (error ?? {}) as ErrorLike;
}

export interface EnhancedErrorInfo {
	message: string;
	troubleshooting: string[];
	httpStatus?: number;
}

/**
 * Get enhanced error information based on HTTP status code
 * @param statusCode - HTTP status code
 * @param originalMessage - Original error message from API
 * @param operation - Operation being performed (e.g., 'get endpoint', 'create job')
 * @returns Enhanced error information with troubleshooting hints
 */
export function getEnhancedErrorInfo(
	statusCode: number,
	originalMessage: string,
	operation?: string,
): EnhancedErrorInfo {
	const operationContext = operation ? ` while trying to ${operation}` : '';

	switch (statusCode) {
		case 400: // Bad Request
			return {
				message: `Bad Request${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'Check that all required parameters are provided',
					'Verify that parameter values are in the correct format (GUIDs, dates, etc.)',
					'Review the API documentation for this operation',
					'Check for invalid characters in string parameters',
				],
				httpStatus: 400,
			};

		case 401: // Unauthorized
			return {
				message: `Authentication Failed${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'Verify your bConnect API credentials (username and password)',
					'Check that the credentials have not expired',
					'Ensure the user account is active in baramundi Management Suite',
					'Test the credentials in baramundi Management Console',
				],
				httpStatus: 401,
			};

		case 403: // Forbidden
			return {
				message: `Access Denied${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'Check that your user account has sufficient permissions for this operation',
					'Verify role assignments in baramundi Management Console',
					'Some operations require specific baramundi licenses',
					'Review the baramundi security settings for this resource',
				],
				httpStatus: 403,
			};

		case 404: // Not Found
			return {
				message: `Resource Not Found${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'Verify that the GUID is correct and the resource exists',
					'Check if the resource was deleted or moved',
					'Ensure you are using the correct API endpoint path',
					'Use the search or getMany operations to verify available resources',
				],
				httpStatus: 404,
			};

		case 409: // Conflict
			return {
				message: `Conflict${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'A resource with this name or identifier may already exist',
					'Check for duplicate entries before creating new resources',
					'Ensure the resource is not locked by another operation',
					'Try updating the existing resource instead of creating a new one',
				],
				httpStatus: 409,
			};

		case 422: // Unprocessable Entity
			return {
				message: `Validation Error${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'Review all parameter values for correctness',
					'Check that required fields are not empty',
					'Verify that date/time values are in ISO 8601 format',
					'Ensure GUIDs are in the correct format (12345678-1234-1234-1234-123456789012)',
				],
				httpStatus: 422,
			};

		case 429: // Too Many Requests
			return {
				message: `Rate Limit Exceeded${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'Reduce the frequency of API calls',
					'Implement exponential backoff and retry logic',
					'Use bulk operations instead of individual requests where possible',
					'Contact your baramundi administrator about rate limits',
				],
				httpStatus: 429,
			};

		case 500: // Internal Server Error
			return {
				message: `Server Error${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'Check baramundi server logs for detailed error information',
					'Verify that baramundi Management Suite services are running',
					'Ensure the baramundi server has sufficient resources (CPU, memory, disk)',
					'Contact baramundi support if the issue persists',
				],
				httpStatus: 500,
			};

		case 503: // Service Unavailable
			return {
				message: `Service Unavailable${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'The baramundi server may be temporarily down or under maintenance',
					'Check network connectivity to the baramundi server',
					'Verify that bConnect service is running on the server',
					'Try again in a few minutes',
				],
				httpStatus: 503,
			};

		default:
			return {
				message: `HTTP ${statusCode} Error${operationContext}: ${originalMessage}`,
				troubleshooting: [
					'Review the error message for specific details',
					'Check baramundi server logs for more information',
					'Verify network connectivity and firewall settings',
					'Consult baramundi API documentation',
				],
				httpStatus: statusCode,
			};
	}
}

/**
 * Get operation-specific error message
 * @param operation - Operation name (e.g., 'endpoint:get', 'job:create')
 * @param resourceId - Resource ID if applicable
 * @param errorMessage - Original error message
 * @returns Contextual error message
 */
export function getOperationErrorMessage(
	operation: string,
	resourceId: string | undefined,
	errorMessage: string,
): string {
	const resourceInfo = resourceId ? ` (ID: ${resourceId})` : '';

	const operationMap: Record<string, string> = {
		'endpoint:get': `Failed to retrieve endpoint${resourceInfo}`,
		'endpoint:create': 'Failed to create endpoint',
		'endpoint:update': `Failed to update endpoint${resourceInfo}`,
		'endpoint:delete': `Failed to delete endpoint${resourceInfo}`,
		'endpoint:getMany': 'Failed to retrieve endpoints',
		'endpoint:search': 'Failed to search endpoints',
		'job:get': `Failed to retrieve job${resourceInfo}`,
		'job:create': 'Failed to create job',
		'job:execute': `Failed to execute job${resourceInfo}`,
		'job:getInstances': 'Failed to retrieve job instances',
	};

	const contextualMessage = operationMap[operation] || `Failed to execute operation: ${operation}`;
	return `${contextualMessage}. ${errorMessage}`;
}

/**
 * Format troubleshooting hints into a readable string
 * @param hints - Array of troubleshooting hints
 * @returns Formatted string with numbered hints
 */
export function formatTroubleshootingHints(hints: string[]): string {
	if (hints.length === 0) {
		return '';
	}

	return (
		'\n\nTroubleshooting:\n' +
		hints.map((hint, index) => `${index + 1}. ${hint}`).join('\n')
	);
}

/**
 * Extract HTTP status code from error object
 * @param error - Error object from API request
 * @returns HTTP status code or 0 if not found
 */
export function extractStatusCode(error: unknown): number {
	const e = asErrorLike(error);
	// Try different common error object structures
	if (e.statusCode) return e.statusCode;
	if (e.response?.status) return e.response.status;
	if (e.response?.statusCode) return e.response.statusCode;
	if (e.status) return e.status;

	// Try to extract from error message
	const statusMatch = e.message?.match(/status code (\d+)/i);
	if (statusMatch) return parseInt(statusMatch[1], 10);

	return 0;
}

/** Node.js socket/DNS error codes that mean the server could not be reached. */
const NETWORK_ERROR_CODES = new Set([
	'ECONNREFUSED',
	'ENOTFOUND',
	'ETIMEDOUT',
	'ECONNRESET',
	'ECONNABORTED',
	'EHOSTUNREACH',
	'EAI_AGAIN',
]);

/**
 * Check if error is a network/connectivity error
 * @param error - Error object
 * @returns True if network error
 */
export function isNetworkError(error: unknown): boolean {
	const e = asErrorLike(error);
	const message = e.message?.toLowerCase() || '';
	const code = e.code || '';

	return (
		message.includes('econnrefused') ||
		message.includes('enotfound') ||
		message.includes('etimedout') ||
		message.includes('network') ||
		NETWORK_ERROR_CODES.has(code)
	);
}

/**
 * Get network error message with troubleshooting hints
 * @param error - Error object
 * @param baseUrl - Base URL being accessed
 * @returns Enhanced error information
 */
export function getNetworkErrorInfo(error: unknown, baseUrl: string): EnhancedErrorInfo {
	const e = asErrorLike(error);
	const code = e.code || '';
	let message = '';
	let troubleshooting: string[] = [];

	if (code === 'ECONNREFUSED' || e.message?.includes('ECONNREFUSED')) {
		message = `Cannot connect to baramundi server at ${baseUrl}`;
		troubleshooting = [
			'Verify the server URL is correct',
			'Check that the baramundi server is running',
			'Ensure bConnect service is started on the server',
			'Check firewall rules allow connections to the server',
			'Verify the port number is correct (typically 443 or 444 for bConnect)',
		];
	} else if (code === 'ENOTFOUND' || e.message?.includes('ENOTFOUND')) {
		message = `Cannot resolve hostname: ${baseUrl}`;
		troubleshooting = [
			'Check that the server hostname is spelled correctly',
			'Verify DNS is configured correctly',
			'Try using the IP address instead of hostname',
			'Check network connectivity',
		];
	} else if (code === 'ETIMEDOUT' || e.message?.includes('ETIMEDOUT')) {
		message = `Connection to ${baseUrl} timed out`;
		troubleshooting = [
			'Check network connectivity to the server',
			'Verify firewall rules allow connections',
			'The server may be overloaded or slow to respond',
			'Try increasing the timeout value',
		];
	} else {
		message = `Network error: ${e.message}`;
		troubleshooting = [
			'Check network connectivity',
			'Verify server URL and credentials',
			'Review firewall and proxy settings',
			'Check baramundi server status',
		];
	}

	return { message, troubleshooting };
}

/**
 * Check if error is an SSL/certificate error
 * @param error - Error object
 * @returns True if SSL error
 */
export function isSslError(error: unknown): boolean {
	const e = asErrorLike(error);
	const message = e.message?.toLowerCase() || '';
	const code = e.code || '';

	return (
		message.includes('certificate') ||
		message.includes('ssl') ||
		message.includes('tls') ||
		message.includes('self-signed') ||
		code === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
		code === 'CERT_HAS_EXPIRED' ||
		code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
	);
}

/**
 * Get SSL error message with troubleshooting hints
 * @param error - Error object
 * @returns Enhanced error information
 */
export function getSslErrorInfo(error: unknown): EnhancedErrorInfo {
	const e = asErrorLike(error);
	return {
		message: `SSL Certificate Error: ${e.message}`,
		troubleshooting: [
			'The server is using a self-signed or invalid SSL certificate',
			'Enable "Ignore SSL Issues" in the baramundi credentials configuration',
			'Install the server certificate in the trusted certificate store',
			'Use a valid SSL certificate on the baramundi server',
			'Note: Ignoring SSL issues is not recommended for production environments',
		],
	};
}
