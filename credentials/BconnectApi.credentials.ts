import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

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
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      description: 'The username for bConnect API authentication',
      required: true,
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
    },
  };
}
