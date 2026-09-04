import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end suite.
 *
 * Runs against a real production build — `next build && next start` — because
 * most of what these tests assert (reveal observers, the scroll spy, reduced
 * motion, layout at twelve resolutions) behaves differently under the dev
 * server's overlays and un-minified CSS.
 *
 * The browser is Playwright's own bundled Chromium, so `pnpm test` works on a
 * clean checkout after `npx playwright install chromium` without depending on
 * which browser happens to be installed on the machine.
 */
const PORT = 4331;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'line' : [['list']],
  timeout: 60_000,
  expect: { timeout: 10_000 },

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
    /* Sandboxes and CI images sometimes ship a Chromium that Playwright did
       not download itself. Setting PLAYWRIGHT_CHROMIUM_PATH points the run at
       it; unset, Playwright uses its own bundled build as normal. */
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
  ],

  webServer: {
    command: `npx next build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
