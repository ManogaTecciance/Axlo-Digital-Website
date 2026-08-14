import { expect, test } from '@playwright/test';
import { settle } from './helpers';

test.describe('product carousels', () => {
  test('both products render three real interface states', async ({ page }) => {
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
      expect(label).toContain('Sample content');
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
    await page.goto('/');
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
