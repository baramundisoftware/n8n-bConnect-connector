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
      exclude: ['**/*.test.ts', '**/*.spec.ts', 'node_modules/**', 'dist/**'],
    },
  },
});
