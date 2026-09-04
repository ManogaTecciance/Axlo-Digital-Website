import { NextResponse } from 'next/server';
import { validate, type Enquiry, type EnquiryResponse } from '@/lib/enquiry';

/**
 * Enquiry endpoint.
 *
 * DELIVERY IS A SEAM, NOT A DEPENDENCY.
 * No email provider is installed, and picking one is Axlo's decision — it
 * carries an account, a cost and a data-processor entry in the privacy policy.
 * So this handler validates, filters abuse, and forwards the enquiry to
 * whatever URL `AXLO_ENQUIRY_WEBHOOK` names: a CRM intake, a Zapier/Make hook,
 * a Formspree endpoint, or a small mail-sending function. Anything that accepts
 * a JSON POST works, and nothing in this file changes when one is chosen.
 *
 * With no webhook configured the handler answers 503 with
 * `reason: 'unconfigured'`, and the form falls back to a prefilled mailto so
 * the visitor is never left with a dead button. That is a deliberate, visible
 * state rather than a silent success that loses the lead.
 *
 * SPAM CONTROL, in order of cost:
 *   1. Honeypot — a field no human can see; anything that fills it is a bot.
 *   2. Time-to-submit — a form completed in under three seconds was not typed.
 *   3. Per-IP rate limit — in-process, so it holds within one server instance.
 * Both 1 and 2 answer 200 OK. Telling a bot it was detected only teaches the
 * next attempt.
 *
 * PRIVACY: nothing is logged. The submitted values pass through this function
 * to the configured webhook and are not written to console, disk or memory
 * beyond the request. The rate limiter stores a hashed IP and a counter, never
 * a payload.
 */

export const runtime = 'nodejs';

/** Minimum plausible time for a human to complete the form. */
const MIN_FILL_MS = 3_000;
/** Reject a form left open for longer than this — a stale token is suspect. */
const MAX_FILL_MS = 1000 * 60 * 60 * 12;

const RATE_LIMIT = { windowMs: 60 * 60 * 1000, max: 5 } as const;

/**
 * In-process rate limiter.
 *
 * Deliberately simple: it holds within a single server instance and resets on
 * deploy, which is the right trade for a contact form. If the site is ever run
 * across several instances, move this to the edge (a WAF rule or the host's own
 * rate limiting) rather than making it distributed here.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);

  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + RATE_LIMIT.windowMs });
    // Opportunistic sweep so the map cannot grow without bound.
    if (hits.size > 5_000) {
      for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    }
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT.max;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  return ip;
}

function json(body: EnquiryResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: Request) {
  let payload: Partial<Enquiry> & { website?: string; startedAt?: number };

  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, reason: 'rejected' }, 400);
  }

  // 1. Honeypot. `website` is hidden from sight and from assistive technology;
  //    only an automated filler reaches it. Answer OK and drop it.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return json({ ok: true }, 200);
  }

  // 2. Time-to-submit.
  const startedAt = Number(payload.startedAt);
  if (Number.isFinite(startedAt)) {
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_FILL_MS || elapsed > MAX_FILL_MS) {
      return json({ ok: true }, 200);
    }
  }

  // 3. Rate limit.
  if (rateLimited(clientKey(request))) {
    return json({ ok: false, reason: 'rejected' }, 429);
  }

  // Server-side validation. The browser runs the same rules, and this does not
  // assume it did.
  const errors = validate(payload);
  if (Object.keys(errors).length > 0) {
    return json({ ok: false, errors }, 422);
  }

  const webhook = process.env.AXLO_ENQUIRY_WEBHOOK;
  if (!webhook) {
    // Not an error in the code — a deployment step that has not happened. The
    // form shows the mailto fallback rather than pretending this succeeded.
    return json({ ok: false, reason: 'unconfigured' }, 503);
  }

  const enquiry = {
    name: String(payload.name ?? '').trim(),
    company: String(payload.company ?? '').trim(),
    email: String(payload.email ?? '').trim(),
    phone: String(payload.phone ?? '').trim(),
    subject: String(payload.subject ?? '').trim(),
    message: String(payload.message ?? '').trim(),
    preferredContact: String(payload.preferredContact ?? '').trim(),
    receivedAt: new Date().toISOString(),
    source: 'axlodigital.com/contact',
  };

  try {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(process.env.AXLO_ENQUIRY_TOKEN
          ? { authorization: `Bearer ${process.env.AXLO_ENQUIRY_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(enquiry),
      // A contact form must not hold a request open indefinitely.
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) return json({ ok: false, reason: 'error' }, 502);
    return json({ ok: true }, 200);
  } catch {
    // The upstream is unreachable or timed out. Report it honestly so the form
    // can offer the fallback; never claim a delivery that did not happen.
    return json({ ok: false, reason: 'error' }, 502);
  }
}
