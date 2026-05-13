import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    ignorePatterns: ['.agents/**', 'repos/**', '**/dist/**'],
    singleQuote: true,
    semi: true,
    sortPackageJson: true,
  },
  lint: {
    plugins: ['typescript', 'import'],
    ignorePatterns: [
      '.agents/**',
      'repos/**',
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      'test-results/**',
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'import/no-cycle': 'error',
      'eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@template/api/src/**', 'apps/api/src/**'],
              message: 'Import through public package interfaces, not Application internals.',
            },
            {
              group: ['@template/web/src/**', 'apps/web/src/**'],
              message: 'Import through public package interfaces, not Application internals.',
            },
          ],
        },
      ],
    },
    overrides: [
      {
        files: ['apps/**/src/**', 'packages/**/src/**'],
        rules: {
          'import/no-relative-parent-imports': 'error',
        },
      },
      {
        files: ['**/*.{test,spec}.{ts,tsx,js,jsx,mts,cts}'],
        rules: {
          'import/no-relative-parent-imports': 'off',
        },
      },
    ],
  },
  test: {
    passWithNoTests: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', 'repos/**', 'tests/e2e/**', '**/tests/e2e/**'],
  },
});
