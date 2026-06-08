import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

/**
 * Authentication note:
 *
 * The baramundi bConnect V2.0 API supports two authentication methods:
 *  1. HTTP Basic Authentication (username + password)
 *  2. API Key via the `X-Api-Key` request header
 *
 * Users can select their preferred method via the "Authentication Method" dropdown.
 *
 * Security guidance:
 *  - For Basic Auth: use a **dedicated service account** (least-privilege, no interactive logon).
 *  - For API Key: generate the key in the bMS console under Server Management → API Keys.
 *  - Store credentials in n8n's encrypted credential store (never in workflow JSON).
 *  - Enable SSL validation (keep `ignoreSslIssues: false`) so credentials cannot be
 *    intercepted in transit.
 *  - Restrict network access so only the n8n host can reach the bMS server on port 444.
 */
export class BconnectApi implements ICredentialType {
  name = 'bconnectApi';
  displayName = 'Baramundi bConnect API';
  // eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
  documentationUrl = 'https://docs.baramundi.com/';

  properties: INodeProperties[] = [
    {
      displayName: 'Server URL',
      name: 'baseUrl',
      type: 'string',
      default: '',
      placeholder: 'https://your-bms-server:444/bconnect',
      description: 'The base URL of your baramundi Management Suite bConnect API',
      required: true,
    },
    {
      displayName: 'Authentication Method',
      name: 'authMethod',
      type: 'options',
      options: [
        {
          name: 'Basic Auth (Username & Password)',
          value: 'basicAuth',
        },
        {
          name: 'API Key',
          value: 'apiKey',
        },
      ],
      default: 'basicAuth',
      description: 'The authentication method to use for the bConnect API',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      description: 'The username for bConnect API authentication',
      required: true,
      displayOptions: {
        show: {
          authMethod: ['basicAuth'],
        },
      },
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'The password for bConnect API authentication',
      required: true,
      displayOptions: {
        show: {
          authMethod: ['basicAuth'],
        },
      },
    },
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'The API key for bConnect API authentication (generated in bMS console under Server Management → API Keys)',
      required: true,
      displayOptions: {
        show: {
          authMethod: ['apiKey'],
        },
      },
    },
    {
      displayName: 'Ignore SSL Issues',
      name: 'ignoreSslIssues',
      type: 'boolean',
      default: false,
      description:
        'Whether to connect even if SSL certificate validation fails (use with caution)',
    },
    {
      displayName:
        'Warning: TLS validation is disabled. All API traffic between n8n and the bMS server can be intercepted (man-in-the-middle attack). Use only in isolated test environments. For self-signed certificates the recommended solution is to import your internal CA into the n8n host trust store instead of disabling validation.',
      name: 'sslWarning',
      type: 'notice',
      default: '',
      displayOptions: {
        show: {
          ignoreSslIssues: [true],
        },
      },
    },
  ];

  // Note: The `authenticate` property provides auto-injection for Basic Auth (the default).
  // For API Key auth, requestApi.ts handles injection via the X-Api-Key header directly,
  // because n8n's IAuthenticateGeneric does not support conditional auth methods.
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/v2.0/WindowsEndpoints',
      skipSslCertificateValidation: '={{$credentials.ignoreSslIssues}}',
      ignoreHttpStatusErrors: true,
      // For API Key auth, the X-Api-Key header is injected here.
      // For Basic Auth, the `authenticate` property above handles it.
      headers: {
        'X-Api-Key': '={{$credentials.authMethod === "apiKey" ? $credentials.apiKey : ""}}',
      },
    },
  };
}
