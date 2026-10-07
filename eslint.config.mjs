import tseslint from 'typescript-eslint';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';
import { n8nCommunityNodesPlugin } from '@n8n/eslint-plugin-community-nodes';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const requireGuidValidation = require('./eslint-rules/require-guid-validation.js');

export default tseslint.config(
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**'],
  },
  ...tseslint.configs.recommended,
  {
    files: ['nodes/**/*.ts'],
    plugins: {
      local: { rules: { 'require-guid-validation': requireGuidValidation } },
    },
    rules: {
      'local/require-guid-validation': 'error',
    },
  },
  {
    files: ['**/*.ts'],
    plugins: {
      'n8n-nodes-base': n8nNodesBase,
    },
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],

      // n8n node rules
      'n8n-nodes-base/node-class-description-credentials-name-unsuffixed': 'error',
      'n8n-nodes-base/node-class-description-display-name-unsuffixed-trigger-node': 'error',
      'n8n-nodes-base/node-class-description-icon-not-svg': 'warn',
      // Off, as in @n8n/node-cli's config: they demand ['main'], while the community-node
      // rule node-connection-type-literal demands NodeConnectionTypes.Main.
      'n8n-nodes-base/node-class-description-inputs-wrong-regular-node': 'off',
      'n8n-nodes-base/node-class-description-missing-subtitle': 'warn',
      'n8n-nodes-base/node-class-description-outputs-wrong': 'off',
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
  // n8n's community-node rules: the set its verification scanner applies to a published
  // package (the same as `@n8n/node-cli`'s own lint config). Shipped code and package.json
  // only — tests and tooling may use timers, raw errors and so on.
  {
    files: ['nodes/**/*.ts', 'credentials/**/*.ts'],
    ...n8nCommunityNodesPlugin.configs.recommended,
  },
  {
    files: ['package.json'],
    ...n8nCommunityNodesPlugin.configs.recommended,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { extraFileExtensions: ['.json'] },
    },
    rules: {
      ...n8nCommunityNodesPlugin.configs.recommended.rules,
      // The TypeScript rules above are meant for code; a JSON document is one bare expression.
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
  {
    files: ['nodes/**/*.ts', 'credentials/**/*.ts', 'package.json'],
    rules: {
      // Known gaps, kept visible as warnings until fixed:
      // - icons: SVG with light/dark variants, waiting for the official logo
      '@n8n/community-nodes/icon-validation': 'warn',
      '@n8n/community-nodes/cred-class-field-icon-missing': 'warn',
      // `overrides` pins a patched axios in the dev tree only; publish.yml removes the field
      // from the published package.json, which is what n8n checks.
      '@n8n/community-nodes/no-overrides-field': 'off',
    },
  },
  {
    // Relax rules for test files — unused imports from test helpers are acceptable
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
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
