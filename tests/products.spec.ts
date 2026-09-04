import { expect, test } from '@playwright/test';
import { settle } from './helpers';

/** The two AxloPOS screenshots, as they must reach the browser. */
const AXLOPOS_SHOTS = [
  {
    file: 'axlopos-owner-dashboard.png',
    alt: 'AxloPOS owner dashboard showing sales, profit, transactions, inventory value, quotations, performance reporting, and operational alerts.',
  },
  {
    file: 'axlopos-checkout-cart.png',
    alt: 'AxloPOS checkout interface showing product search, product catalogue, customer selection, cart items, discounts, totals, and payment action.',
  },
];

test.describe('product carousels', () => {
  test('Comply360 renders three composed states, AxloPOS two real screenshots', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    await expect(page.locator('[aria-roledescription=carousel]')).toHaveCount(2);

    const comply = page.locator('[aria-label="Comply360 product views"]');
    await expect(comply.locator('button[aria-label^="Show view"]')).toHaveCount(3);
    // Composed interfaces: one described `role=img` each, no image files.
    await expect(comply.locator('[role=img]')).toHaveCount(3);
    await expect(comply.locator('img')).toHaveCount(0);

    const pos = page.locator('[aria-label="AxloPOS product views"]');
    await expect(pos.locator('button[aria-label^="Show view"]')).toHaveCount(2);
    // Real screenshots: real images, and none of the sample-view chrome.
    await expect(pos.locator('img')).toHaveCount(2);
    await expect(pos.locator('[role=img]')).toHaveCount(0);
    await expect(pos).not.toContainText('Sample view');
  });

  test('the composed Comply360 states carry a non-trivial description', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const labels = await page
      .locator('[aria-label="Comply360 product views"] [role=img]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-label') ?? ''));

    expect(labels).toHaveLength(3);
    for (const label of labels) {
      expect(label.length).toBeGreaterThan(80);
      expect(label).toContain('Sample content');
    }
  });

  test('both AxloPOS screenshots are served from the repo with the approved alt text', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const images = page.locator('[aria-label="AxloPOS product views"] img');
    await expect(images).toHaveCount(2);

    for (const [index, shot] of AXLOPOS_SHOTS.entries()) {
      const image = images.nth(index);
      await expect(image).toHaveAttribute('alt', shot.alt);

      // Optimised through Next's own pipeline, and pointing at the local file —
      // never a temporary upload URL.
      const src = (await image.getAttribute('src')) ?? '';
      expect(src, 'served by next/image').toContain('/_next/image');
      expect(decodeURIComponent(src)).toContain(
        `/images/products/axlopos/${shot.file}`,
      );
    }
  });

  test('screenshots load, keep their own aspect ratio, and are never cropped', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    /* Both screenshots are lazy by design — the products section is far below
       the fold. `settle` sweeps the page and returns to the top, and on a phone
       the document is ~10,000px tall, so the panel is never in view long enough
       for the lazy loader to commit to a fetch. Bring the carousel into view
       and let it load, the way a reader arriving at the section does; the
       assertions below are unchanged. */
    const carousel = page.locator('[aria-label="AxloPOS product views"]');
    await carousel.scrollIntoViewIfNeeded();
    await expect
      .poll(
        () =>
          carousel
            .locator('img')
            .evaluateAll((nodes) =>
              nodes.every((node) => {
                const img = node as HTMLImageElement;
                return img.complete && img.naturalWidth > 0;
              }),
            ),
        { message: 'both screenshots decode once the section is reached' },
      )
      .toBe(true);

    const report = await carousel
      .locator('img')
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const img = node as HTMLImageElement;
          const rect = img.getBoundingClientRect();
          const style = getComputedStyle(img);
          return {
            complete: img.complete && img.naturalWidth > 0,
            naturalRatio: img.naturalWidth / img.naturalHeight,
            renderedRatio: rect.width / rect.height,
            objectFit: style.objectFit,
            // The dark-theme photographic grade must not touch a screenshot.
            filter: style.filter,
            hasDimensions: img.hasAttribute('width') && img.hasAttribute('height'),
            sizes: img.getAttribute('sizes') ?? '',
          };
        }),
      );

    expect(report).toHaveLength(2);
    for (const image of report) {
      expect(image.complete, 'the file must actually decode').toBe(true);
      expect(image.hasDimensions, 'explicit width and height').toBe(true);
      expect(image.sizes, 'responsive sizes').toContain('vw');
      // Proportional scaling only — the rendered box is the file's own shape.
      expect(Math.abs(image.renderedRatio - image.naturalRatio)).toBeLessThan(0.02);
      expect(image.objectFit, 'no crop').not.toBe('cover');
      expect(image.filter, 'no colour grade over a real interface').toBe('none');
    }
  });

  /**
   * Demo-data governance — §2 and §24 of the client developer brief.
   *
   * The AxloPOS captures come from a demo environment and show currency
   * figures, percentages and counts. The brief requires such figures to be
   * labelled unless they are real, approved data. Comply360 satisfies this with
   * its "Sample view" chip; the screenshots satisfy it with a caption bar.
   *
   * Asserted as *rendered text* rather than as a string in the content model,
   * because the failure this guards against is the label being present in the
   * data and invisible on screen.
   */
  test('the AxloPOS screenshots carry a visible demo-data disclosure', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const carousel = page.locator('[aria-label="AxloPOS product views"]');
    await carousel.scrollIntoViewIfNeeded();

    // One per screenshot — both slides are in the DOM from first paint.
    const notices = carousel.locator('figcaption');
    await expect(notices).toHaveCount(2);

    for (let i = 0; i < 2; i += 1) {
      await expect(notices.nth(i)).toHaveText(/Demo environment · Illustrative data/);
    }

    // The active one is visible, legible, and not an overlay on the interface.
    const active = carousel.locator('div[data-active="true"] figcaption');
    await expect(active).toBeVisible();

    const style = await active.evaluate((node) => {
      const cs = getComputedStyle(node);
      const img = node.parentElement?.querySelector('img') as HTMLImageElement;
      return {
        fontSize: parseFloat(cs.fontSize),
        position: cs.position,
        // A caption bar sits below the picture; a watermark would overlap it.
        below: node.getBoundingClientRect().top >= img.getBoundingClientRect().bottom - 1,
      };
    });

    expect(style.fontSize, 'at or above the 15px body floor').toBeGreaterThanOrEqual(15);
    expect(style.position, 'must not be overlaid on the interface').not.toBe('absolute');
    expect(style.below, 'must sit under the screenshot, not over it').toBe(true);
  });

  /**
   * The layout-shift guarantee, asserted at the only moment it is observable:
   * while the screenshots are still undecoded. If the intrinsic `width` and
   * `height` in the content model ever stop matching the files, the box
   * collapses here and the section below it jumps when the bytes land — which
   * is precisely the regression this locks down.
   */
  test('the screenshot box is reserved at the file ratio before the file loads', async ({ page }) => {
    await page.goto('/');

    const boxes = await page
      .locator('[aria-label="AxloPOS product views"] img')
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const img = node as HTMLImageElement;
          const rect = img.getBoundingClientRect();
          return {
            loaded: img.complete && img.naturalWidth > 0,
            width: Number(img.getAttribute('width')),
            height: Number(img.getAttribute('height')),
            reservedRatio: rect.width / rect.height,
          };
        }),
      );

    expect(boxes).toHaveLength(2);
    for (const box of boxes) {
      // The point of the test is lost if the file already arrived.
      expect(box.loaded, 'still unloaded at the top of the page').toBe(false);
      expect(box.width, 'intrinsic width from the file').toBe(2048);
      expect(box.height, 'intrinsic height from the file').toBe(967);
      // A reserved box, already the file's own shape.
      expect(Math.abs(box.reservedRatio - 2048 / 967)).toBeLessThan(0.02);
    }
  });

  test('controls advance the carousel and announce the change without moving focus', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const carousel = page.locator('[aria-label="AxloPOS product views"]');
    await carousel.scrollIntoViewIfNeeded();

    const live = carousel.locator('[aria-live=polite]');
    await expect(live).toContainText('View 1 of 2');
    // Position is legible without decoding the dots.
    await expect(carousel).toContainText('01 / 02');

    const nextButton = carousel.getByRole('button', { name: /Next AxloPOS view/ });
    await nextButton.click();
    await expect(live).toContainText('View 2 of 2');
    await expect(carousel).toContainText('02 / 02');

    // Focus stays on the control that was pressed — never jumps into the slide.
    expect(await page.evaluate(() => document.activeElement?.tagName)).toBe('BUTTON');

    await carousel.getByRole('button', { name: /Previous AxloPOS view/ }).click();
    await expect(live).toContainText('View 1 of 2');
  });

  test('arrow keys operate the carousel once focus is inside it', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const carousel = page.locator('[aria-label="AxloPOS product views"]');
    await carousel.scrollIntoViewIfNeeded();
    const live = carousel.locator('[aria-live=polite]');

    await carousel.getByRole('button', { name: /Next AxloPOS view/ }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(live).toContainText('View 2 of 2');
    await page.keyboard.press('ArrowLeft');
    await expect(live).toContainText('View 1 of 2');

    // Focus never left the control it started on.
    const stillOnControl = await page.evaluate(
      () => document.activeElement?.getAttribute('aria-label') ?? '',
    );
    expect(stillOnControl).toMatch(/Next AxloPOS view/);
  });

  test('inactive states are removed from the accessibility tree', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const hidden = await page
      .locator('[aria-label="AxloPOS product views"] div[data-active="false"]')
      .evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-hidden')));

    expect(hidden).toEqual(['true']);
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

  test('autoplay advances, and pauses on hover and on focus within', async ({ page }) => {
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
    const heldByHover = await live.textContent();
    await page.waitForTimeout(9000);
    expect(await live.textContent()).toBe(heldByHover);

    // So does keyboard focus landing inside it.
    await page.mouse.move(0, 0);
    await carousel.getByRole('button', { name: /Next AxloPOS view/ }).focus();
    const heldByFocus = await live.textContent();
    await page.waitForTimeout(9000);
    expect(await live.textContent()).toBe(heldByFocus);
  });

  test('autoplay does not run while the carousel is outside the viewport', async ({ page }) => {
    await page.goto('/');
    await settle(page);

    const carousel = page.locator('[aria-label="AxloPOS product views"]');
    const live = carousel.locator('[aria-live=polite]');

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    const before = await live.textContent();

    await page.waitForTimeout(9000);
    expect(await live.textContent()).toBe(before);
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

    // The manual controls all survive, on both carousels.
    const comply = page.locator('[aria-label="Comply360 product views"]');
    await expect(comply.getByRole('button', { name: /Next Comply360 view/ })).toBeVisible();
    await expect(comply.locator('button[aria-label^="Show view"]')).toHaveCount(3);

    const pos = page.locator('[aria-label="AxloPOS product views"]');
    await expect(pos.getByRole('button', { name: /Next AxloPOS view/ })).toBeVisible();
    await expect(pos.locator('button[aria-label^="Show view"]')).toHaveCount(2);
    // Screenshots still render — reduced motion changes the transition, not the
    // content.
    await expect(pos.locator('img')).toHaveCount(2);
  });
});
