import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodePropertyOptions,
} from 'n8n-workflow';

import { apiRequest } from './transport/requestApi';
import type {
  BConnectEndpointItem,
  BConnectJobDefinitionItem,
  BConnectNamedItem,
  BConnectPagedResponse,
} from './utils/types';

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
  } catch (_error) {
    return [];
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
  } catch (_error) {
    return [];
  }
}

export async function getOrgUnits(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  try {
    const response = await apiRequest.call(
      this as unknown as IExecuteFunctions,
      'GET',
      '/organizationalunits/v2.0/OrganizationalUnits',
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
  } catch (_error) {
    return [];
  }
}

async function getNamedItems(
  this: ILoadOptionsFunctions,
  endpoint: string,
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
  } catch (_error) {
    return [];
  }
}

export async function getLogicalGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  return getNamedItems.call(this, '/endpoints/v2.0/LogicalGroups');
}

export async function getStaticGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  return getNamedItems.call(this, '/endpoints/v2.0/StaticGroups');
}

export async function getDynamicGroups(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
  return getNamedItems.call(this, '/endpoints/v2.0/DynamicGroups');
}
