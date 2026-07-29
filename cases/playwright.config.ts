import process from "node:process";
import { defineConfig, devices } from "@playwright/test";

const casesUrl = "http://127.0.0.1:8002";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    actionTimeout: 0,
    baseURL: casesUrl,
    headless: !!process.env.CI,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
      },
    },
    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    name: "cases",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    url: casesUrl,
  },
});
