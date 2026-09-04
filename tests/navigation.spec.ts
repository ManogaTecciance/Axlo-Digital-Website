import { expect, test } from '@playwright/test';
import { NAV_BREAKPOINT, ROUTES, SAMPLE_ROUTES, settle } from './helpers';

test.describe('navigation', () => {
  test('every route in the brief’s site map resolves', async ({ page }) => {
    for (const route of ROUTES) {
      const response = await page.goto(route);
      expect(response?.status(), `${route} should be reachable`).toBe(200);
    }
  });

  test('the header carries the seven primary destinations', async ({ page }) => {
    test.skip(
      (test.info().project.use.viewport?.width ?? 0) < NAV_BREAKPOINT,
      'the drawer serves narrower viewports',
    );

    await page.goto('/');
    const hrefs = await page
      .locator('header nav a')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href')));

    expect(hrefs).toEqual([
      '/what-we-do',
      '/products',
      '/solutions',
      '/industries',
      '/why-axlo',
      '/about',
      '/insights',
    ]);
  });

  test('no internal link anywhere on the site is dead', async ({ page }) => {
    const checked = new Set<string>();
    const dead: string[] = [];

    for (const route of SAMPLE_ROUTES) {
      await page.goto(route);
      await settle(page);

      const hrefs = await page.locator('a[href]').evaluateAll((links) =>
        links
          .map((link) => link.getAttribute('href') as string)
          .filter((href) => href.startsWith('/') && !href.startsWith('//')),
      );

      for (const href of hrefs) {
        const path = href.split('#')[0];
        if (!path || checked.has(path)) continue;
        checked.add(path);
        const response = await page.request.get(path);
        if (response.status() !== 200) dead.push(`${path} (${response.status()}) linked from ${route}`);
      }
    }

    expect(checked.size, 'expected to have followed a meaningful number of links').toBeGreaterThan(15);
    expect(dead).toEqual([]);
  });

  test('the current page is marked with aria-current, not colour alone', async ({ page }) => {
    test.skip(
      (test.info().project.use.viewport?.width ?? 0) < NAV_BREAKPOINT,
      'the drawer serves narrower viewports',
    );

    await page.goto('/products');

    const current = page.locator('header nav a[aria-current="page"]');
    await expect(current).toHaveCount(1);
    await expect(current).toHaveText('Products');

    // The state carries a rule and a weight change as well as a colour.
    const marks = await current.evaluate((el) => ({
      weight: getComputedStyle(el).fontWeight,
      ruleOpacity: getComputedStyle(el, '::after').opacity,
    }));
    expect(Number(marks.weight)).toBeGreaterThanOrEqual(600);
    expect(Number(marks.ruleOpacity)).toBeGreaterThan(0);
  });

  test('a child route marks its parent section without claiming to be it', async ({ page }) => {
    test.skip(
      (test.info().project.use.viewport?.width ?? 0) < NAV_BREAKPOINT,
      'the drawer serves narrower viewports',
    );

    await page.goto('/products/comply360');

    // "Products" is flagged as the section, but nothing claims to be the page.
    await expect(page.locator('header nav a[aria-current="true"]')).toHaveText('Products');
    await expect(page.locator('header nav a[aria-current="page"]')).toHaveCount(0);
  });

  test('secondary pages carry a breadcrumb trail that matches their structured data', async ({
    page,
  }) => {
    await page.goto('/products/comply360');

    const crumbs = await page
      .locator('nav[aria-label="Breadcrumb"] a, nav[aria-label="Breadcrumb"] [aria-current="page"]')
      .allInnerTexts();
    expect(crumbs).toEqual(['Home', 'Products', 'Comply360']);

    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent ?? '{}')));
    const breadcrumb = blocks.find((b: { '@type': string }) => b['@type'] === 'BreadcrumbList');

    expect(breadcrumb, 'BreadcrumbList markup must accompany a visible trail').toBeTruthy();
    expect(
      breadcrumb.itemListElement.map((item: { name: string }) => item.name),
    ).toEqual(crumbs);
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
  test.skip(
    ({ viewport }) => (viewport?.width ?? 0) >= NAV_BREAKPOINT,
    'the drawer only exists below the nav breakpoint',
  );

  test('traps focus and closes on Escape', async ({ page }) => {
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
  });

  test('navigates and closes itself on the route change', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button').first().click();
    await page.locator('[role=dialog] a[href="/products"]').first().click();

    await page.waitForURL('**/products');
    await expect(page.locator('[role=dialog]')).toHaveCount(0);
    await expect(page.locator('h1')).toContainText('Technology for the way');
  });

  test('shows the product and solution children inline', async ({ page }) => {
    await page.goto('/');
    await page.locator('header button').first().click();

    const drawer = page.locator('[role=dialog]');
    await expect(drawer.locator('a[href="/products/comply360"]')).toHaveCount(1);
    await expect(drawer.locator('a[href="/products/axlo-payroll"]')).toHaveCount(1);
    await expect(drawer.locator('a[href="/solutions/odoo"]')).toHaveCount(1);
    await expect(drawer.locator('a[href="/solutions/custom-software"]')).toHaveCount(1);
  });
});
