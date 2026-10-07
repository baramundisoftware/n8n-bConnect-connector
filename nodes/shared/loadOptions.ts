import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeListSearchResult,
  INodePropertyOptions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { validateODataString } from './utils/validation';

import { apiRequest } from './transport/requestApi';
import type {
  BConnectEndpointItem,
  BConnectJobDefinitionItem,
  BConnectNamedItem,
  BConnectPagedResponse,
} from './utils/types';

/**
 * A dropdown that cannot load must say so: n8n shows the error under the field.
 * Returning [] instead made a wrong URL, missing permissions or a wrong path look like
 * "no data" (#41) — which is how the wrong Org Units path went unnoticed (#38).
 */
function loadError(this: ILoadOptionsFunctions, what: string, error: unknown): NodeOperationError {
  const reason = ((error as Error)?.message ?? String(error)).split('\n')[0];
  return new NodeOperationError(this.getNode(), `Could not load ${what}: ${reason}`);
}

export async function getEndpoints(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  try {
    const response = await apiRequest.call(
      this as unknown as IExecuteFunctions,
      'GET',
      '/endpoints/v2.0/Endpoints',
      {},
      { PageSize: 100, Page: 0, OrderBy: 'DisplayName asc' },
    );

    const paged = response as unknown as BConnectPagedResponse<BConnectEndpointItem>;
    const data = paged.data ?? [];
    const truncated = paged.hasNextPage ?? false;

    const options: INodePropertyOptions[] = data.map((endpoint) => ({
      name: `${endpoint.displayName}${endpoint.hostName ? ` (${endpoint.hostName})` : ''}`,
      value: endpoint.id,
    }));

    if (truncated) {
      options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
    }

    return options;
  } catch (error) {
    throw loadError.call(this, 'endpoints', error);
  }
}

export async function getJobDefinitions(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  try {
    const response = await apiRequest.call(
      this as unknown as IExecuteFunctions,
      'GET',
      '/jobs/v2.0/JobDefinitions',
      {},
      { PageSize: 100, Page: 0, OrderBy: 'Name asc' },
    );

    const paged = response as unknown as BConnectPagedResponse<BConnectJobDefinitionItem>;
    const data = paged.data ?? [];
    const truncated = paged.hasNextPage ?? false;

    const options: INodePropertyOptions[] = data.map((job) => ({
      name: `${job.name}${job.type ? ` [${job.type}]` : ''}`,
      value: job.id,
    }));

    if (truncated) {
      options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
    }

    return options;
  } catch (error) {
    throw loadError.call(this, 'job definitions', error);
  }
}

export async function getOrgUnits(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  try {
    const response = await apiRequest.call(
      this as unknown as IExecuteFunctions,
      'GET',
      '/activedirectory/v2.0/OrgUnits',
      {},
      { PageSize: 100, Page: 0, OrderBy: 'Name asc' },
    );

    const paged = response as unknown as BConnectPagedResponse<BConnectNamedItem>;
    const data = paged.data ?? [];
    const truncated = paged.hasNextPage ?? false;

    const options: INodePropertyOptions[] = data.map((orgUnit) => ({
      name: orgUnit.name ?? orgUnit.id,
      value: orgUnit.id,
    }));

    if (truncated) {
      options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
    }

    return options;
  } catch (error) {
    throw loadError.call(this, 'org units', error);
  }
}

async function getNamedItems(
  this: ILoadOptionsFunctions,
  endpoint: string,
  what: string,
): Promise<INodePropertyOptions[]> {
  try {
    const response = await apiRequest.call(
      this as unknown as IExecuteFunctions,
      'GET',
      endpoint,
      {},
      { PageSize: 100, Page: 0, OrderBy: 'Name asc' },
    );

    const paged = response as unknown as BConnectPagedResponse<BConnectNamedItem>;
    const data = paged.data ?? [];
    const truncated = paged.hasNextPage ?? false;

    const options: INodePropertyOptions[] = data.map((group) => ({
      name: group.name ?? group.id,
      value: group.id,
    }));

    if (truncated) {
      options.push({ name: '— showing first 100 results, use GUID input for more —', value: '' });
    }

    return options;
  } catch (error) {
    throw loadError.call(this, what, error);
  }
}

export async function getLogicalGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  return getNamedItems.call(this, '/endpoints/v2.0/LogicalGroups', 'logical groups');
}

export async function getStaticGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  return getNamedItems.call(this, '/endpoints/v2.0/StaticGroups', 'static groups');
}

export async function getDynamicGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  return getNamedItems.call(this, '/endpoints/v2.0/DynamicGroups', 'dynamic groups');
}

// ─── listSearch methods (for resourceLocator components) ────────────────────

const SEARCH_PAGE_SIZE = 50;

const TYPED_ENDPOINT_PATH: Record<string, string> = {
  windows: 'WindowsEndpoints',
  android: 'AndroidEndpoints',
  ios: 'IosEndpoints',
  linux: 'LinuxEndpoints',
  mac: 'MacEndpoints',
  network: 'NetworkEndpoints',
};

export async function endpointSearch(
  this: ILoadOptionsFunctions,
  filter?: string,
  paginationToken?: string,
): Promise<INodeListSearchResult> {
  const page = paginationToken ? parseInt(paginationToken, 10) : 0;
  const qs: Record<string, string | number> = {
    PageSize: SEARCH_PAGE_SIZE,
    Page: page,
    OrderBy: 'DisplayName asc',
  };
  if (filter) {
    const validation = validateODataString(filter, 'Search filter');
    if (!validation.valid) {
      return { results: [] };
    }
    qs.SearchQuery = `contains(DisplayName,'${filter.replace(/'/g, "''")}')`;
  }

  const endpointType = this.getCurrentNodeParameter('endpointType') as string | undefined;
  const typePath = endpointType ? TYPED_ENDPOINT_PATH[endpointType] : undefined;
  const apiPath = typePath ? `/endpoints/v2.0/${typePath}` : '/endpoints/v2.0/Endpoints';

  const response = await apiRequest.call(
    this as unknown as IExecuteFunctions,
    'GET',
    apiPath,
    {},
    qs,
  );
  const paged = response as unknown as BConnectPagedResponse<BConnectEndpointItem>;
  const data = paged.data ?? [];

  return {
    results: data.map((ep) => ({
      name: `${ep.displayName}${ep.hostName ? ` (${ep.hostName})` : ''}`,
      value: ep.id,
    })),
    paginationToken: paged.hasNextPage ? String(page + 1) : undefined,
  };
}

export async function jobDefinitionSearch(
  this: ILoadOptionsFunctions,
  filter?: string,
  paginationToken?: string,
): Promise<INodeListSearchResult> {
  const page = paginationToken ? parseInt(paginationToken, 10) : 0;
  const qs: Record<string, string | number> = {
    PageSize: SEARCH_PAGE_SIZE,
    Page: page,
    OrderBy: 'Name asc',
  };
  if (filter) {
    const validation = validateODataString(filter, 'Search filter');
    if (!validation.valid) {
      return { results: [] };
    }
    qs.SearchQuery = `contains(Name,'${filter.replace(/'/g, "''")}')`;
  }

  const response = await apiRequest.call(
    this as unknown as IExecuteFunctions,
    'GET',
    '/jobs/v2.0/JobDefinitions',
    {},
    qs,
  );
  const paged = response as unknown as BConnectPagedResponse<BConnectJobDefinitionItem>;
  const data = paged.data ?? [];

  return {
    results: data.map((job) => ({
      name: `${job.name}${job.type ? ` [${job.type}]` : ''}`,
      value: job.id,
    })),
    paginationToken: paged.hasNextPage ? String(page + 1) : undefined,
  };
}

export async function jobFolderSearch(
  this: ILoadOptionsFunctions,
  filter?: string,
  paginationToken?: string,
): Promise<INodeListSearchResult> {
  const page = paginationToken ? parseInt(paginationToken, 10) : 0;
  const qs: Record<string, string | number> = {
    PageSize: SEARCH_PAGE_SIZE,
    Page: page,
    OrderBy: 'Name asc',
  };
  if (filter) {
    const validation = validateODataString(filter, 'Search filter');
    if (!validation.valid) {
      return { results: [] };
    }
    qs.SearchQuery = `contains(Name,'${filter.replace(/'/g, "''")}')`;
  }

  const response = await apiRequest.call(
    this as unknown as IExecuteFunctions,
    'GET',
    '/jobs/v2.0/Folders',
    {},
    qs,
  );
  const paged = response as unknown as BConnectPagedResponse<BConnectNamedItem>;
  const data = paged.data ?? [];

  return {
    results: data.map((folder) => ({
      name: folder.name ?? folder.id,
      value: folder.id,
    })),
    paginationToken: paged.hasNextPage ? String(page + 1) : undefined,
  };
}
