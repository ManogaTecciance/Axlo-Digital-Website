# Axlo Digital — final handoff

> ## ⚠️ Superseded in part — 2026-08-31
>
> A **client brief compliance audit** was run after this document was written, and its decisions
> change three things below. This document is retained as the Phase 2 record; it is **not** the
> current status. The authoritative status is [`LAUNCH-BLOCKERS.md`](LAUNCH-BLOCKERS.md).
>
> 1. **Two launch blockers now, not one.** **L6** joins L1: the AxloPOS screenshots are reclassified
>    **INTERNAL / PRE-LAUNCH PRODUCT EVIDENCE** and are not approved for publication. See
>    [`AXLOPOS-SCREENSHOT-REQUIREMENTS.md`](AXLOPOS-SCREENSHOT-REQUIREMENTS.md). §4 and §10 below are
>    affected.
> 2. **The primary CTA is now “Talk to Axlo”**, adopted from §4 of the client brief. Any reference
>    below to “Start a project” as the navigational label is out of date. The Final CTA still reads
>    “Start a conversation”.
> 3. **Every public AxloPOS visual now carries a “Demo environment · Illustrative data” disclosure.**
>
> A revised final handoff will be produced once the pre-handoff review is approved.

**Branch:** `feature/axlo-website-restructure` · **Date:** 2026-08-31
**Status:** Design & development complete and accepted. Public launch blocked by **L1 (legal content)** and **L6 (AxloPOS assets)**.

Phase 2 was approved on 2026-08-31. No further development phase is planned. Changes from here are
limited to genuine defects found in final visual review, and the legal-content change described under
[L1](#l1--the-remaining-blocker).

---

## 1. Final approved scope

Axlo Digital v1 is **one public landing page** at `/`, plus two internal legal drafts that are
`noindex` and unlinked.

Approved section order, all on the single route:

**Hero → Services → Products → (trust strip) → Brand proposition → Final CTA**, with the footer
supplied by the root layout.

The trust strip is deliberately **not** a sixth section: it carries no heading rank and no `id`, and
sits directly under Products as evidence for the two products above it.

**Approved products: Comply360 and AxloPOS only.**

Explicitly out of scope and not built: Payroll, Budget, Solutions pages, Industries, Insights, About
and leadership, a contact page, and any validated contact form. The closing CTA opens mail directly.

### Content policy in force

No customer names, statistics, testimonials, awards, user counts, revenue figures, logos, case
studies, certifications or partnerships appear anywhere. No availability or release-stage badge of
any kind is rendered — not Live, Beta, Pilot or Coming Soon. `hello@axlodigital.com` is the only
contact detail published; no phone number, address, office location or social profile is invented.

`tests/content.spec.ts` enforces this: the suite fails if a withdrawn claim or a release-stage badge
reappears in the Products section.

---

## 2. Component inventory

**38 component modules** across eight groups, plus one shared stylesheet (`ProductUi.module.css`).
Every component listed here is referenced by the shipped page unless marked **[retained]** — see §9.

| Group | Components |
| --- | --- |
| **Sections** | `Hero` · `ServicesSection` · `ProductsSection` · `ProductShowcase` · `TrustSection` · `BrandProposition` · `FinalCta` · `ProcessDiagrams` · `StartHereIcon` |
| **Navigation** | `Header` · `Footer` · `FooterControls` · `FooterEmail` · `MobileMenu` · `SectionLink` · `SectionCta` · `ProductLink` |
| **Product demo** | `ProductMediaCarousel` · `ProductScreenshot` · `Comply360Interface` · `AppFrame` · `ProductUi` (shared primitive stylesheet) |
| **Layout** | `Layout` · `PageHero` · `SectionHeader` · `LegalPage` · `ThemeProvider` · `MotionToggle` |
| **Foundations** | `Button` · `Logo` · `Primitives` |
| **Motion** | `Reveal` · `HeroDepth` · `FlowLine` / `FlowConnector` · `CursorAffordance` · `StageRail` **[retained]** |
| **Data visualisation** | `Charts` **[retained]** · `Diagrams` **[retained]** |
| **Accessibility** | `SkipLink` |

### The two carousels

Both products render through the **same** `ProductShowcase` and the **same** `ProductMediaCarousel`.
That shared path is the structural guarantee that neither product can drift into being the
better-presented one. They differ in exactly one respect, and it is factual:

- **AxloPOS** states are **real product screenshots** (`media`), rendered by `ProductScreenshot`.
- **Comply360** states are **composed interfaces** drawn from the shared primitive kit, rendered by
  `Comply360Interface` inside `AppFrame`, and labelled **"Sample view"**.

A state is one or the other, never both. `AxloPosInterface.tsx` and its stylesheet were **deleted**
in Phase 2 rather than left behind a branch, so there is no path back to publishing a drawn
interface for a product whose real one we hold.

---

## 3. Routes retained

| Route | Type | Indexed | Linked | Purpose |
| --- | --- | --- | --- | --- |
| `/` | Page | Yes | — | The entire public site |
| `/privacy` | Page | **No** — `noindex, nofollow` | **No** | Internal draft |
| `/terms` | Page | **No** — `noindex, nofollow` | **No** | Internal draft |
| `/robots.txt` | Generated | — | — | `app/robots.ts` |
| `/sitemap.xml` | Generated | — | — | `app/sitemap.ts` |
| `/opengraph-image` | Generated | — | — | Raster social card |
| `/apple-icon` · `/icon.svg` | Generated | — | — | Touch and browser icons |
| `404` | Page | — | — | `app/not-found.tsx` |

**Primary navigation is entirely in-page.** Every destination is a hash anchor on `/`:
`#services` · `#products` · `#how-we-work` · `#contact`. The scroll-spy tracks the section ids
`home · services · products · how-we-work · contact`, and each `href` is a real anchor, so
navigation still works with JavaScript disabled.

`legalNav` is **intentionally empty** — the two footer legal links are restored in the same change
that lands approved copy.

---

## 4. Local image assets

Every asset is served from `public/`. **No temporary upload URL, CDN, or external image host is
referenced anywhere.**

### AxloPOS product screenshots — real, shipped interface

| File | Slide | Intrinsic | Alt text |
| --- | --- | --- | --- |
| `public/images/products/axlopos/axlopos-owner-dashboard.png` | **01** | **2048 × 967** | AxloPOS owner dashboard showing sales, profit, transactions, inventory value, quotations, performance reporting, and operational alerts. |
| `public/images/products/axlopos/axlopos-checkout-cart.png` | **02** | **2048 × 967** | AxloPOS checkout interface showing product search, product catalogue, customer selection, cart items, discounts, totals, and payment action. |

Delivered through `next/image` with:

- explicit `width={2048} height={967}` — the files' own intrinsic dimensions, taken from the files
- responsive `sizes="(min-width: 1024px) 62vw, (min-width: 768px) 90vw, 100vw"`
- `quality={90}` — above the default, because interface detail (thin rules, small type, tight
  gradients) is what compression damages first
- `loading="lazy"` — stated explicitly, not left to the default, because the Products section is far
  below the fold
- `width: 100%; height: auto` — the only scaling reachable from any viewport is **proportional**. No
  crop, no letterbox, no fixed container ratio
- `object-fit: contain` as a **fail-safe, not a fitting strategy**. It is an identity today; it
  guarantees the whole interface stays visible if a future rule ever constrains the height
- `filter: none` — the dark-theme photographic grade is switched off, so the product's interface
  renders in its own colours rather than in colours the product does not use

Because the intrinsic dimensions are declared, the box is reserved at the file's ratio **before any
bytes arrive**. Measured CLS attributable to the carousel: **0.000** at both 1440 × 900 and 390 × 844.

### Other assets

| File | Use |
| --- | --- |
| `public/hero/axlo-hero-image.jpg` | Hero primary tile |
| `public/hero/hero-insight.jpg` | Hero secondary tile |
| `public/brand/axlo-logo-light.svg` | Brand lockup — inlined by `Logo.tsx`; also the `logo` in JSON-LD |
| `public/brand/axlo-digital-icon.svg` | Brand mark — inlined by `StartHereIcon.tsx` |
| `public/hero/hero-operations.jpg` | **Unreferenced** — retained, see §9 |
| `public/og/axlo-default.svg` | **Unreferenced** — retained, see §9 |

---

## 5. Responsive viewports verified

**Twelve resolutions**, each asserted to have no horizontal overflow
(`tests/responsive.spec.ts`, driven from `tests/helpers.ts`):

375×812 · 390×844 · 768×1024 · 820×1180 · 1024×768 · 1180×820 · 1280×800 · 1366×768 · 1440×900 ·
1600×900 · 1920×1080 · 2560×1440

Layout behaviour additionally asserted: the process section is four across on desktop, 2 × 2 on
tablet and vertical on mobile; product panels are two columns on desktop and one on mobile; the
flipped product gets the wide column; the hero headline holds its two authored lines on a laptop.

**Six capture sizes** in `docs/screenshots/` — 1440×900, 1366×768, 1024×768, 768×1024, 390×844,
360×800 — for `home`, `privacy-draft` and `terms-draft`, plus an isolated `axlopos-panel--*.png` at
every size and `mobile-drawer--*.png` at the two phone widths. **26 captures, all verified:** nothing
left in a pending reveal state, no horizontal overflow, and every image decoded.

---

## 6. Accessibility verification

Automated against **axe-core** with tags `wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa`.

| Check | Result |
| --- | --- |
| WCAG 2.2 AA violations on `/` | **0** |
| WCAG 2.2 AA violations, mobile drawer open | **0** |
| Heading order | One `h1`, no skipped levels |
| Body copy floor | No rendered body copy below 15px |
| Target size | Every interactive target ≥ 44px high |
| Focus visibility | First 10 tab stops all show a ring ≥ 2px |
| Decorative graphics | All `[data-decorative]` nodes `aria-hidden` |
| Skip link | Present, first in tab order |
| Mobile drawer | Traps focus, closes on Escape, hands focus to the destination |

### Carousel accessibility

Announced as a carousel (`role="group"`, `aria-roledescription="carousel"`,
`aria-label="AxloPOS product views"`). Manual controls are **always** present: Previous, Next, one
dot per slide, the position `01 / 02`, and the active slide's label.

- The active slide is announced politely — "View 1 of 2: Owner dashboard" — and **focus is never
  moved** when the slide changes. Verified: focus stays on the control that was pressed.
- Inactive slides leave the reading order and the accessibility tree (`aria-hidden` + `inert`).
- Arrow keys operate the carousel once focus is inside it.
- Touch swipe works on mobile; `touch-action: pan-y` preserves vertical page scroll.
- Every control has a visible 2px focus ring.
- The active dot is **wider as well as filled**, so state is never carried by colour alone.

### Autoplay

Interval **7000 ms**. Suspended whenever the visitor is likely engaged or not looking: pointer over
the carousel, keyboard focus inside it, the browser tab hidden, or the section scrolled out of view.

**Under reduced motion it never runs, the Pause/Play control is not rendered at all, and transitions
collapse to a short crossfade.** Reduced motion is honoured from both the OS preference and the
in-page footer toggle. The screenshots still render — reduced motion changes the transition, not the
content.

---

## 7. Test results

Playwright, two projects (`desktop` 1440×900 and `mobile` 390×844), against a **real production
build** (`next build && next start`).

| | Passed | Skipped | Failed |
| --- | --- | --- | --- |
| desktop | 57 | 2 | **0** |
| mobile | 39 | 20 | **0** |
| **Total** | **96** | **22** | **0** |

Six spec files: `accessibility` · `content` · `navigation` · `products` · `responsive` · `helpers`.

The 22 skips are intentional and were verified, not assumed: `responsive.spec.ts` sets its viewport
per test and carries `test.skip` on the mobile project, so the same twelve sizes are not run twice.
All 17 of its tests pass on desktop. The drawer accessibility test skips above 1024px, where no
drawer exists.

### Two defects found and fixed during Phase 2 verification

**1 — A mobile test failure (test defect, not an implementation defect).**
`settle()` sweeps the page and returns to the top. On a ~10,000px-tall phone document that never
gives Chrome's lazy loader time to commit a fetch, so the screenshots legitimately had not loaded
when the assertion ran. Desktop passed only incidentally, its document being shorter. Confirmed by
direct probe that the images **do** load on mobile once scrolled to. The test now scrolls the
carousel into view and polls for decode — **every original assertion is unchanged**.

**2 — A latent hang in the capture tooling.**
`img.decode()` on a lazy image whose load has not started never settles in Chrome. `npm run
screenshots` hung indefinitely. The tool predates these screenshots — AxloPOS was a composed
interface with no image files — so it had never encountered a lazy image. `scripts/capture-screenshots.mjs`
now promotes lazy images to eager **inside the capture harness only**, with every wait bounded.

> Per the Phase 2 approval: this fix is **isolated to the capture tooling**. Production
> image-loading behaviour was not modified to accommodate screenshot automation, and must not be.

### Regression test added

`tests/products.spec.ts` asserts the screenshot box is reserved at 2048/967 **while the images are
still undecoded** — the only moment the no-CLS guarantee is observable. If the intrinsic dimensions
in the content model ever stop matching the files, this fails.

---

## 8. Lint, type-check and build

| Command | Result |
| --- | --- |
| `npm run typecheck` | ✅ Clean — `tsc --noEmit`, no errors |
| `npm run lint` | ✅ Clean — `eslint .`, no errors, no warnings |
| `npm run build` | ✅ Clean — 11 static pages, **no warnings**, no missing-image warnings |
| `npm test` | ✅ 96 passed, 0 failed |

All 11 routes prerender as static content. First Load JS shared by all: **103 kB**; the landing page
is **166 kB** first load. The workspace-root build warning was eliminated by pinning
`outputFileTracingRoot` in `next.config.mjs`.

---

## 9. Known non-blocking deferred cleanup

Nothing here is broken, and none of it blocks launch. It is recorded so "unused" is a **tracked
decision** rather than something rediscovered by the next dead-code scan. Full detail in
[`REPOSITORY-CLEANUP.md`](REPOSITORY-CLEANUP.md).

| Item | Status | Decision |
| --- | --- | --- |
| `components/data-visualization/Diagrams.tsx` + CSS | Unreferenced | **Retain unchanged.** Pre-existing — unreferenced before this branch existed |
| `components/data-visualization/Charts.tsx` | Unreferenced by the app | **Retain.** Exercised by `stories/Charts.stories.tsx` |
| `components/motion/StageRail.tsx` | Unreferenced | **Retain.** Unreferenced at the base commit too |
| `lib/motion.ts` | Unreferenced | **Retain.** Same reason |
| `public/hero/hero-operations.jpg` | Unreferenced (1920×1080, 45 KB) | **Retain.** From an earlier two-tile hero composition |
| `public/og/axlo-default.svg` | Unreferenced (2.8 KB) | **Retain, do not reinstate.** Superseded by `app/opengraph-image.tsx` — SVG social cards do not render on Facebook, LinkedIn, X or Slack |

**Why these were not removed:** deleting pre-existing dead code inside a content-and-routing change
mixes two unrelated decisions in one diff and makes the restructure harder to review. All are
tree-shaken out of every shipped bundle, so the runtime cost is zero. Schedule as a **separate
repository-cleanup task**.

Housekeeping already completed: `pnpm-lock.yaml` and `pnpm-workspace.yaml` removed (the project uses
npm); `test-results/.last-run.json` untracked; `test-results/` and `playwright-report/` gitignored.
The stray `package-lock.json` in the home directory is outside this repository and was **not**
touched.

---

## 10. L1 — the remaining blocker

### 🔴 Legal content — blocks public launch

**Status:** none supplied. **Owner:** client + qualified legal adviser.

`/privacy` and `/terms` exist as **internal drafts**. They are `noindex, nofollow`, are **not linked
from anywhere on the site**, and each carries a visible "not in force" notice. Every clause requiring
legal judgement is marked *Pending legal review*.

**Nothing was generated to fill space.** Automatically generated legal content is not professionally
approved content, and none has been fabricated.

| Document | Outstanding |
| --- | --- |
| Privacy Policy | Categories of personal data, lawful bases, retention periods, processor list, applicable regime, rights and how to exercise them, named data-protection contact, registered address |
| Terms of Service | Scope, acceptable use, limitation of liability, warranty disclaimers, indemnities, governing law, registered entity |

**This does not block design, implementation, responsiveness, accessibility or QA work, and none of
that work was held back for it.** It blocks one thing: **final public launch**.

**To clear it:** supply approved copy, then in a single change (a) replace the draft bodies,
(b) remove the `noindex` and the "not in force" notices, and (c) restore the two entries to
`legalNav` in `lib/site.ts`, which puts the footer links back.

### 🟠 R3 — open, does not block launch

The exact approved AxloPOS availability status, and verification of the withdrawn
accounting-platform integration claim. Both recorded in `content/products/pending.ts`, which nothing
imports — so it cannot reach the browser. Supply either and it can be published **as copy, not as a
badge**.

---

## 11. Recommended deployment checklist

### Before deploying

1. **Do not mark the site "ready for public launch" until L1 is cleared.** Design and development are
   complete; legal content is not.
2. Commit the two AxloPOS screenshots — confirm they are **not** gitignored (verified: they are not)
   and that Git LFS is not silently required.
3. Land the npm lockfile cleanup as **its own commit**, separate from the design changes.
4. Open a PR from `feature/axlo-website-restructure` to `main` and review the full diff.
5. Re-run the gate on CI: `npm run typecheck && npm run lint && npm run build && npm test`.

### Environment and configuration

6. Set the production domain to `https://www.axlodigital.com` — it is hard-coded in `lib/site.ts`
   and feeds canonical URLs, `robots.txt`, `sitemap.xml` and JSON-LD. Change it there if the domain
   differs.
7. Node 20+; build `npm run build`, start `npm start`. No environment variables and no secrets are
   required — **there is no analytics platform, no tracking script and no third-party network call.**
8. Confirm `next/image` optimisation is available on the target host. On a platform without it,
   configure an image loader — do **not** switch the screenshots to unoptimised `<img>`.

### After deploying

9. Verify `/robots.txt` and `/sitemap.xml` resolve, and that **`/privacy` and `/terms` return
   `noindex, nofollow`** and appear nowhere in the sitemap.
10. Confirm both AxloPOS screenshots load over the production domain and are served through
    `/_next/image` — not as raw PNGs, and never from a temporary URL.
11. Spot-check the carousel on a real phone: swipe, Pause/Play, and the `01 / 02` position.
12. Re-check reduced motion with the OS setting enabled: autoplay must not run and the Pause control
    must be absent.
13. Run Lighthouse on the deployed page and confirm **CLS stays at 0** with a cold cache.
14. Submit the sitemap to Search Console **only after L1 is cleared** — the drafts must never be
    indexed.

### Deliberately not configured

No analytics, tag manager, cookie banner, consent tool, contact-form backend, email provider or CRM.
`lib/analytics.ts` is a typed no-op seam: if a tag manager is ever installed it will find
`window.dataLayer` already being populated with correctly-named events. **Installing any of these is
a scope and, for consent tooling, a legal decision — not a deployment step.**

---

## Reference

| Document | Contents |
| --- | --- |
| [`LAUNCH-BLOCKERS.md`](LAUNCH-BLOCKERS.md) | Blocker register, project status, Phase 2 approval decisions |
| [`REPOSITORY-CLEANUP.md`](REPOSITORY-CLEANUP.md) | Retained-but-unreferenced register |
| [`website-redesign-implementation-plan.md`](website-redesign-implementation-plan.md) | Implementation plan |
| [`website-premium-refinement-plan.md`](website-premium-refinement-plan.md) | Refinement plan |
| `content/products/pending.ts` | Withdrawn and awaited product copy — internal, imported by nothing |
| `docs/screenshots/` | 26 verified captures at six viewport sizes |
