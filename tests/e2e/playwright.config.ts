import { defineConfig, devices } from '@playwright/test';

const reuseServer = process.env.PLAYWRIGHT_REUSE_SERVER === 'true';
const apiHost = process.env.API_HOST ?? '127.0.0.1';
const apiPort = process.env.API_PORT ?? '3747';
const apiBaseUrl = `http://${apiHost}:${apiPort}`;
const webPort = process.env.WEB_PORT ?? '4273';
const webBaseUrl = `http://127.0.0.1:${webPort}`;

export default defineConfig({
  testDir: './specs',
  reporter: 'list',
  retries: process.env.CI ? 1 : 0,
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  use: {
    baseURL: webBaseUrl,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'vp run --filter @template/api dev',
      url: `${apiBaseUrl}/health`,
      env: {
        APP_PROFILE: process.env.APP_PROFILE ?? 'test',
        API_HOST: apiHost,
        API_PORT: apiPort,
        TODO_DB_PATH: process.env.TODO_DB_PATH ?? '.data/todos.test.sqlite',
      },
      reuseExistingServer: reuseServer,
      timeout: 180_000,
    },
    {
      command: 'vp run --filter @template/web build && vp run --filter @template/web e2e:preview',
      url: webBaseUrl,
      env: {
        API_BASE_URL: apiBaseUrl,
        WEB_PORT: webPort,
      },
      reuseExistingServer: reuseServer,
      timeout: 180_000,
    },
  ],
});
