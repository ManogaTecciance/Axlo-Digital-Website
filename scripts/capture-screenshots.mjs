/**
 * Screenshot capture for design review.
 *
 *   npm run screenshots        (builds, serves, captures, tears down)
 *
 * THE PROBLEM THIS SOLVES
 * A `fullPage` screenshot resizes the viewport to the document height. That
 * re-runs layout and re-fires every IntersectionObserver, so reveal-on-scroll
 * content below the original fold snaps back to its pending state and the
 * capture comes out with blank bands — even though the page renders correctly
 * in a real browser.
 *
 * The fix is `window.__AXLO_CAPTURE__`, set here via an init script so it is in
 * place before React hydrates. Every reveal then resolves to `shown`
 * immediately and registers no observer, so a later resize has nothing to
 * re-fire.
 *
 * It is a global rather than a `data-` attribute because the attribute did not
 * survive: React reconciles the attributes on `<html>` during hydration and
 * strips anything the server did not render. A property on `window` is outside
 * React's tree.
 *
 * Deliberately NOT solved by emulating reduced motion. Reduced motion is a real
 * user preference with its own rendering that has to keep being tested as
 * itself; bending it to suit tooling would weaken an accessibility path. The
 * capture flag is separate, is set only by this script, and no user action can
 * trigger it.
 *
 * Before every capture this waits for: fonts loaded, all images decoded, two
 * animation frames, and layout stability (the document height unchanged across
 * consecutive frames).
 */
import { chromium } from '@playwright/test';
import { mkdir, rm } from 'node:fs/promises';

const BASE = process.env.CAPTURE_BASE ?? 'http://localhost:4477';
const OUT = 'docs/screenshots';

/** The six widths the brief calls out, plus the two desktop sizes in between. */
const WIDTHS = [
  { label: '1440x900', width: 1440, height: 900 },
  { label: '1366x768', width: 1366, height: 768 },
  { label: '1024x768', width: 1024, height: 768 },
  { label: '768x1024', width: 768, height: 1024 },
  { label: '390x844', width: 390, height: 844 },
  { label: '360x800', width: 360, height: 800 },
];

/** Routes worth a picture. The site is one page plus two internal drafts. */
const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'privacy-draft', path: '/privacy' },
  { name: 'terms-draft', path: '/terms' },
];

/** Sets the capture flag before any application code runs. */
const CAPTURE_INIT = () => {
  window.__AXLO_CAPTURE__ = true;
};

async function settle(page) {
  // Fonts: a capture taken mid-swap measures the fallback face.
  await page.evaluate(() => document.fonts?.ready);

  /*
   * Images: `decode()` rather than `complete`, so the pixels are actually ready.
   *
   * LAZY IMAGES MUST BE FORCED FIRST. `decode()` on an image whose load has not
   * begun never settles — it waits for bytes that a lazy image will not request
   * until it nears the viewport, and this helper runs with the page at the top.
   * Awaiting it hung the capture indefinitely once the AxloPOS screenshots
   * landed (the products section is far below the fold, and lazy by design).
   *
   * Promoting them to `eager` here restarts the load immediately. It is a
   * capture-only affordance in the same spirit as `__AXLO_CAPTURE__`: the page
   * itself is untouched, and it is what makes a `fullPage` shot show the
   * screenshots instead of two empty frames. Every wait below is bounded, so a
   * capture can fail with a readable message but can never hang again.
   */
  await page.evaluate(async () => {
    const bounded = (promise, ms) =>
      Promise.race([promise, new Promise((resolve) => setTimeout(resolve, ms))]);

    const images = Array.from(document.images);
    for (const img of images) {
      if (img.loading === 'lazy') img.loading = 'eager';
    }

    await Promise.all(
      images.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : bounded(
              new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
              }),
              15000,
            ),
      ),
    );

    await Promise.all(
      images.map((img) => (img.decode ? bounded(img.decode().catch(() => {}), 5000) : null)),
    );
  });

  // Layout stability: hold until the document height stops changing.
  await page.evaluate(async () => {
    const frame = () => new Promise((r) => requestAnimationFrame(r));
    let previous = -1;
    for (let i = 0; i < 30; i += 1) {
      const height = document.documentElement.scrollHeight;
      if (height === previous) break;
      previous = height;
      await frame();
      await frame();
    }
  });

  await page.waitForTimeout(120);
}

async function main() {
  await rm(OUT, { recursive: true, force: true });
  await mkdir(OUT, { recursive: true });

  const browser = await chromium.launch({ channel: 'chrome' });
  const failures = [];

  for (const size of WIDTHS) {
    const isMobile = size.width <= 480;
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      isMobile,
      hasTouch: isMobile,
      deviceScaleFactor: 1,
    });
    await context.addInitScript(CAPTURE_INIT);

    const page = await context.newPage();

    for (const route of ROUTES) {
      await page.goto(BASE + route.path, { waitUntil: 'networkidle' });
      await settle(page);

      // A capture is only trustworthy if nothing is still pending. Verify
      // rather than assume — this is the exact failure the flag exists to stop.
      const pending = await page.locator('[data-reveal="pending"], [data-sequence="pending"]').count();
      if (pending > 0) failures.push(`${route.name} @ ${size.label}: ${pending} element(s) still pending`);

      // And nothing may overflow horizontally at any captured width.
      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        win: window.innerWidth,
      }));
      if (overflow.doc > overflow.win) {
        failures.push(`${route.name} @ ${size.label}: ${overflow.doc}px in a ${overflow.win}px viewport`);
      }

      // Every image must have actually decoded. A screenshot referenced by a
      // path that is not in `public/` still renders markup, reserves its box
      // and passes every other check here — it just arrives as a blank frame.
      // This is the one check that catches it.
      const broken = await page.evaluate(() =>
        Array.from(document.images)
          .filter((img) => !(img.complete && img.naturalWidth > 0))
          .map((img) => img.currentSrc || img.src),
      );
      for (const src of broken) {
        failures.push(`${route.name} @ ${size.label}: image failed to load — ${src}`);
      }

      await page.screenshot({ path: `${OUT}/${route.name}--${size.label}.png`, fullPage: true });
      console.log(`captured ${route.name} @ ${size.label}`);
    }

    // The AxloPOS panel on its own, so the real screenshots and the carousel
    // controls can be reviewed without hunting through a full-page capture.
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    await settle(page);
    const posPanel = page.locator('#products article').filter({ hasText: 'AxloPOS' }).last();
    if (await posPanel.count()) {
      await posPanel.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await posPanel.screenshot({ path: `${OUT}/axlopos-panel--${size.label}.png` });
      console.log(`captured axlopos-panel @ ${size.label}`);
    }

    // The mobile drawer, at the two phone widths.
    if (isMobile) {
      await page.goto(BASE + '/', { waitUntil: 'networkidle' });
      await settle(page);
      await page.locator('header button').first().click();
      await page.waitForTimeout(400);
      await page.screenshot({ path: `${OUT}/mobile-drawer--${size.label}.png` });
      console.log(`captured mobile-drawer @ ${size.label}`);
    }

    await context.close();
  }

  await browser.close();

  if (failures.length > 0) {
    console.error('\nCapture verification failed:');
    for (const failure of failures) console.error('  •', failure);
    process.exit(1);
  }

  console.log('\nAll captures verified: nothing pending, no horizontal overflow.');
}

await main();
