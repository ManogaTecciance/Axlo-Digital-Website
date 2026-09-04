import { expect, test } from '@playwright/test';
import { SAMPLE_ROUTES, settle } from './helpers';

test.describe('content and conversion', () => {
  test('every conversion CTA uses the one approved label', async ({ page }) => {
    // Brief §4 names the primary CTA and §26 requires it be consistent. The
    // labels it replaced must be gone, not merely outnumbered.
    for (const route of ['/', '/products', '/solutions', '/about', '/why-axlo']) {
      await page.goto(route);
      await settle(page);

      const labels = await page
        .locator('a[href="/contact"]')
        .evaluateAll((links) => links.map((link) => (link.textContent ?? '').trim()));

      const ctas = labels.filter((label) => !/^contact$/i.test(label));
      expect(ctas.length, `${route} should carry the primary CTA`).toBeGreaterThanOrEqual(1);
      for (const label of ctas) {
        expect(label, `CTA wording drifted on ${route}`).toBe('Talk to Axlo');
      }

      const body = (await page.locator('body').textContent()) ?? '';
      expect(body, `a retired CTA label survives on ${route}`).not.toMatch(
        /Start a project|Start a conversation|Start the conversation/i,
      );
    }
  });

  test('no page makes an unverifiable claim', async ({ page }) => {
    for (const route of SAMPLE_ROUTES) {
      await page.goto(route);
      await settle(page);

      const body = (await page.locator('body').textContent()) ?? '';

      // No client counts, no outcome percentages, no years-of-experience claims.
      expect(body, route).not.toMatch(/\d+\+?\s*(clients|customers|projects|years)/i);
      expect(body, route).not.toMatch(/\d+%\s*(increase|growth|faster|more|improvement)/i);
      expect(body, route).not.toMatch(
        /trusted by|award[- ]winning|industry[- ]leading|best[- ]in[- ]class/i,
      );
    }
  });

  test('no lorem or developer placeholder copy survives', async ({ page }) => {
    for (const route of SAMPLE_ROUTES) {
      await page.goto(route);
      await settle(page);

      const body = (await page.locator('body').textContent()) ?? '';
      expect(body, route).not.toMatch(/lorem ipsum|TODO|FIXME|placeholder text/i);
    }
  });

  test('the legal pages are live, not "coming soon"', async ({ page }) => {
    // Brief §23 and §26 make this a launch condition.
    for (const route of ['/legal/privacy', '/legal/terms', '/legal/cookies']) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);

      const text = (await page.locator('main').textContent()) ?? '';
      expect(text.length, `${route} must carry real policy text`).toBeGreaterThan(1500);
    }

    await page.goto('/');
    await settle(page);
    // The hero blockquote legitimately contains a <footer> for its attribution,
    // so the site footer is the last one on the page rather than the only one.
    const siteFooter = page.locator('body > footer').last();
    expect((await siteFooter.textContent()) ?? '').not.toMatch(/coming soon/i);
    await expect(siteFooter.locator('a[href="/legal/privacy"]')).toHaveCount(1);
    await expect(siteFooter.locator('a[href="/legal/terms"]')).toHaveCount(1);
  });

  test('mockup figures are labelled as demo data', async ({ page }) => {
    // Brief §2: sample figures must be labelled unless they are real, approved
    // data. None of these are.
    await page.goto('/products/comply360');
    await settle(page);

    // Scoped to the carousel: the logo lockup is also role="img".
    const frames = page.locator('[aria-roledescription=carousel] [role=img]');
    const count = await frames.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const label = await frames.nth(i).getAttribute('aria-label');
      expect(label, 'the disclosure must reach assistive technology too').toMatch(/demo data/i);
    }

    // And it is visible, not only announced.
    await expect(page.getByText('Demo data').first()).toBeVisible();
  });

  test('every page has unique, complete metadata', async ({ page }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const route of SAMPLE_ROUTES) {
      await page.goto(route);

      const title = await page.title();
      expect(title, `${route} title`).toBeTruthy();
      expect(titles.has(title), `${route} repeats another page's title`).toBe(false);
      titles.add(title);

      const meta = async (selector: string) =>
        page.locator(selector).first().getAttribute('content');

      const description = await meta('meta[name="description"]');
      expect(description, `${route} description`).toBeTruthy();
      expect(
        descriptions.has(description as string),
        `${route} repeats another page's description`,
      ).toBe(false);
      descriptions.add(description as string);

      expect(await meta('meta[property="og:title"]'), `${route} og:title`).toBeTruthy();
      expect(await meta('meta[property="og:description"]'), `${route} og:description`).toBeTruthy();
      await expect(page.locator('link[rel="canonical"]'), `${route} canonical`).toHaveCount(1);

      // Exactly one h1 per page.
      await expect(page.locator('h1'), `${route} h1 count`).toHaveCount(1);
    }
  });

  test('the homepage carries the shared social and icon metadata', async ({ page }) => {
    await page.goto('/');

    const meta = async (selector: string) => page.locator(selector).first().getAttribute('content');

    expect(await meta('meta[name="twitter:card"]')).toBe('summary_large_image');
    expect(await meta('meta[name="theme-color"]')).toBe('#0B1220');

    // The OG image must be a raster — SVG cards do not render on any major
    // social platform.
    const ogImage = await meta('meta[property="og:image"]');
    expect(ogImage, 'og:image').toBeTruthy();
    expect(ogImage).not.toMatch(/\.svg/);

    await expect(page.locator('link[rel="icon"]')).not.toHaveCount(0);
    await expect(page.locator('link[rel="apple-touch-icon"]')).not.toHaveCount(0);
  });

  test('the sitemap lists every route and nothing that 404s', async ({ page }) => {
    const xml = await (await page.request.get('/sitemap.xml')).text();
    const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

    expect(urls.length, 'sitemap should cover the whole site').toBeGreaterThanOrEqual(28);

    for (const route of ['/products/axlo-budget', '/solutions/quickbooks', '/industries/retail', '/legal/terms']) {
      expect(urls.some((url) => url.endsWith(route)), `${route} missing from sitemap`).toBe(true);
    }

    // Spot-check that what is advertised actually resolves.
    for (const url of urls.slice(0, 8)) {
      const path = new URL(url).pathname || '/';
      expect((await page.request.get(path)).status(), path).toBe(200);
    }
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
    expect(types.filter((type: string) => type === 'SoftwareApplication')).toHaveLength(4);

    // Ratings, reviews and offers are all rich-result eligible; inventing them
    // would be both a false claim and a structured-data violation.
    for (const entry of flat) {
      expect(entry).not.toHaveProperty('aggregateRating');
      expect(entry).not.toHaveProperty('review');
    }
  });

  test('analytics events reach a tag manager when one exists, silently otherwise', async ({
    page,
  }) => {
    await page.goto('/');
    // Nothing is installed, so nothing is created — the bridge must not invent
    // an analytics surface of its own.
    expect(await page.evaluate(() => 'dataLayer' in window)).toBe(false);

    // With a queue present, interactions report into it.
    await page.evaluate(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    });
    await page.getByRole('link', { name: 'Explore Our Products' }).first().click();
    await page.waitForTimeout(600);

    const events = await page.evaluate(
      () =>
        (window as unknown as { dataLayer: Array<{ event: string }> }).dataLayer.map((e) => e.event),
    );
    expect(events.length).toBeGreaterThan(0);
    expect(events.some((event) => event.startsWith('nav_') || event.startsWith('cta_'))).toBe(true);
  });
});
