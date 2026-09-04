import { expect, test } from '@playwright/test';

/**
 * The conversion flow (brief §20, §23, §26).
 *
 * "Contact form works and routes leads correctly" is on the acceptance
 * checklist, and the honest reading of it in this build is: the form validates
 * on both sides, resists automated abuse, and never tells a visitor their
 * message was sent when it was not.
 */
test.describe('enquiry form', () => {
  /**
   * Warm the route handler before the API assertions run.
   *
   * Playwright's `webServer` waits for `/` to answer and then releases every
   * test at once. `/` is statically prerendered, so that says nothing about
   * `/api/enquiry`, which is server-rendered on demand and whose module Next
   * loads on first hit. A request landing inside that window gets a socket
   * hang up rather than a response — an intermittent failure with nothing
   * wrong in the assertion.
   *
   * The warm-up deliberately trips the honeypot, which the route answers
   * before the rate limiter increments (see app/api/enquiry/route.ts), so this
   * costs none of the per-IP budget the tests below rely on. Its outcome is
   * not asserted: it exists to establish the precondition, and every real
   * assertion stays exactly as strict.
   */
  test.beforeAll(async ({ playwright, baseURL }) => {
    const context = await playwright.request.newContext({ baseURL });
    try {
      await context.post('/api/enquiry', {
        data: { website: 'warm-up', startedAt: Date.now() },
        timeout: 15_000,
      });
    } catch {
      // The first request may still lose the race; the next one wakes it.
      await context.post('/api/enquiry', {
        data: { website: 'warm-up', startedAt: Date.now() },
        timeout: 15_000,
      });
    } finally {
      await context.dispose();
    }
  });

  test('carries every field the brief specifies, each properly labelled', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByLabel('Name', { exact: false }).first()).toBeVisible();
    await expect(page.getByLabel('Company', { exact: false }).first()).toBeVisible();
    await expect(page.getByLabel('Email', { exact: false }).first()).toBeVisible();
    await expect(page.getByLabel('Phone', { exact: false }).first()).toBeVisible();
    await expect(page.getByLabel('What do you need help with?')).toBeVisible();
    await expect(page.getByLabel('Message', { exact: false }).first()).toBeVisible();
    await expect(page.getByRole('group', { name: 'Preferred contact method' })).toBeVisible();

    // The dropdown offers the brief's list.
    const options = await page.getByLabel('What do you need help with?').locator('option').allInnerTexts();
    for (const expected of ['Comply360', 'Axlo Payroll', 'Odoo ERP', 'QuickBooks', 'Other']) {
      expect(options, `dropdown should offer ${expected}`).toContain(expected);
    }
  });

  test('reports validation errors in a summary and against each field', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /send enquiry/i }).click();

    // Scoped to the form: Next's route announcer is also role="alert".
    const summary = page.locator('form [role=alert]');
    await expect(summary).toBeVisible();
    await expect(summary).toContainText(/problems with this form/i);

    // Focus moves to the summary so a keyboard user is told what happened.
    const focused = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(focused).toBe('alert');

    // Each bad control is marked invalid and points at its message.
    const name = page.getByLabel('Name', { exact: false }).first();
    await expect(name).toHaveAttribute('aria-invalid', 'true');
    const describedBy = await name.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    await expect(page.locator(`#${describedBy}`)).toContainText('Enter your name.');
  });

  test('clears a field error as soon as it is corrected', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: /send enquiry/i }).click();

    const email = page.getByLabel('Email', { exact: false }).first();
    await expect(email).toHaveAttribute('aria-invalid', 'true');

    await email.fill('someone@example.com');
    await expect(email).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('tells the visitor honestly when delivery is not configured', async ({ page }) => {
    await page.goto('/contact');

    await page.getByLabel('Name', { exact: false }).first().fill('Ada Lovelace');
    await page.getByLabel('Company', { exact: false }).first().fill('Acme Tiles');
    await page.getByLabel('Email', { exact: false }).first().fill('ada@acmetiles.example');
    await page.getByLabel('What do you need help with?').selectOption('System integration');
    await page
      .getByLabel('Message', { exact: false })
      .first()
      .fill('Our POS and accounting disagree every month end and we reconcile by hand.');

    // The form refuses anything completed faster than a human could type, so
    // wait past that floor before submitting.
    await page.waitForTimeout(3200);
    await page.getByRole('button', { name: /send enquiry/i }).click();

    // No webhook is configured in the test environment, so the form must say so
    // and offer the fallback — never claim a delivery that did not happen.
    const status = page.locator('[role=status]').last();
    await expect(status).toContainText(/not connected to a mailbox yet/i);
    await expect(status.getByRole('link', { name: /send what you have written by email/i })).toHaveAttribute(
      'href',
      /^mailto:/,
    );
  });

  test('the endpoint validates independently of the browser', async ({ request }) => {
    // A client that skips the form entirely must still be checked.
    const bad = await request.post('/api/enquiry', {
      data: { name: '', company: '', email: 'nope', subject: 'Made up', message: 'hi' },
    });
    expect(bad.status()).toBe(422);
    const body = await bad.json();
    expect(body.errors).toHaveProperty('name');
    expect(body.errors).toHaveProperty('email');
    expect(body.errors).toHaveProperty('subject');
  });

  test('the endpoint drops obvious automation without telling it why', async ({ request }) => {
    const filled = {
      name: 'Bot',
      company: 'Spam Co',
      email: 'bot@spam.example',
      subject: 'Other',
      message: 'Buy cheap things from this website right now.',
      startedAt: Date.now() - 30_000,
    };

    // Honeypot filled — accepted and discarded.
    const honeypot = await request.post('/api/enquiry', {
      data: { ...filled, website: 'http://spam.example' },
    });
    expect(honeypot.status()).toBe(200);

    // Submitted instantly — accepted and discarded.
    const instant = await request.post('/api/enquiry', {
      data: { ...filled, website: '', startedAt: Date.now() },
    });
    expect(instant.status()).toBe(200);
  });

  test('an enquiry never reaches analytics with its contents', async ({ page }) => {
    await page.goto('/contact');
    await page.evaluate(() => {
      (window as unknown as { dataLayer: unknown[] }).dataLayer = [];
    });

    await page.getByLabel('Name', { exact: false }).first().fill('Ada Lovelace');
    await page.getByRole('button', { name: /send enquiry/i }).click();
    await page.waitForTimeout(400);

    const serialised = await page.evaluate(() =>
      JSON.stringify((window as unknown as { dataLayer: unknown[] }).dataLayer),
    );

    expect(serialised.length, 'expected events to have been recorded').toBeGreaterThan(2);
    expect(serialised, 'a typed value leaked into analytics').not.toContain('Ada Lovelace');
  });
});
