import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./specs",
  reporter: "list",
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
      command: "API_PORT=3737 vp run --filter @template/api dev",
      url: "http://127.0.0.1:3737/health",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    },
    {
      command: "vp run --filter @template/web dev",
      url: "http://127.0.0.1:4173",
      reuseExistingServer: !process.env.CI,
      timeout: 120_000
    }
  ]
})
