/**
 * Shared resourceLocator field definitions for use across all node field files.
 */
import type { INodeProperties } from 'n8n-workflow';

const GUID_REGEX = '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$';

/**
 * Creates an endpointId resourceLocator field with search, ID, and URL modes.
 * Use in any node that has `endpointSearch` in its `methods.listSearch`.
 */
export function endpointLocator(
  displayOptions: INodeProperties['displayOptions'],
): INodeProperties {
  return {
    displayName: 'Endpoint',
    name: 'endpointId',
    type: 'resourceLocator',
    required: true,
    default: { mode: 'list', value: '' },
    displayOptions,
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        typeOptions: {
          searchListMethod: 'endpointSearch',
          searchable: true,
          searchFilterRequired: false,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        validation: [
          {
            type: 'regex',
            properties: {
              regex: GUID_REGEX,
              errorMessage: 'Not a valid GUID (expected: 12345678-1234-1234-1234-123456789012)',
            },
          },
        ],
        placeholder: 'e.g. 12345678-1234-1234-1234-123456789012',
      },
      {
        displayName: 'By URL',
        name: 'url',
        type: 'string',
        placeholder: 'https://bms-server/endpoint/{guid}',
        extractValue: {
          type: 'regex',
          regex: '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})',
        },
      },
    ],
    description: 'The endpoint to operate on',
  };
}
