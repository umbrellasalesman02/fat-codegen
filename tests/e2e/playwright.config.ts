import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./specs",
  reporter: "list",
  retries: process.env.CI ? 1 : 0,
  globalSetup: "./global-setup.ts",
  globalTeardown: "./global-teardown.ts",
  use: {
    baseURL: "http://127.0.0.1:4173"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: [
    {
      command: "vp run --filter @template/api dev",
      url: "http://127.0.0.1:3737/health",
      env: {
        APP_PROFILE: process.env.APP_PROFILE ?? "test",
        API_HOST: process.env.API_HOST ?? "127.0.0.1",
        API_PORT: process.env.API_PORT ?? "3737",
        TODO_DB_PATH: process.env.TODO_DB_PATH ?? ".data/todos.test.sqlite"
      },
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: "vp run --filter @template/web build && vp run --filter @template/web e2e:preview",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ]
})
