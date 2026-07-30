import type { Page } from '@playwright/test';

/**
 * Walk the page top to bottom so every IntersectionObserver has fired.
 *
 * Reveals, the process entrance sequence and the carousel's in-viewport check
 * are all observer-driven, so a test that only loads the page is asserting
 * against content that is still in its pending state.
 */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

/** Every resolution the brief calls out, as [label, width, height]. */
export const RESOLUTIONS: Array<[string, number, number]> = [
  ['375x812', 375, 812],
  ['390x844', 390, 844],
  ['768x1024', 768, 1024],
  ['820x1180', 820, 1180],
  ['1024x768', 1024, 768],
  ['1180x820', 1180, 820],
  ['1280x800', 1280, 800],
  ['1366x768', 1366, 768],
  ['1440x900', 1440, 900],
  ['1600x900', 1600, 900],
  ['1920x1080', 1920, 1080],
  ['2560x1440', 2560, 1440],
];
