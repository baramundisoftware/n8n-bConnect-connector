/**
 * System Test Setup
 *
 * Provides utilities for system tests against live bConnect API
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { vi } from 'vitest';

export interface SystemTestConfig {
  baseUrl: string;
  authMethod: 'basicAuth' | 'apiKey';
  username: string;
  password: string;
  apiKey: string;
  ignoreSslIssues: boolean;
}

/**
 * Get system test configuration from environment variables
 * Returns null if credentials are not configured
 */
export function getSystemTestConfig(): SystemTestConfig | null {
  const baseUrl = process.env.BCONNECT_BASE_URL || '';
  const username = process.env.BCONNECT_USERNAME || '';
  const password = process.env.BCONNECT_PASSWORD || '';
  const apiKey = process.env.BCONNECT_API_KEY || '';
  const ignoreSslIssues = process.env.BCONNECT_IGNORE_SSL !== 'false';
  const authMethod = apiKey ? 'apiKey' : 'basicAuth';

  // Check if we have valid credentials (either basic auth or API key)
  if (!baseUrl || (!apiKey && (!username || !password))) {
    return null;
  }

  return {
    baseUrl,
    authMethod,
    username,
    password,
    apiKey,
    ignoreSslIssues,
  };
}

/**
 * Create a real IExecuteFunctions context for system tests
 * This makes actual HTTP requests to the bConnect API
 */
export function createSystemTestContext(
  params: Record<string, any> = {},
  config: SystemTestConfig = getSystemTestConfig()!,
): IExecuteFunctions {
  const axios = require('axios');
  const https = require('https');

  // Create axios instance with proper SSL handling
  const isApiKey = config.authMethod === 'apiKey';
  const axiosInstance = axios.create({
    baseURL: config.baseUrl,
    ...(isApiKey ? {} : {
      auth: {
        username: config.username,
        password: config.password,
      },
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(isApiKey ? { 'X-Api-Key': config.apiKey } : {}),
    },
    httpsAgent: config.ignoreSslIssues ? new https.Agent({ rejectUnauthorized: false }) : undefined,
  });

  return {
    getNodeParameter: (name: string, index: number, defaultValue?: any) => {
      return params[name] !== undefined ? params[name] : defaultValue;
    },
    getCredentials: async () => ({
      baseUrl: config.baseUrl,
      authMethod: config.authMethod,
      username: config.username,
      password: config.password,
      apiKey: config.apiKey,
      ignoreSslIssues: config.ignoreSslIssues,
    }),
    helpers: {
      httpRequest: async (options: any) => {
        console.log(`[REAL API CALL] ${options.method || 'GET'} ${config.baseUrl}${options.url}`);

        const requestConfig: any = {
          method: options.method || 'GET',
          url: options.url,
          params: options.qs,
        };

        // Handle request body
        if (options.body !== undefined && Object.keys(options.body).length > 0) {
          requestConfig.data = options.body;
        }

        // Set Content-Type for PATCH/POST/PUT
        if (options.method === 'PATCH') {
          requestConfig.headers = {
            ...axiosInstance.defaults.headers,
            'Content-Type': 'application/json-patch+json',
          };
        } else if (['POST', 'PUT'].includes(options.method)) {
          requestConfig.headers = {
            ...axiosInstance.defaults.headers,
            'Content-Type': 'application/json',
          };
        }

        try {
          const response = await axiosInstance.request(requestConfig);
          return response.data;
        } catch (error: any) {
          if (error.response) {
            throw new Error(`HTTP ${error.response.status}: ${error.response.statusText} - ${JSON.stringify(error.response.data)}`);
          }
          throw error;
        }
      },
      returnJsonArray: (data: any) => {
        if (Array.isArray(data)) {
          return data.map((item) => ({ json: item })) as INodeExecutionData[];
        }
        return [{ json: data }] as INodeExecutionData[];
      },
    },
    getNode: () => ({
      id: 'system-test-node',
      name: 'Baramundi System Test',
      type: 'n8n-nodes-baramundi.baramundi',
      typeVersion: 1,
      position: [0, 0],
      parameters: {},
    }),
  } as unknown as IExecuteFunctions;
}

/**
 * Skip system tests if credentials are not available
 */
export function skipIfNoCredentials() {
  const config = getSystemTestConfig();
  if (!config) {
    return {
      skip: true,
      reason: 'bConnect credentials not configured. Set BCONNECT_BASE_URL and either BCONNECT_API_KEY or BCONNECT_USERNAME + BCONNECT_PASSWORD environment variables.',
    };
  }
  return { skip: false, reason: '' };
}

/**
 * Helper to generate unique test resource names
 */
export function generateTestResourceName(prefix: string): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_test_${timestamp}_${random}`;
}

/**
 * Helper to wait for a specified time (for async operations)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
