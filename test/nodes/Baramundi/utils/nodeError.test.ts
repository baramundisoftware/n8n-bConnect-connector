import { describe, it, expect } from 'vitest';
import { NodeApiError, NodeOperationError, type INode } from 'n8n-workflow';
import { toItemError } from '../../../../nodes/shared/utils/nodeError';

const node: INode = { id: '1', name: 'baramundi Endpoint', type: 'baramundiEndpoint', typeVersion: 1, position: [0, 0], parameters: {} };

describe('toItemError()', () => {
  it('keeps a NodeApiError with its HTTP code and message, and adds the item index', () => {
    const apiError = new NodeApiError(node, { message: 'x' }, { message: 'Resource Not Found', httpCode: '404' });
    const e = toItemError(node, apiError, 3);
    expect(e).toBe(apiError);
    expect(e).toBeInstanceOf(NodeApiError);
    expect((e as NodeApiError).httpCode).toBe('404');
    expect(e.message).toBe('Resource Not Found');
    expect(e.context.itemIndex).toBe(3);
  });

  it('keeps an item index that is already set', () => {
    const opError = new NodeOperationError(node, 'Invalid GUID', { itemIndex: 1 });
    expect(toItemError(node, opError, 5).context.itemIndex).toBe(1);
  });

  it('wraps a raw Error in a NodeOperationError with the item index', () => {
    const e = toItemError(node, new TypeError('Cannot read properties of undefined'), 2);
    expect(e).toBeInstanceOf(NodeOperationError);
    expect(e.message).toBe('Cannot read properties of undefined');
    expect(e.context.itemIndex).toBe(2);
  });

  it('wraps a thrown non-Error value', () => {
    const e = toItemError(node, 'boom', 0);
    expect(e).toBeInstanceOf(NodeOperationError);
    expect(e.message).toBe('boom');
  });
});
