import { expect, test } from '@playwright/test';
import { RESOLUTIONS, settle } from './helpers';

/**
 * Layout integrity at every resolution the brief calls out.
 *
 * Runs on the desktop project only — the viewport is set per test, so running
 * the same twelve sizes twice would just be the same assertions again.
 */
test.describe('responsive layout', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < 1024, 'viewport is set per test');

  for (const [label, width, height] of RESOLUTIONS) {
    test(`${label} has no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await page.goto('/');
      await settle(page);

      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        win: window.innerWidth,
      }));

      expect(overflow.doc, `${overflow.doc}px of content in a ${overflow.win}px viewport`).toBeLessThanOrEqual(
        overflow.win,
      );
    });
  }

  test('the process section is four across on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await settle(page);

    const columns = await page
      .locator('#how-we-work ol')
      .first()
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);

    expect(columns).toBe(4);
  });

  test('the process section is 2 × 2 on tablet and vertical on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto('/');
    await settle(page);

    let columns = await page
      .locator('#how-we-work ol')
      .first()
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns, 'tablet').toBe(2);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    columns = await page
      .locator('#how-we-work ol')
      .first()
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns, 'mobile').toBe(1);
  });

  test('product panels are two columns on desktop and one on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await settle(page);

    let columns = await page
      .locator('#products article')
      .first()
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns, 'desktop').toBe(2);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(300);
    columns = await page
      .locator('#products article')
      .first()
      .evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    expect(columns, 'mobile').toBe(1);
  });

  test('the flipped product gets the wide column, not the narrow one', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await settle(page);

    const widths = await page.locator('#products article').evaluateAll((panels) =>
      panels.map((panel) => {
        const visual = panel.querySelector('[aria-roledescription=carousel]')!;
        return visual.getBoundingClientRect().width / panel.getBoundingClientRect().width;
      }),
    );

    // Both products' visuals take the same share of their row.
    for (const share of widths) {
      expect(share).toBeGreaterThan(0.55);
      expect(share).toBeLessThan(0.68);
    }
    expect(Math.abs(widths[0] - widths[1])).toBeLessThan(0.02);
  });

  test('the hero headline holds its two authored lines on a laptop', async ({ page }) => {
    for (const width of [1366, 1440, 1600]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');

      const lines = await page.locator('h1').evaluate((el) => {
        const style = getComputedStyle(el);
        const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.02;
        return Math.round(el.getBoundingClientRect().height / lineHeight);
      });

      expect(lines, `${width}px`).toBe(2);
    }
  });
});
