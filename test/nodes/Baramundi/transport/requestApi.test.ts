/**
 * Unit Tests for Request API Transport Layer
 *
 * Tests the apiRequest and apiRequestAllItems functions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { apiRequest, apiRequestAllItems, MAX_PAGE_CAP } from '../../../../nodes/shared/transport/requestApi';

/**
 * Create a mock IExecuteFunctions for transport testing
 */
function createMockExecuteFunctions(
  mockResponse: any = {},
  mockResponses: any[] = [],
): IExecuteFunctions {
  let callIndex = 0;

  const httpRequest = vi.fn(async (options: IHttpRequestOptions) => {
    if (mockResponses.length > 0) {
      // Return different responses for pagination tests
      const response = mockResponses[callIndex] || mockResponse;
      callIndex++;
      return response;
    }
    return mockResponse;
  });

  return {
    getCredentials: vi.fn(async () => ({
      baseUrl: 'https://bms-win22srv:444/bconnect',
      username: 'Administrator',
      password: 'test-password-do-not-use',
      ignoreSslIssues: false,
    })),
    helpers: {
      httpRequest,
    },
    getNode: vi.fn(() => ({
      name: 'Baramundi',
      type: 'n8n-nodes-baramundi.baramundi',
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    })),
  } as unknown as IExecuteFunctions;
}

describe('Request API Transport Layer', () => {
  describe('apiRequest()', () => {
    it('should make a successful GET request', async () => {
      // Arrange
      const mockResponse = { id: '1', name: 'Test Endpoint' };
      const mockContext = createMockExecuteFunctions(mockResponse);

      // Act
      const result = await apiRequest.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints/1'
      );

      // Assert
      expect(result).toEqual(mockResponse);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          baseURL: 'https://bms-win22srv:444/bconnect',
          url: '/endpoints/v2.0/Endpoints/1',
          json: true,
          skipSslCertificateValidation: false,
          auth: {
            username: 'Administrator',
            password: 'test-password-do-not-use',
          },
        })
      );
    });

    it('should include query string parameters', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions({ data: [] });
      const qs = { PageSize: 50, Page: 0, OrderBy: 'displayName asc' };

      // Act
      await apiRequest.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints',
        {},
        qs
      );

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs,
        })
      );
    });

    it('should include request body for POST requests', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions({ success: true });
      const body = { displayName: 'New Endpoint', orgUnitId: '123' };

      // Act
      await apiRequest.call(
        mockContext,
        'POST',
        '/endpoints/v2.0/Endpoints',
        body
      );

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          body,
        })
      );
    });

    it('should remove empty body object', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions({ data: [] });

      // Act
      await apiRequest.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints',
        {} // Empty body
      );

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.not.objectContaining({
          body: expect.anything(),
        })
      );
    });

    it('should throw NodeApiError on request failure with enhanced error message', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions();
      mockContext.helpers.httpRequest = vi.fn(async () => {
        const error: any = new Error('Request failed with status code 404');
        error.statusCode = 404;
        throw error;
      });

      // Act & Assert
      await expect(
        apiRequest.call(mockContext, 'GET', '/endpoints/v2.0/Endpoints/invalid-id')
      ).rejects.toThrow(/Resource Not Found/);
    });

    it('should include sanitised URL in error message (no GUIDs or full paths)', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions();
      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert — URL is truncated to {host}/.../Endpoints, not the full path with IDs
      const endpointGuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      await expect(
        apiRequest.call(mockContext, 'GET', `/endpoints/v2.0/Endpoints/${endpointGuid}`)
      ).rejects.toThrow(/https:\/\/bms-win22srv:444\/bconnect\/\.\.\.\/Endpoints/);
    });

    it('should not include GUID in the URL portion of the error message', async () => {
      // Arrange
      const mockContext = createMockExecuteFunctions();
      mockContext.helpers.httpRequest = vi.fn(async () => {
        throw new Error('Request failed with status code 404');
      });

      // Act & Assert — GUID must NOT appear in the URL: line of the error message
      const guid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      try {
        await apiRequest.call(mockContext, 'GET', `/endpoints/v2.0/Endpoints/${guid}`);
        throw new Error('Expected apiRequest to throw');
      } catch (err: any) {
        // The URL: line should not contain the GUID
        const urlLine = (err.message as string).split('\n').find((l: string) => l.startsWith('URL:')) ?? '';
        expect(urlLine).not.toMatch(guid);
        expect(urlLine).toMatch(/bms-win22srv.*\/\.\.\.\/Endpoints/);
      }
    });
  });

  describe('apiRequestAllItems()', () => {
    it('should fetch all items with pagination (single page)', async () => {
      // Arrange
      const mockResponse = {
        currentPage: 0,
        pageSize: 100,
        totalPages: 1,
        totalItems: 3,
        hasPreviousPage: false,
        hasNextPage: false,
        data: [
          { id: '1', name: 'Endpoint 1' },
          { id: '2', name: 'Endpoint 2' },
          { id: '3', name: 'Endpoint 3' },
        ],
      };

      const mockContext = createMockExecuteFunctions(mockResponse);

      // Act
      const result = await apiRequestAllItems.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints'
      );

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('1');
      expect(result[2].id).toBe('3');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(1);
    });

    it('should fetch all items with pagination (multiple pages)', async () => {
      // Arrange - Simulate 2 pages
      const page1Response = {
        currentPage: 0,
        pageSize: 100,
        totalPages: 2,
        totalItems: 150,
        hasPreviousPage: false,
        hasNextPage: true,
        data: Array.from({ length: 100 }, (_, i) => ({
          id: `${i + 1}`,
          name: `Endpoint ${i + 1}`,
        })),
      };

      const page2Response = {
        currentPage: 1,
        pageSize: 100,
        totalPages: 2,
        totalItems: 150,
        hasPreviousPage: true,
        hasNextPage: false,
        data: Array.from({ length: 50 }, (_, i) => ({
          id: `${i + 101}`,
          name: `Endpoint ${i + 101}`,
        })),
      };

      const mockContext = createMockExecuteFunctions({}, [page1Response, page2Response]);

      // Act
      const result = await apiRequestAllItems.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints'
      );

      // Assert
      expect(result).toHaveLength(150);
      expect(result[0].id).toBe('1');
      expect(result[99].id).toBe('100');
      expect(result[100].id).toBe('101');
      expect(result[149].id).toBe('150');
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(2);
    });

    it('should stop pagination when hasNextPage is false', async () => {
      // Arrange
      const mockResponse = {
        hasNextPage: false,
        data: [{ id: '1', name: 'Single Page' }],
      };

      const mockContext = createMockExecuteFunctions(mockResponse);

      // Act
      const result = await apiRequestAllItems.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints'
      );

      // Assert
      expect(result).toHaveLength(1);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(1);
    });

    it('should handle empty results', async () => {
      // Arrange
      const mockResponse = {
        hasNextPage: false,
        data: [],
        totalItems: 0,
      };

      const mockContext = createMockExecuteFunctions(mockResponse);

      // Act
      const result = await apiRequestAllItems.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints'
      );

      // Assert
      expect(result).toHaveLength(0);
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(1);
    });

    it('should include custom query parameters', async () => {
      // Arrange
      const mockResponse = {
        hasNextPage: false,
        data: [{ id: '1' }],
      };

      const mockContext = createMockExecuteFunctions(mockResponse);
      const qs = { OrderBy: 'displayName desc', OrgUnitId: '123' };

      // Act
      await apiRequestAllItems.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints',
        {},
        qs
      );

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          qs: expect.objectContaining({
            OrderBy: 'displayName desc',
            OrgUnitId: '123',
            PageSize: 100,
            Page: 0,
          }),
        })
      );
    });

    it('should stop after MAX_PAGE_CAP pages and append truncation sentinel', async () => {
      // Arrange - Always return hasNextPage: true
      const mockResponse = {
        hasNextPage: true,
        data: [{ id: '1' }],
      };

      const mockContext = createMockExecuteFunctions(mockResponse);

      // Act
      const result = await apiRequestAllItems.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints'
      );

      // Assert - Should stop at MAX_PAGE_CAP (50) pages + 1 truncation sentinel
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(MAX_PAGE_CAP);
      expect(result).toHaveLength(MAX_PAGE_CAP + 1);
      expect(result[result.length - 1]).toHaveProperty('_truncated', true);
    });

    it('should fetch data from multiple pages sequentially', async () => {
      // Arrange - 3 pages of data
      const responses = [
        {
          hasNextPage: true,
          data: [{ id: '1', name: 'Page 0' }],
        },
        {
          hasNextPage: true,
          data: [{ id: '2', name: 'Page 1' }],
        },
        {
          hasNextPage: false,
          data: [{ id: '3', name: 'Page 2' }],
        },
      ];

      const mockContext = createMockExecuteFunctions({}, responses);

      // Act
      const result = await apiRequestAllItems.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints'
      );

      // Assert - All pages combined into single result
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ id: '1', name: 'Page 0' });
      expect(result[1]).toEqual({ id: '2', name: 'Page 1' });
      expect(result[2]).toEqual({ id: '3', name: 'Page 2' });
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(3);
    });
  });

  describe('Authentication', () => {
    it('should use credentials from context', async () => {
      // Arrange
      const customCredentials = {
        baseUrl: 'https://custom-server:444/bconnect',
        username: 'CustomUser',
        password: 'test-password-do-not-use',
        ignoreSslIssues: false,
      };

      const mockContext = createMockExecuteFunctions({ data: [] });
      mockContext.getCredentials = vi.fn(async () => customCredentials);

      // Act
      await apiRequest.call(
        mockContext,
        'GET',
        '/endpoints/v2.0/Endpoints'
      );

      // Assert
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://custom-server:444/bconnect',
          skipSslCertificateValidation: false,
          auth: {
            username: 'CustomUser',
            password: 'test-password-do-not-use',
          },
        })
      );
    });
  });

  describe('pagination cap and maxItems', () => {
    it('should export MAX_PAGE_CAP constant equal to 50', () => {
      expect(MAX_PAGE_CAP).toBe(50);
    });

    it('should stop at maxItems and include truncation warning', async () => {
      // 3 pages of 2 items each; maxItems=3 should stop after page 1 (2 items) then partial
      const page0 = { data: [{ id: '1' }, { id: '2' }], hasNextPage: true };
      const page1 = { data: [{ id: '3' }, { id: '4' }], hasNextPage: true };
      let calls = 0;
      const mockContext = {
        getCredentials: vi.fn(async () => ({
          baseUrl: 'https://bms-win22srv:444/bconnect',
          username: 'Administrator',
          password: 'test-password-do-not-use',
          ignoreSslIssues: false,
        })),
        helpers: {
          httpRequest: vi.fn(async () => {
            return calls++ === 0 ? page0 : page1;
          }),
        },
        getNode: vi.fn(() => ({ name: 'Baramundi', type: 'baramundi', typeVersion: 1, position: [0, 0], parameters: {} })),
      } as unknown as IExecuteFunctions;

      const result = await apiRequestAllItems.call(mockContext, 'GET', '/endpoint', {}, {}, 3);

      // Should have 4 items: 3 data items (maxItems=3) + 1 truncation sentinel
      expect(result.length).toBe(4);
      // Last item should be truncation warning sentinel
      const last = result[result.length - 1];
      expect(last).toHaveProperty('_truncated', true);
    });

    it('should return all items without truncation sentinel when under maxItems', async () => {
      const mockContext = {
        getCredentials: vi.fn(async () => ({
          baseUrl: 'https://bms-win22srv:444/bconnect',
          username: 'Administrator',
          password: 'test-password-do-not-use',
          ignoreSslIssues: false,
        })),
        helpers: {
          httpRequest: vi.fn(async () => ({
            data: [{ id: '1' }, { id: '2' }],
            hasNextPage: false,
          })),
        },
        getNode: vi.fn(() => ({ name: 'Baramundi', type: 'baramundi', typeVersion: 1, position: [0, 0], parameters: {} })),
      } as unknown as IExecuteFunctions;

      const result = await apiRequestAllItems.call(mockContext, 'GET', '/endpoint', {}, {}, 500);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: '1' });
    });
  });

  describe('retry behaviour', () => {
    it('should succeed on first retry after HTTP 429', async () => {
      let calls = 0;
      const mockContext = {
        getCredentials: vi.fn(async () => ({
          baseUrl: 'https://bms-win22srv:444/bconnect',
          username: 'Administrator',
          password: 'test-password-do-not-use',
          ignoreSslIssues: false,
        })),
        helpers: {
          httpRequest: vi.fn(async () => {
            calls++;
            if (calls === 1) {
              const err = Object.assign(new Error('Too Many Requests'), { response: { status: 429 } });
              throw err;
            }
            return { id: 'ok' };
          }),
        },
        getNode: vi.fn(() => ({ name: 'Baramundi', type: 'baramundi', typeVersion: 1, position: [0, 0], parameters: {} })),
      } as unknown as IExecuteFunctions;

      const result = await apiRequest.call(mockContext, 'GET', '/endpoints/v2.0/Endpoints');

      expect(calls).toBe(2);
      expect(result).toEqual({ id: 'ok' });
    });

    it('should succeed on first retry after HTTP 503', async () => {
      let calls = 0;
      const mockContext = {
        getCredentials: vi.fn(async () => ({
          baseUrl: 'https://bms-win22srv:444/bconnect',
          username: 'Administrator',
          password: 'test-password-do-not-use',
          ignoreSslIssues: false,
        })),
        helpers: {
          httpRequest: vi.fn(async () => {
            calls++;
            if (calls === 1) {
              const err = Object.assign(new Error('Service Unavailable'), { response: { status: 503 } });
              throw err;
            }
            return { id: 'ok' };
          }),
        },
        getNode: vi.fn(() => ({ name: 'Baramundi', type: 'baramundi', typeVersion: 1, position: [0, 0], parameters: {} })),
      } as unknown as IExecuteFunctions;

      const result = await apiRequest.call(mockContext, 'GET', '/endpoints/v2.0/Endpoints');

      expect(calls).toBe(2);
      expect(result).toEqual({ id: 'ok' });
    });

    it('should throw after exhausting 3 retries on persistent 429', async () => {
      const mockContext = {
        getCredentials: vi.fn(async () => ({
          baseUrl: 'https://bms-win22srv:444/bconnect',
          username: 'Administrator',
          password: 'test-password-do-not-use',
          ignoreSslIssues: false,
        })),
        helpers: {
          httpRequest: vi.fn(async () => {
            const err = Object.assign(new Error('Too Many Requests'), { response: { status: 429 } });
            throw err;
          }),
        },
        getNode: vi.fn(() => ({ name: 'Baramundi', type: 'baramundi', typeVersion: 1, position: [0, 0], parameters: {} })),
      } as unknown as IExecuteFunctions;

      await expect(
        apiRequest.call(mockContext, 'GET', '/endpoints/v2.0/Endpoints')
      ).rejects.toThrow();

      // 1 initial + 3 retries = 4 total calls
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(4);
    });

    it('should NOT retry on HTTP 404 (client error)', async () => {
      const mockContext = {
        getCredentials: vi.fn(async () => ({
          baseUrl: 'https://bms-win22srv:444/bconnect',
          username: 'Administrator',
          password: 'test-password-do-not-use',
          ignoreSslIssues: false,
        })),
        helpers: {
          httpRequest: vi.fn(async () => {
            const err = Object.assign(new Error('Not Found'), { response: { status: 404 } });
            throw err;
          }),
        },
        getNode: vi.fn(() => ({ name: 'Baramundi', type: 'baramundi', typeVersion: 1, position: [0, 0], parameters: {} })),
      } as unknown as IExecuteFunctions;

      await expect(
        apiRequest.call(mockContext, 'GET', '/endpoints/v2.0/Endpoints/nonexistent')
      ).rejects.toThrow();

      // No retries — exactly 1 call
      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(1);
    });

    it('should NOT retry on HTTP 401 (auth error)', async () => {
      const mockContext = {
        getCredentials: vi.fn(async () => ({
          baseUrl: 'https://bms-win22srv:444/bconnect',
          username: 'Administrator',
          password: 'test-password-do-not-use',
          ignoreSslIssues: false,
        })),
        helpers: {
          httpRequest: vi.fn(async () => {
            const err = Object.assign(new Error('Unauthorized'), { response: { status: 401 } });
            throw err;
          }),
        },
        getNode: vi.fn(() => ({ name: 'Baramundi', type: 'baramundi', typeVersion: 1, position: [0, 0], parameters: {} })),
      } as unknown as IExecuteFunctions;

      await expect(
        apiRequest.call(mockContext, 'GET', '/endpoints/v2.0/Endpoints')
      ).rejects.toThrow();

      expect(mockContext.helpers.httpRequest).toHaveBeenCalledTimes(1);
    });

    it('should retry on ETIMEDOUT network error', async () => {
      let calls = 0;
      const mockContext = {
        getCredentials: vi.fn(async () => ({
          baseUrl: 'https://bms-win22srv:444/bconnect',
          username: 'Administrator',
          password: 'test-password-do-not-use',
          ignoreSslIssues: false,
        })),
        helpers: {
          httpRequest: vi.fn(async () => {
            calls++;
            if (calls === 1) {
              const err = Object.assign(new Error('ETIMEDOUT'), { code: 'ETIMEDOUT' });
              throw err;
            }
            return { id: 'ok' };
          }),
        },
        getNode: vi.fn(() => ({ name: 'Baramundi', type: 'baramundi', typeVersion: 1, position: [0, 0], parameters: {} })),
      } as unknown as IExecuteFunctions;

      const result = await apiRequest.call(mockContext, 'GET', '/endpoints/v2.0/Endpoints');
      expect(calls).toBe(2);
      expect(result).toEqual({ id: 'ok' });
    });
  });
});
