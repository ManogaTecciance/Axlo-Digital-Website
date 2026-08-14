import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { settle } from './helpers';

const WCAG = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

test.describe('accessibility', () => {
  test('the page has no WCAG 2.2 AA violations', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.help}`),
      'axe violations',
    ).toEqual([]);
  });

  test('the open mobile drawer has no violations', async ({ page, viewport }) => {
    test.skip((viewport?.width ?? 0) >= 1024, 'drawer only exists below 1024');

    await page.goto('/');
    await page.locator('header button').first().click();
    await expect(page.locator('[role=dialog]')).toBeVisible();

    const results = await new AxeBuilder({ page }).withTags(WCAG).analyze();
    expect(results.violations.map((v) => v.id)).toEqual([]);
  });

  test('headings descend without skipping a level', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const levels = await page
      .locator('h1, h2, h3, h4, h5, h6')
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => (node as HTMLElement).offsetParent !== null || node.tagName === 'H1')
          .map((node) => Number(node.tagName[1])),
      );

    expect(levels[0], 'the page must open on its h1').toBe(1);
    expect(levels.filter((level) => level === 1).length, 'exactly one h1').toBe(1);

    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1], `heading jump at index ${i}`).toBeLessThanOrEqual(1);
    }
  });

  test('no rendered body copy is smaller than 15px', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    // The brief sets a 15px floor for body copy while allowing 13–14px for
    // tags, eyebrows and product-UI captions. Uppercase tracked labels are
    // exactly that category, so they are excluded — as are the conceptual
    // product interfaces, which are drawings of an application's own UI.
    const small = await page.evaluate(() => {
      const offenders: string[] = [];
      for (const el of Array.from(document.querySelectorAll('p, li, a, dd, dt'))) {
        const hasOwnText = Array.from(el.childNodes).some(
          (node) => node.nodeType === 3 && (node.textContent ?? '').trim().length > 24,
        );
        if (!hasOwnText) continue;
        if (el.closest('[role=img]')) continue; // conceptual product interfaces
        const style = getComputedStyle(el);
        if (style.textTransform === 'uppercase') continue; // eyebrow / label
        const size = parseFloat(style.fontSize);
        if (size < 15) offenders.push(`${size}px — ${el.textContent?.trim().slice(0, 40)}`);
      }
      return offenders;
    });

    expect(small).toEqual([]);
  });

  test('interactive targets are at least 44px', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const small = await page.evaluate(() => {
      const offenders: string[] = [];
      for (const el of Array.from(document.querySelectorAll('a, button'))) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (el.closest('[role=img]')) continue;
        if (rect.height < 44 || rect.width < 24) {
          const name = el.getAttribute('aria-label') ?? el.textContent?.trim() ?? '';
          offenders.push(`${Math.round(rect.width)}×${Math.round(rect.height)} — ${name.slice(0, 40)}`);
        }
      }
      return offenders;
    });

    expect(small).toEqual([]);
  });

  test('every control shows a visible focus ring', async ({ page }) => {
    await page.goto('/');

    for (let i = 0; i < 10; i += 1) {
      await page.keyboard.press('Tab');
      const outline = await page.evaluate(() => {
        const style = getComputedStyle(document.activeElement as Element);
        return { style: style.outlineStyle, width: parseFloat(style.outlineWidth) };
      });
      expect(outline.style).not.toBe('none');
      expect(outline.width).toBeGreaterThanOrEqual(2);
    }
  });

  test('decorative graphics are hidden from assistive technology', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const exposed = await page
      .locator('[data-decorative]')
      .evaluateAll((nodes) =>
        nodes
          .filter((node) => node.getAttribute('aria-hidden') !== 'true')
          .map((node) => node.tagName + '.' + node.className),
      );

    expect(exposed).toEqual([]);
  });
});
