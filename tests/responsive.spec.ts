import { expect, test } from '@playwright/test';
import { NAV_BREAKPOINT, RESOLUTIONS, SAMPLE_ROUTES, settle } from './helpers';

/**
 * Layout integrity at every resolution the brief calls out.
 *
 * Runs on the desktop project only — the viewport is set per test, so running
 * the same sizes twice would just be the same assertions again.
 */
test.describe('responsive layout', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) < NAV_BREAKPOINT, 'viewport is set per test');

  for (const [label, width, height] of RESOLUTIONS) {
    test(`${label} has no horizontal overflow on any template`, async ({ page }) => {
      await page.setViewportSize({ width, height });

      for (const route of SAMPLE_ROUTES) {
        await page.goto(route);
        await settle(page);

        const overflow = await page.evaluate(() => ({
          doc: document.documentElement.scrollWidth,
          win: window.innerWidth,
        }));

        expect(
          overflow.doc,
          `${route}: ${overflow.doc}px of content in a ${overflow.win}px viewport`,
        ).toBeLessThanOrEqual(overflow.win);
      }
    });
  }

  test('the header nav becomes a drawer below the breakpoint and not above it', async ({ page }) => {
    await page.goto('/');

    await page.setViewportSize({ width: NAV_BREAKPOINT, height: 900 });
    await page.waitForTimeout(200);
    await expect(page.locator('header nav a').first()).toBeVisible();

    await page.setViewportSize({ width: NAV_BREAKPOINT - 1, height: 900 });
    await page.waitForTimeout(200);
    await expect(page.locator('header nav a').first()).toBeHidden();
    await expect(page.locator('header button').first()).toBeVisible();
  });

  test('the header row never wraps at the breakpoint it claims to fit', async ({ page }) => {
    // Seven nav items, a logo and a CTA is the tightest row on the site; a
    // wrapped header is the failure this breakpoint was chosen to avoid.
    for (const width of [NAV_BREAKPOINT, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/');
      await page.waitForTimeout(200);

      const height = await page
        .locator('header')
        .evaluate((el) => el.getBoundingClientRect().height);
      expect(height, `${width}px header height`).toBeLessThan(100);
    }
  });

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

  test('every product panel gives its visual the same share of the row', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await settle(page);

    const shares = await page.locator('#products article').evaluateAll((panels) =>
      panels.map((panel) => {
        // Carousel for products with composed screens, module map for the rest.
        const visual =
          panel.querySelector('[aria-roledescription=carousel]') ?? panel.querySelector('figure');
        if (!visual) return 0;
        return visual.getBoundingClientRect().width / panel.getBoundingClientRect().width;
      }),
    );

    expect(shares).toHaveLength(4);
    for (const share of shares) {
      expect(share).toBeGreaterThan(0.5);
      expect(share).toBeLessThan(0.7);
    }
    // No panel is materially wider than any other — neither side of the flip,
    // and neither presentation.
    expect(Math.max(...shares) - Math.min(...shares)).toBeLessThan(0.03);
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
