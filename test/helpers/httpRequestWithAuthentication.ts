/**
 * Test stand-in for n8n's `helpers.httpRequestWithAuthentication`: like n8n, it reads the
 * credential, lets the credential type's `authenticate` add Basic auth or the API key, and
 * sends the request through the context's `helpers.httpRequest`, which the tests mock or
 * point at a live server. Put it next to `httpRequest` in a fake context's `helpers`.
 */
import type { ICredentialDataDecryptedObject, IHttpRequestOptions } from 'n8n-workflow';

import { BconnectApi } from '../../credentials/BconnectApi.credentials';

const credentialType = new BconnectApi();

interface FakeContext {
  getCredentials: (type: string) => Promise<ICredentialDataDecryptedObject>;
  helpers: { httpRequest: (options: IHttpRequestOptions) => Promise<unknown> };
}

export async function httpRequestWithAuthentication(
  this: FakeContext,
  credentialsType: string,
  requestOptions: IHttpRequestOptions,
): Promise<unknown> {
  const credentials = await this.getCredentials(credentialsType);
  return this.helpers.httpRequest(await credentialType.authenticate(credentials, requestOptions));
}
