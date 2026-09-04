import { expect, test } from '@playwright/test';
import { settle } from './helpers';

/** The five approved section anchors, in document order. */
const ANCHORS = ['#home', '#services', '#products', '#how-we-work', '#contact'];

test.describe('navigation', () => {
  test('every primary link resolves to a section on this page', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('header nav a').evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );

    expect(hrefs).toEqual(['#services', '#products', '#how-we-work', '#contact']);

    for (const href of hrefs) {
      await expect(page.locator(href as string)).toHaveCount(1);
    }
  });

  test('all five approved anchors exist exactly once, on a section', async ({ page }) => {
    await page.goto('/');

    for (const anchor of ANCHORS) {
      const target = page.locator(anchor);
      await expect(target, anchor).toHaveCount(1);
      expect(
        await target.evaluate((el) => el.tagName.toLowerCase()),
        `${anchor} must be a section, so it inherits the sticky-header offset`,
      ).toBe('section');
    }
  });

  test('the logo returns to the top of the page', async ({ page }) => {
    await page.goto('/');
    const brand = page.locator('header a').first();
    await expect(brand).toHaveAttribute('href', '#home');
    await expect(brand).toHaveAttribute('aria-label', /Axlo Digital/);
  });

  test('the header project action points at the closing section', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile', 'header CTA is in the drawer below 1024');

    const cta = page.locator('header a[href="#contact"]').last();
    await page.goto('/');
    await expect(cta).toBeVisible();
    await expect(cta).toHaveText('Talk to Axlo');
  });

  test('no section heading is hidden behind the sticky header, at any anchor', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    for (const anchor of ANCHORS) {
      await page.evaluate((id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, anchor.slice(1));
      await page.waitForTimeout(250);

      const clear = await page.evaluate((id) => {
        const section = document.getElementById(id)!;
        const heading = section.querySelector('h1, h2');
        if (!heading) return { ok: true, id };
        const header = document.querySelector('header')!.getBoundingClientRect();
        // A hair of tolerance: sub-pixel rounding at fractional zoom levels.
        return { ok: heading.getBoundingClientRect().top >= header.bottom - 1, id };
      }, anchor.slice(1));

      expect(clear.ok, `${anchor} heading sits under the sticky header`).toBe(true);
    }
  });

  test('no link anywhere on the page is dead', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const bad = await page.locator('a[href]').evaluateAll((links) =>
      links
        .map((link) => link.getAttribute('href') as string)
        .filter((href) => {
          if (href.startsWith('mailto:') || href.startsWith('http')) return false;
          if (href.startsWith('#')) return !document.querySelector(href);
          return false;
        }),
    );

    expect(bad).toEqual([]);
  });

  test('clicking a section link scrolls there and clears the sticky header', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile', 'desktop nav is a drawer below 1024');

    await page.goto('/');
    await page.locator('header nav a[href="#products"]').click();
    await page.waitForTimeout(1200);

    expect(page.url()).toContain('#products');

    const clear = await page.evaluate(() => {
      const heading = document.getElementById('products-heading')!.getBoundingClientRect();
      const header = document.querySelector('header')!.getBoundingClientRect();
      return heading.top >= header.bottom;
    });
    expect(clear, 'section heading must not sit under the sticky header').toBe(true);
  });

  test('the active section is marked with aria-current, not colour alone', async ({ page }) => {
    test.skip(test.info().project.name === 'mobile', 'desktop nav is a drawer below 1024');

    await page.goto('/');
    await page.locator('header nav a[href="#how-we-work"]').click();
    await page.waitForTimeout(1200);

    const current = page.locator('header nav a[aria-current="true"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('How We Work');

    // The state carries a rule as well as a colour change.
    const rule = await current.evaluate((el) => {
      const style = getComputedStyle(el, '::after');
      return { transform: style.transform, opacity: style.opacity };
    });
    expect(rule.opacity).toBe('1');
  });

  test('the header is transparent at rest and takes a surface once scrolled', async ({ page }) => {
    await page.goto('/');
    const header = page.locator('header');

    const atTop = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(atTop).toMatch(/rgba\(0, 0, 0, 0\)|transparent/);

    await page.evaluate(() => window.scrollTo(0, 600));
    await page.waitForTimeout(400);
    const scrolled = await header.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(scrolled).not.toBe(atTop);
  });
});

test.describe('mobile drawer', () => {
  test.skip(({ viewport }) => (viewport?.width ?? 0) >= 1024, 'drawer only exists below 1024');

  test('traps focus, closes on Escape, and hands focus to the destination', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button').first().click();
    await expect(page.locator('[role=dialog]')).toBeVisible();

    for (let i = 0; i < 8; i += 1) {
      await page.keyboard.press('Tab');
      const inside = await page.evaluate(() => !!document.activeElement?.closest('[role=dialog]'));
      expect(inside, 'focus escaped the drawer').toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(page.locator('[role=dialog]')).toHaveCount(0);

    await page.locator('header button').first().click();
    await page.locator('[role=dialog] a[href="#products"]').click();
    await page.waitForTimeout(1200);

    await expect(page.locator('[role=dialog]')).toHaveCount(0);
    expect(page.url()).toContain('#products');
    // Focus lands on the destination, not back on the trigger.
    expect(await page.evaluate(() => document.activeElement?.id)).toBe('products');
  });
});
