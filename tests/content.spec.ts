import { expect, test } from '@playwright/test';
import { settle } from './helpers';

test.describe('content and conversion', () => {
  test('the two project actions are worded for what they do', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    // Two actions with two jobs. Everything that *scrolls* to the closing
    // section reads "Talk to Axlo" — the approved primary conversion label,
    // worded once in `primaryCta`; the action *at* that section opens mail and
    // reads "Start a conversation". A button that scrolls and a button that
    // launches a mail client must not read identically.
    //
    // Every conversion button is matched, not just those starting with a known
    // word: the previous filter keyed on /^start/i, which would have silently
    // stopped matching anything the moment the label changed and passed a
    // vacuous assertion over an empty list.
    const scrollActions = await page
      .locator('a[href="#contact"]')
      .evaluateAll((links) =>
        links
          .map((l) => (l.textContent ?? '').trim())
          // The plain "Contact" nav entries also target #contact. Everything
          // else pointing there is a conversion button.
          .filter((t) => t !== 'Contact'),
      );

    expect(scrollActions.length, 'expected the header and hero CTAs').toBeGreaterThanOrEqual(2);
    for (const label of scrollActions) {
      expect(label, 'scroll CTA wording drifted').toBe('Talk to Axlo');
    }

    // The retired wording must not survive anywhere on the page.
    const body = (await page.locator('body').textContent()) ?? '';
    expect(body, 'the retired CTA label came back').not.toMatch(/start a project/i);

    const mailActions = await page
      .locator('a[href^="mailto:hello@axlodigital.com"]')
      .evaluateAll((links) =>
        links.map((l) => (l.textContent ?? '').trim()).filter((t) => /^start/i.test(t)),
      );

    expect(mailActions).toEqual(['Start a conversation']);
  });

  test('the closing action opens mail with the approved subject line', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const href = await page
      .locator('#contact a[href^="mailto:"]')
      .first()
      .getAttribute('href');

    expect(href).toBe(
      'mailto:hello@axlodigital.com?subject=Start%20a%20project%20with%20Axlo%20Digital',
    );
  });

  test('no "coming soon" placeholder is published', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const body = (await page.locator('body').textContent()) ?? '';
    expect(body).not.toMatch(/coming soon/i);
  });

  test('draft legal pages are not linked and not indexable', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    // Not reachable from the site.
    await expect(page.locator('a[href="/privacy"], a[href="/terms"]')).toHaveCount(0);

    // The routes resolve for internal review, but tell crawlers to stay out.
    for (const route of ['/privacy', '/terms']) {
      const response = await page.goto(route);
      expect(response?.status(), route).toBe(200);
      const robots = await page.locator('meta[name="robots"]').first().getAttribute('content');
      expect(robots, route).toContain('noindex');
    }
  });

  test('no unverified integration claim is published', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    // "QuickBooks connected" was withdrawn pending verification — see R3.
    const body = (await page.locator('body').textContent()) ?? '';
    expect(body).not.toMatch(/quickbooks/i);
    expect(body).not.toMatch(/supported integrations|fully integrated/i);
  });

  test('no availability or maturity claim is published — R3', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const body = (await page.locator('body').textContent()) ?? '';

    // Nothing may state that a product is shipped, mature, or in use until an
    // exact approved status is supplied.
    for (const claim of [
      /available now/i,
      /production[- ]ready/i,
      /used by businesses/i,
      /trusted by customers/i,
      /\bin production\b/i,
    ]) {
      expect(body, `claim published: ${claim}`).not.toMatch(claim);
    }

    // And no release-stage badge anywhere in the Products section, which is the
    // one place a "Live" / "Beta" / "Pilot" / "Coming soon" chip would sit.
    const products = (await page.locator('#products').textContent()) ?? '';
    for (const badge of [/\bLive\b/, /\bBeta\b/i, /\bPilot\b/i, /\bComing soon\b/i]) {
      expect(products, `badge published: ${badge}`).not.toMatch(badge);
    }
  });

  test('AxloPOS is described in the approved neutral wording', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const panel = page.locator('#products article', {
      has: page.getByRole('heading', { name: 'AxloPOS' }),
    });

    await expect(panel).toContainText(
      'AxloPOS is a connected point-of-sale and business operations platform for sales, payments, inventory, customers, suppliers, reporting, and operational workflows.',
    );

    // The withdrawn audience line asserted a customer base in five named
    // sectors. It must not come back.
    await expect(panel).not.toContainText(/retail, hardware, tiles/i);
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
