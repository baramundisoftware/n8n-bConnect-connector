import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // E2E tests hit a rate-limited mock (100 req/min) — allow generous timeouts
    hookTimeout: 30000,
    testTimeout: 15000,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['nodes/**/*.ts', 'credentials/**/*.ts'],
      exclude: [
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.fields.ts',
        '**/*.node.ts',
        '**/index.ts',
        '**/router.ts',
        'credentials/**',
        'node_modules/**',
        'dist/**',
      ],
      // Ratchet: just below the current numbers so coverage cannot silently drop.
      // Raise these when coverage goes up; never lower them without a reason in the PR.
      // Measured by `npm run test:coverage` (unit + conformance, no live-server tests).
      thresholds: {
        statements: 94,
        branches: 83,
        functions: 96,
        lines: 95,
      },
    },
  },
});
