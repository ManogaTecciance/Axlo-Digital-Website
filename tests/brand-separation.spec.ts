import { expect, test } from '@playwright/test';
import { settle } from './helpers';

/**
 * The owned/partner boundary.
 *
 * Brief §13 ("Do not present Odoo or QuickBooks as Axlo-owned products"), §24
 * ("Clearly identify Odoo, QuickBooks and other platforms as
 * partner/implementation solutions") and §26 (the acceptance checklist) all
 * state the same rule. It is the single easiest thing on this site to break by
 * accident — one card moved between two sections does it — and the damage is
 * a trademark problem, not a styling one.
 *
 * So it is asserted structurally: not "does the page say the right words" but
 * "can a partner platform appear anywhere the owned products live".
 */

const OWNED = ['Comply360', 'Axlo Payroll', 'Axlo Budget', 'AxloPOS'];
const PARTNER_ROUTES = ['/solutions/odoo', '/solutions/quickbooks'];

test.describe('owned products vs partner platforms', () => {
  test('the products URL space contains only Axlo-owned software', async ({ page }) => {
    await page.goto('/products');
    await settle(page);

    const productLinks = await page
      .locator('a[href^="/products/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') as string));

    const slugs = [...new Set(productLinks)].map((href) => href.replace('/products/', ''));
    expect(slugs.sort()).toEqual(['axlo-budget', 'axlo-payroll', 'axlopos', 'comply360']);

    // No third-party platform may be reachable as a product.
    for (const vendor of ['odoo', 'quickbooks']) {
      expect((await page.request.get(`/products/${vendor}`)).status(), vendor).toBe(404);
    }
  });

  test('the products page never presents a vendor platform as a product', async ({ page }) => {
    await page.goto('/products');
    await settle(page);

    // Odoo and QuickBooks may be *mentioned* — the page points at Solutions —
    // but never inside a product card.
    const cardText = await page
      .locator('main ul li')
      .evaluateAll((items) =>
        items
          .filter((item) => item.querySelector('a[href^="/products/"]'))
          .map((item) => item.textContent ?? ''),
      );

    expect(cardText.length).toBe(4);
    for (const text of cardText) {
      expect(text, 'a vendor platform appeared inside a product card').not.toMatch(
        /odoo|quickbooks/i,
      );
    }
  });

  test('every partner platform page states who owns the software', async ({ page }) => {
    for (const route of PARTNER_ROUTES) {
      await page.goto(route);
      await settle(page);

      const text = (await page.locator('main').textContent()) ?? '';

      expect(text, `${route} must declare the platform is not an Axlo product`).toMatch(
        /is not an Axlo Digital product/i,
      );
      expect(text, `${route} must describe Axlo's role as a service`).toMatch(
        /implementation|consulting|integration|support/i,
      );

      // The marker is visible, not only in the prose.
      await expect(page.getByText(/Partner platform/i).first()).toBeVisible();

      // And it never claims Axlo owns or builds it.
      expect(text).not.toMatch(/our (product|platform|software)/i);
      expect(text).not.toMatch(/we (built|build|own|publish) (odoo|quickbooks)/i);
    }
  });

  test('a partner platform is never marked up as software Axlo publishes', async ({ page }) => {
    for (const route of PARTNER_ROUTES) {
      await page.goto(route);

      const blocks = await page
        .locator('script[type="application/ld+json"]')
        .evaluateAll((nodes) => nodes.map((node) => JSON.parse(node.textContent ?? '{}')));
      const flat = blocks.flat();

      // The page describes a Service Axlo provides, never a SoftwareApplication.
      expect(
        flat.some((entry: { '@type': string }) => entry['@type'] === 'Service'),
        `${route} should be marked up as a Service`,
      ).toBe(true);
      expect(
        flat.some((entry: { '@type': string }) => entry['@type'] === 'SoftwareApplication'),
        `${route} must not be marked up as software Axlo publishes`,
      ).toBe(false);

      const service = flat.find((entry: { '@type': string }) => entry['@type'] === 'Service');
      expect(service.provider.name).toBe('Axlo Digital');
    }
  });

  test('the homepage keeps the two layers in separate, differently-styled bands', async ({
    page,
  }) => {
    await page.goto('/');
    await settle(page);

    const products = page.locator('#products');
    const partners = page.locator('#erp-finance');
    await expect(products).toHaveCount(1);
    await expect(partners).toHaveCount(1);

    // Owned products live in the products band and nowhere else.
    const productsText = (await products.textContent()) ?? '';
    for (const name of OWNED) {
      expect(productsText, `${name} should be in the products band`).toContain(name);
    }

    /* A vendor name may appear here only as something an Axlo product connects
       to — "Connects to QuickBooks" on AxloPOS, and the sync panel inside its
       demo dashboard. What the rule forbids is a vendor being *presented as a
       product*, so the assertion reads the product copy (headings, positioning,
       descriptions and capability chips) with the demo interfaces excluded, and
       requires anything left to be explicit integration wording. */
    const copyText = await products.evaluate((section) =>
      Array.from(section.querySelectorAll('article'))
        .map((article) => {
          const clone = article.cloneNode(true) as HTMLElement;
          clone.querySelectorAll('[role=img], figure').forEach((node) => node.remove());
          return clone.textContent ?? '';
        })
        .join(' '),
    );

    for (const vendor of ['Odoo', 'QuickBooks']) {
      // The words immediately before each mention decide how it reads.
      const preceding = [...copyText.matchAll(new RegExp(`(.{0,16})${vendor}`, 'gi'))].map(
        (match) => match[1],
      );
      for (const lead of preceding) {
        expect(
          lead,
          `"${lead.trim()} ${vendor}" presents ${vendor} as something other than an integration`,
        ).toMatch(/connects? to\s*$|integrat\w*\s*$|sync\w*\s*$/i);
      }
    }

    // Partner platforms declare themselves in their own band.
    const partnersText = (await partners.textContent()) ?? '';
    expect(partnersText).toMatch(/Partner platform · Odoo/i);
    expect(partnersText).toMatch(/Partner platform · QuickBooks/i);

    // The partner band comes after the owned portfolio, so the site reads
    // "here is what we make" before "here is what we implement".
    const order = await page.evaluate(() => {
      const a = document.querySelector('#products')!.getBoundingClientRect().top;
      const b = document.querySelector('#erp-finance')!.getBoundingClientRect().top;
      return b > a;
    });
    expect(order, 'the partner band must follow the owned products').toBe(true);
  });

  test('the footer separates products from solutions', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const productColumn = page.locator('footer nav[aria-labelledby="footer-products-heading"]');
    const solutionColumn = page.locator('footer nav[aria-labelledby="footer-solutions-heading"]');

    const productText = (await productColumn.textContent()) ?? '';
    expect(productText).not.toMatch(/odoo|quickbooks/i);

    const solutionText = (await solutionColumn.textContent()) ?? '';
    expect(solutionText).toMatch(/odoo/i);
    expect(solutionText).toMatch(/quickbooks/i);
  });
});
