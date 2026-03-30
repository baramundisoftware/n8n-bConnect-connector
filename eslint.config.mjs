import tseslint from 'typescript-eslint';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      'n8n-nodes-base': n8nNodesBase,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

      // n8n node rules
      'n8n-nodes-base/node-class-description-credentials-name-unsuffixed': 'error',
      'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'error',
      'n8n-nodes-base/node-class-description-icon-not-svg': 'warn',
      'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'error',
      'n8n-nodes-base/node-class-description-missing-subtitle': 'warn',
      'n8n-nodes-base/node-class-description-outputs-wrong': 'error',
      'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'warn',
      'n8n-nodes-base/node-param-default-wrong-for-boolean': 'error',
      'n8n-nodes-base/node-param-default-wrong-for-collection': 'error',
      'n8n-nodes-base/node-param-default-wrong-for-fixed-collection': 'error',
      'n8n-nodes-base/node-param-default-wrong-for-multi-options': 'error',
      'n8n-nodes-base/node-param-default-wrong-for-number': 'error',
      'n8n-nodes-base/node-param-default-wrong-for-options': 'error',
      'n8n-nodes-base/node-param-default-wrong-for-string': 'error',
      'n8n-nodes-base/node-param-description-boolean-without-whether': 'error',
      'n8n-nodes-base/node-param-description-empty-string': 'error',
      'n8n-nodes-base/node-param-description-excess-final-period': 'warn',
      'n8n-nodes-base/node-param-description-identical-to-display-name': 'warn',
      'n8n-nodes-base/node-param-description-missing-final-period': 'warn',
      'n8n-nodes-base/node-param-description-missing-for-ignore-ssl-issues': 'error',
      'n8n-nodes-base/node-param-description-missing-for-return-all': 'error',
      'n8n-nodes-base/node-param-description-missing-for-simplify': 'error',
      'n8n-nodes-base/node-param-description-missing-from-dynamic-options': 'error',
      'n8n-nodes-base/node-param-description-wrong-for-dynamic-options': 'error',
      'n8n-nodes-base/node-param-description-wrong-for-return-all': 'error',
      'n8n-nodes-base/node-param-description-wrong-for-simplify': 'error',
      'n8n-nodes-base/node-param-display-name-excess-inner-whitespace': 'error',
      'n8n-nodes-base/node-param-display-name-miscased': 'error',
      'n8n-nodes-base/node-param-display-name-miscased-id': 'error',
      'n8n-nodes-base/node-param-display-name-untrimmed': 'error',
      'n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options': 'error',
      'n8n-nodes-base/node-param-display-name-wrong-for-simplify': 'error',
      'n8n-nodes-base/node-param-display-name-wrong-for-update-fields': 'error',
      'n8n-nodes-base/node-param-min-value-wrong-for-limit': 'error',
      'n8n-nodes-base/node-param-multi-options-type-unsorted-items': 'warn',
      'n8n-nodes-base/node-param-operation-without-no-data-expression': 'error',
      'n8n-nodes-base/node-param-option-description-identical-to-name': 'warn',
      'n8n-nodes-base/node-param-option-name-containing-star': 'error',
      'n8n-nodes-base/node-param-option-name-duplicate': 'error',
      'n8n-nodes-base/node-param-option-name-wrong-for-get-many': 'error',
      'n8n-nodes-base/node-param-option-name-wrong-for-upsert': 'error',
      'n8n-nodes-base/node-param-option-value-duplicate': 'error',
      'n8n-nodes-base/node-param-options-type-unsorted-items': 'warn',
      'n8n-nodes-base/node-param-placeholder-miscased-id': 'error',
      'n8n-nodes-base/node-param-required-false': 'error',
      'n8n-nodes-base/node-param-resource-with-plural-option': 'error',
      'n8n-nodes-base/node-param-resource-without-no-data-expression': 'error',
      'n8n-nodes-base/node-param-type-options-missing-from-limit': 'error',
    },
  },
  {
    files: ['credentials/**/*.ts'],
    plugins: {
      'n8n-nodes-base': n8nNodesBase,
    },
    rules: {
      'n8n-nodes-base/cred-class-field-display-name-miscased': 'error',
      'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'error',
      'n8n-nodes-base/cred-class-field-name-missing-oauth2': 'error',
      'n8n-nodes-base/cred-class-field-name-unsuffixed': 'error',
      'n8n-nodes-base/cred-class-field-name-uppercase-first-char': 'error',
      'n8n-nodes-base/cred-class-name-unsuffixed': 'error',
    },
  },
);
