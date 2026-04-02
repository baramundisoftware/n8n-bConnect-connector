/**
 * Shared TypeScript interfaces for bConnect V2.0 API responses.
 * Used to replace `as any` casts throughout the connector.
 */

/** Standard paginated envelope returned by all V2.0 list endpoints. */
export interface BConnectPagedResponse<T> {
	data: T[];
	totalItems: number;
	hasNextPage: boolean;
}

/** Minimal shape of a bConnect Endpoint item (list/search responses). */
export interface BConnectEndpointItem {
	id: string;
	displayName: string;
	hostName?: string;
}

/** Minimal shape of a bConnect Job Definition item. */
export interface BConnectJobDefinitionItem {
	id: string;
	name: string;
	type?: string;
}

/** Minimal shape of any bConnect named item (org unit, group, etc.). */
export interface BConnectNamedItem {
	id: string;
	name?: string;
}

/**
 * Loosely-typed error shape used for HTTP/network error introspection.
 * Functions that receive `unknown` errors cast to this before reading fields.
 */
export interface ErrorLike {
	message?: string;
	code?: string;
	statusCode?: number;
	status?: number;
	response?: {
		status?: number;
		statusCode?: number;
		headers?: Record<string, string>;
	};
}
