import { expect, test } from '@playwright/test';
import { settle } from './helpers';

test.describe('product carousels', () => {
  test('the two products with composed screens render three real states each', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const carousels = page.locator('[aria-roledescription=carousel]');
    await expect(carousels).toHaveCount(2);

    for (const name of ['Comply360', 'AxloPOS']) {
      const carousel = page.locator(`[aria-label="${name} product views"]`);
      await expect(carousel).toHaveCount(1);
      // One dot per state.
      await expect(carousel.locator('button[aria-label^="Show view"]')).toHaveCount(3);
      // Each state is a composed interface, exposed as one described image.
      await expect(carousel.locator('[role=img]')).toHaveCount(3);
    }
  });

  test('every product state carries a non-trivial accessible description', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const labels = await page
      .locator('[aria-roledescription=carousel] [role=img]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-label') ?? ''));

    expect(labels).toHaveLength(6);
    for (const label of labels) {
      expect(label.length).toBeGreaterThan(80);
      // Brief §2 — the demo-data disclosure has to reach assistive technology,
      // not only the visible chip.
      expect(label).toContain('Demo data');
    }
  });

  test('controls advance the carousel and announce the change without moving focus', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const carousel = page.locator('[aria-label="AxloPOS product views"]');
    await carousel.scrollIntoViewIfNeeded();

    const live = carousel.locator('[aria-live=polite]');
    await expect(live).toContainText('View 1 of 3');

    const nextButton = carousel.getByRole('button', { name: /Next AxloPOS view/ });
    await nextButton.click();
    await expect(live).toContainText('View 2 of 3');

    // Focus stays on the control that was pressed — never jumps into the slide.
    const focusedIsButton = await page.evaluate(
      () => document.activeElement?.tagName === 'BUTTON',
    );
    expect(focusedIsButton).toBe(true);

    await carousel.getByRole('button', { name: /Previous AxloPOS view/ }).click();
    await expect(live).toContainText('View 1 of 3');
  });

  test('inactive states are removed from the accessibility tree', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const hidden = await page
      .locator('[aria-label="Comply360 product views"] div[data-active="false"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-hidden')));

    expect(hidden).toEqual(['true', 'true']);
  });

  test('the AxloPOS CTA opens the real product site safely', async ({ page }) => {
    // The external product link now lives on the product page; the homepage
    // card routes to that page instead.
    await page.goto('/products/axlopos');
    await settle(page);

    const cta = page.locator('a[href="https://www.axlopos.com/"]').first();
    await expect(cta).toHaveAttribute('target', '_blank');
    await expect(cta).toHaveAttribute('rel', /noopener/);
    await expect(cta).toHaveAttribute('rel', /noreferrer/);
    await expect(cta).toHaveAttribute('aria-label', 'Explore the AxloPOS website');
  });

  test('autoplay advances, and pauses when the pointer is over the carousel', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const carousel = page.locator('[aria-label="AxloPOS product views"]');
    await carousel.scrollIntoViewIfNeeded();
    await page.mouse.move(0, 0);
    await page.waitForTimeout(600);

    const live = carousel.locator('[aria-live=polite]');
    const before = await live.textContent();

    await expect(live).not.toHaveText(before ?? '', { timeout: 12_000 });

    // Hovering suspends it.
    await carousel.hover();
    const held = await live.textContent();
    await page.waitForTimeout(9000);
    expect(await live.textContent()).toBe(held);
  });
});

test.describe('reduced motion', () => {
  /* Emulated explicitly per test rather than through the `reducedMotion`
     fixture: the fixture is applied when the browser *context* is created, and
     the context here is shared with the project-level `use`, so the preference
     did not reach the page. `emulateMedia` before `goto` is unambiguous. */
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('autoplay never runs and the pause control is not offered', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const carousel = page.locator('[aria-label="AxloPOS product views"]');
    await carousel.scrollIntoViewIfNeeded();

    await expect(carousel.getByRole('button', { name: /slideshow/ })).toHaveCount(0);

    const live = carousel.locator('[aria-live=polite]');
    const before = await live.textContent();
    await page.waitForTimeout(9000);
    expect(await live.textContent()).toBe(before);
  });

  test('all content is present and settled', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    // Nothing is left in the pending reveal state.
    await expect(page.locator('[data-reveal="pending"]')).toHaveCount(0);
    await expect(page.locator('[data-sequence="pending"]')).toHaveCount(0);

    // The manual controls all survive.
    const carousel = page.locator('[aria-label="Comply360 product views"]');
    await expect(carousel.getByRole('button', { name: /Next Comply360 view/ })).toBeVisible();
    await expect(carousel.locator('button[aria-label^="Show view"]')).toHaveCount(3);
  });
});

test.describe('products without composed screens', () => {
  /* Axlo Payroll and Axlo Budget have no approved interface screens. Drawing a
     plausible-looking one would be the fabricated proof brief §24 rules out, so
     they show their real module scope instead. These tests exist to stop a
     future change from quietly inventing a screenshot for them. */

  test('show a module map on the homepage, never a mock interface', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    for (const id of ['axlo-payroll', 'axlo-budget']) {
      const panel = page.locator(`article[aria-labelledby="${id}-heading"]`);
      await expect(panel).toHaveCount(1);

      // No carousel, and no composed interface pretending to be a screenshot.
      await expect(panel.locator('[aria-roledescription=carousel]')).toHaveCount(0);
      await expect(panel.locator('figure[aria-labelledby$="module-map"]')).toHaveCount(1);
      await expect(panel.getByText(/Interface screens are published here once/i)).toBeVisible();
    }
  });

  test('their product pages list modules once, not twice', async ({ page }) => {
    // The page carries a full module list of its own, so repeating the module
    // map above it would be the same information twice in one screen.
    await page.goto('/products/axlo-budget');
    await settle(page);

    await expect(page.locator('figure[aria-labelledby$="module-map"]')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: /Modules and capabilities/i })).toBeVisible();

    const modules = page.locator('ul[aria-label="Axlo Budget modules"] li');
    await expect(modules).toHaveCount(14);
  });

  test('a product page shows the workflow spine exactly once', async ({ page }) => {
    for (const route of ['/products/comply360', '/products/axlo-budget']) {
      await page.goto(route);
      await settle(page);

      const spines = page.locator('ol[aria-label$="workflow"]');
      await expect(spines, route).toHaveCount(1);
    }
  });
});
