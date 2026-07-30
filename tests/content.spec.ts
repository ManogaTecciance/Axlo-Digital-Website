import { expect, test } from '@playwright/test';
import { settle } from './helpers';

test.describe('content and conversion', () => {
  test('every project CTA uses the same wording', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    // The header CTA, the hero primary and the closing action are one action,
    // so every label that begins with "Start" must read identically. (The nav
    // "Contact" item points at the same section but is a different affordance,
    // hence the filter on the verb rather than on the destination.)
    const labels = await page
      .locator('a[href="#contact"], a[href^="mailto:hello@axlodigital.com"]')
      .evaluateAll((links) =>
        links
          .map((link) => (link.textContent ?? '').trim())
          .filter((text) => /^start/i.test(text)),
      );

    expect(labels.length, 'expected to find the project CTAs').toBeGreaterThanOrEqual(2);
    for (const label of labels) {
      expect(label, 'CTA wording drifted').toBe('Start a project');
    }

    // And the discarded variants are gone from the page entirely.
    await expect(page.getByText('Start a conversation')).toHaveCount(0);
  });

  test('the trust layer makes no unverifiable claim', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const body = (await page.locator('body').textContent()) ?? '';

    // No client counts, no outcome percentages, no years-of-experience claims.
    expect(body).not.toMatch(/\d+\+?\s*(clients|customers|projects|years)/i);
    expect(body).not.toMatch(/\d+%\s*(increase|growth|faster|more|improvement)/i);
    expect(body).not.toMatch(/trusted by|award[- ]winning|industry[- ]leading|best[- ]in[- ]class/i);
  });

  test('no placeholder copy survives', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const body = (await page.locator('body').textContent()) ?? '';
    expect(body).not.toMatch(/lorem ipsum|TODO|FIXME|placeholder text/i);
  });

  test('SEO metadata is complete', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('Axlo Digital — Connected Digital Products for Real Operations');

    const meta = async (selector: string) =>
      page.locator(selector).first().getAttribute('content');

    expect(await meta('meta[name="description"]')).toContain('connected digital products');
    expect(await meta('meta[property="og:title"]')).toContain('Axlo Digital');
    expect(await meta('meta[property="og:description"]')).toBeTruthy();
    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await meta('meta[name="theme-color"]')).toBe('#0B1220');

    // The OG image must be a raster — SVG cards do not render on any major
    // social platform.
    const ogImage = await meta('meta[property="og:image"]');
    expect(ogImage, 'og:image').toBeTruthy();
    expect(ogImage).not.toMatch(/\.svg/);

    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"]')).not.toHaveCount(0);
    await expect(page.locator('link[rel="apple-touch-icon"]')).not.toHaveCount(0);
  });

  test('structured data is present and claims nothing it cannot support', async ({ page }) => {
    await page.goto('/');

    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent ?? '{}')));

    const flat = blocks.flat();
    const types = flat.map((entry: { '@type': string }) => entry['@type']);
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');
    expect(types.filter((type: string) => type === 'SoftwareApplication')).toHaveLength(2);

    // Ratings, reviews and offers are all rich-result eligible; inventing them
    // would be both a false claim and a structured-data violation.
    for (const entry of flat) {
      expect(entry).not.toHaveProperty('aggregateRating');
      expect(entry).not.toHaveProperty('review');
      expect(entry).not.toHaveProperty('offers');
    }
  });

  test('analytics events reach a tag manager when one exists, silently otherwise', async ({ page }) => {
    await page.goto('/');
    // Nothing is installed, so nothing is created — the bridge must not invent
    // an analytics surface of its own.
    expect(await page.evaluate(() => 'dataLayer' in window)).toBe(false);

    // With a queue present, interactions report into it.
    await page.evaluate(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    });
    await page.getByRole('link', { name: 'Explore our products' }).click();
    await page.waitForTimeout(600);

    const events = await page.evaluate(
      () => (window as unknown as { dataLayer: Array<{ event: string }> }).dataLayer.map((e) => e.event),
    );
    expect(events.length).toBeGreaterThan(0);
    expect(events.some((event) => event.startsWith('nav_') || event.startsWith('cta_'))).toBe(true);
  });
});
