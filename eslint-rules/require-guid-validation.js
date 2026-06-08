/**
 * ESLint rule: require-guid-validation
 *
 * Flags any call to getNodeParameter() whose first argument is a string literal
 * ending in "Id" when the receiving block does not also call validateGuid().
 *
 * This prevents the class of path-manipulation vulnerability where a GUID
 * parameter is used in a URL without first being validated.
 */

'use strict';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require validateGuid() after getNodeParameter() calls for *Id parameters',
      category: 'Security',
      recommended: true,
    },
    schema: [],
    messages: {
      missingValidation:
        "getNodeParameter('{{ param }}') returns an ID but validateGuid() was not called in this block. " +
        'Add: const v = validateGuid({{ varName }}); if (!v.valid) throw new NodeOperationError(...)',
    },
  },

  create(context) {
    return {
      VariableDeclarator(node) {
        // Match: const someId = this.getNodeParameter('someId', ...) as string
        // The TSAsExpression wrapper (TypeScript cast) is transparent to ESLint's AST
        const init = node.init;
        if (!init) return;

        // Unwrap TSAsExpression if present (typescript-eslint parses `as string`)
        const call = init.type === 'TSAsExpression' ? init.expression : init;
        if (!call || call.type !== 'CallExpression') return;

        const callee = call.callee;
        if (
          callee.type !== 'MemberExpression' ||
          callee.property.type !== 'Identifier' ||
          callee.property.name !== 'getNodeParameter'
        ) return;

        const args = call.arguments;
        if (!args.length || args[0].type !== 'Literal') return;

        const paramName = args[0].value;
        if (typeof paramName !== 'string' || !paramName.endsWith('Id')) return;

        // Get the variable name being assigned to
        const varName =
          node.id.type === 'Identifier' ? node.id.name : null;
        if (!varName) return;

        // Walk up to the nearest BlockStatement or Program body
        let blockBody = null;
        let current = node.parent; // VariableDeclaration
        while (current) {
          if (
            current.type === 'BlockStatement' ||
            current.type === 'Program'
          ) {
            blockBody = current.body;
            break;
          }
          current = current.parent;
        }
        if (!blockBody) return;

        // Check whether validateGuid(varName) is called anywhere in that block
        const hasValidation = blockBody.some((stmt) =>
          containsValidateGuidCall(stmt, varName),
        );

        if (!hasValidation) {
          context.report({
            node,
            messageId: 'missingValidation',
            data: { param: paramName, varName },
          });
        }
      },
    };
  },
};

/**
 * Recursively check whether a subtree contains a call to validateGuid(varName).
 */
function containsValidateGuidCall(node, varName) {
  if (!node || typeof node !== 'object') return false;

  if (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'validateGuid' &&
    node.arguments.length >= 1 &&
    node.arguments[0].type === 'Identifier' &&
    node.arguments[0].name === varName
  ) {
    return true;
  }

  for (const key of Object.keys(node)) {
    if (key === 'parent') continue;
    const child = node[key];
    if (Array.isArray(child)) {
      if (child.some((c) => containsValidateGuidCall(c, varName))) return true;
    } else if (child && typeof child === 'object' && child.type) {
      if (containsValidateGuidCall(child, varName)) return true;
    }
  }

  return false;
}
