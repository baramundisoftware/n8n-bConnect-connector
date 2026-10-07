import type {
  ICredentialDataDecryptedObject,
  ICredentialTestRequest,
  ICredentialType,
  IHttpRequestOptions,
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
  // eslint-disable-next-line n8n-nodes-base/cred-class-field-display-name-miscased -- baramundi is a lowercase brand name
  displayName = 'baramundi bConnect API';
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

  /**
   * Adds the chosen authentication to every request n8n sends with this credential: the
   * nodes' requests (httpRequestWithAuthentication) and the credential test below. Exactly one
   * of the two: Basic auth, or the `X-Api-Key` header. A generic `authenticate` cannot choose,
   * and sent an empty Basic header next to the API key.
   */
  async authenticate(
    credentials: ICredentialDataDecryptedObject,
    requestOptions: IHttpRequestOptions,
  ): Promise<IHttpRequestOptions> {
    if (credentials.authMethod === 'apiKey') {
      return {
        ...requestOptions,
        headers: { ...requestOptions.headers, 'X-Api-Key': credentials.apiKey as string },
      };
    }
    return {
      ...requestOptions,
      auth: { username: credentials.username as string, password: credentials.password as string },
    };
  }

  // Lists one endpoint: a cheap read that exists in 25R2 and 26R1. bConnect routes carry a
  // module prefix (`/bconnect/endpoints/v2.0/...`), so the path must include `/endpoints`.
  // HTTP errors are NOT ignored: n8n's credential tester then fails on any non-2xx status,
  // and the rules below turn the common ones into actionable messages.
  test: ICredentialTestRequest = {
    request: {
      // Same normalisation as normalizeBaseUrl() in nodes/shared/utils/validation.ts
      baseURL: '={{ String($credentials.baseUrl).trim().replace(/\\/+$/, "") }}',
      url: '/endpoints/v2.0/Endpoints',
      qs: { PageSize: 1 },
      skipSslCertificateValidation: '={{$credentials.ignoreSslIssues}}',
    },
    rules: [
      {
        type: 'responseCode',
        properties: {
          value: 401,
          message: 'Authentication failed. Check the username and password, or the API key.',
        },
      },
      {
        type: 'responseCode',
        properties: {
          value: 403,
          message: 'Access denied. The account or API key has no permission to read endpoints in bConnect.',
        },
      },
      {
        type: 'responseCode',
        properties: {
          value: 404,
          message:
            'bConnect API not found. Check the Server URL — it should end in /bconnect, e.g. https://bms-server:444/bconnect',
        },
      },
    ],
  };
}
