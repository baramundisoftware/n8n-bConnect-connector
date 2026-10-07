import type { INode } from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';

/**
 * The error an execute() loop throws for item `itemIndex`. Errors that are already n8n node
 * errors keep their type, HTTP code and message (wrapping a NodeApiError in a
 * NodeOperationError would drop the HTTP code); they only get the item index if they lack
 * one. Anything else — a TypeError, a string — is wrapped, so n8n never shows a raw error.
 */
export function toItemError(node: INode, error: unknown, itemIndex: number): NodeApiError | NodeOperationError {
  if (error instanceof NodeApiError || error instanceof NodeOperationError) {
    error.context.itemIndex ??= itemIndex;
    return error;
  }
  return new NodeOperationError(node, error instanceof Error ? error : String(error), { itemIndex });
}
