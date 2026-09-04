# Axlo Digital — website

_Connected technology. Faster business._

> **Scope — v1 is a single landing page.**
> Everything the public site renders lives in `app/page.tsx`, in six sections:
> Hero · Services / What We Do · Products · How We Work · Final CTA · Footer.
> Navigation scrolls to `#home`, `#services`, `#products`, `#how-we-work`, `#contact`.
> The only products are **Comply360** and **AxloPOS**.
> `/privacy` and `/terms` exist as `noindex` internal drafts and are deliberately unlinked.
> **Not launch-ready** — see [`docs/LAUNCH-BLOCKERS.md`](docs/LAUNCH-BLOCKERS.md).

Production frontend for [axlodigital.com](https://www.axlodigital.com): a Next.js App Router site
built on the **Axlo Flow design system**, dark-first, with a reduced-motion mode and a connected-flow
motion concept that runs from the hero to the final CTA.

---

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
```

```bash
npm run build          # production build
npm run start          # serve the production build
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm test               # Playwright — builds and serves automatically
npm run screenshots    # captures docs/screenshots at six widths, and verifies them
```

Requires Node 18.18+. **npm is the package manager** — there is no pnpm or yarn lockfile.

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript (strict) |
| Styling | CSS Modules + CSS custom properties (**no Tailwind**) |
| Reveals & timelines | CSS + IntersectionObserver |
| Component motion | `motion` — one scroll-linked figure (`StartHereIcon`) |
| Diagrams & product UI | SVG and composed DOM, hand-authored |
| Primitives | Radix UI — dialog only, for the mobile drawer |
| Testing | Playwright + `@axe-core/playwright` |
| Analytics | None installed. A dependency-free `window.dataLayer` seam |

No GSAP, no React Three Fiber, no charting library on any route.

---

## Structure

```
app/
├── page.tsx              The site — 6 sections, in order
├── privacy/  terms/      INTERNAL DRAFTS — noindex, not linked from anywhere
├── not-found.tsx         Custom 404
├── legal.module.css      Shared policy-page styling
└── sitemap.ts  robots.ts  opengraph-image.tsx  icon.svg  apple-icon.tsx

components/
├── accessibility/        SkipLink
├── foundations/          Button, Logo, Primitives (Eyebrow, Tag, PlaceholderNote, …)
├── layout/               Container, Section, Grid, Stack, SectionHeader,
│                         PageHero, LegalPage, ThemeProvider, MotionToggle
├── motion/               Reveal, FlowLine, HeroDepth, CursorAffordance, StageRail*
├── navigation/           Header, MobileMenu, Footer, SectionLink, SectionCta, ProductLink
├── product-demo/         AppFrame, Comply360Interface, ProductScreenshot, ProductMediaCarousel
├── sections/             Hero, ServicesSection, ProductsSection, ProductShowcase,
│                         TrustSection, BrandProposition, ProcessDiagrams, FinalCta,
│                         StartHereIcon
└── data-visualization/   Charts, Diagrams*        (* unreferenced — see the cleanup register)

content/                  All copy, as typed modules
├── products/             Comply360 and AxloPOS
├── services/             The three capability areas
└── company/              Delivery stages + the workflow strip

lib/                      site.ts · seo.ts · scroll.ts · hooks.ts · analytics.ts · motion.ts*
public/
├── brand/                Axlo marks
├── hero/                 Hero photography
└── images/products/
    └── axlopos/          The two real AxloPOS screenshots
scripts/                  capture-screenshots.mjs
styles/                   tokens → dark-theme → typography → motion → globals
tests/                    Playwright specs
docs/                     Launch blockers, cleanup register, historical plans
```

---

## Navigation

The site is one scrolling document. Every destination is an in-page anchor, and every link is a real
`#hash` href — JavaScript only upgrades the click to smooth, reduced-motion-aware scrolling with
focus management and a synced URL hash, so navigation works with scripting disabled.

| Section | Anchor |
| --- | --- |
| Hero | `#home` |
| Services / What We Do | `#services` |
| Products | `#products` |
| How We Work | `#how-we-work` |
| Final CTA | `#contact` |

The active item comes from a single `IntersectionObserver` scroll-spy (`lib/scroll.ts`) and is marked
with `aria-current` plus a weight change and an underline rule — never colour alone.

**Two project actions, worded for what they do.** "Talk to Axlo" is navigational — it appears in the
header, the hero and the mobile drawer, and scrolls to `#contact`. "Start a conversation" is the
action *at* that section and opens mail with the subject already set. A button that scrolls and a
button that launches a mail client should not read identically.

The navigational label is the client brief's approved primary conversion CTA (§4) and is defined
**once**, as `primaryCta.label` in `lib/site.ts`. Nothing types it by hand; change it there and all
three placements move together. `tests/content.spec.ts` asserts every conversion button targeting
`#contact` carries that exact label, and that no retired wording survives anywhere on the page.

---

## Design system

`styles/tokens.css` holds raw brand values. **Components consume only the semantic layer** in
`styles/dark-theme.css`, where every accent is paired with an `--color-on-*` foreground so no
component picks a contrast by hand.

Palette: Axlo Midnight `#0B1220` · Kinetic Teal `#006C68` · Flow Aqua `#00D4C7` · Volt Lime
`#C7FF3D` · Axlo Cloud `#F4F7F7` · Digital Slate `#5F6B75` · Pure White.

Type: Sora for display, Inter for everything else, fluid `clamp()` scale, 15px body-copy floor.

**v1 is intentionally dark-only.** `styles/light-theme.css` is authored but not imported, and **no
theme control is exposed anywhere** — the only footer control is the reduced-motion toggle, which is
an accessibility control. Re-enabling the light theme needs a contrast audit and a widened `theme`
prop on `Section`; it is not a launch blocker.

---

## Content integrity

The site does not publish claims it cannot support. Enforced in the content model and asserted in
`tests/content.spec.ts`:

- **No customers, metrics, testimonials, logos, awards or partnerships.** None are approved, so none
  are rendered, and none are invented.
- **No unverified integrations.** An accounting-platform integration was listed against AxloPOS —
  in the copy *and* in the composed dashboard — and has been withdrawn from both pending
  verification. See blocker R3.
- **No availability or maturity claim.** Nothing states that a product is available, live,
  production-ready, integrated or in use, and **no release-stage badge is rendered anywhere** —
  not Live, Beta, Pilot or Coming Soon. AxloPOS carries one approved neutral sentence and four
  capability pills, each naming a domain from that sentence and visible in its screenshots.
- **No "coming soon".** The footer previously showed "Privacy — Coming soon" chips; it now renders
  nothing rather than an unfinished placeholder.
- **A product state is a real screenshot or a declared drawing, never something in between.**
  AxloPOS shows two real screenshots through `next/image`, scaled proportionally and rendered
  without the dark-theme photographic grade. Comply360's composed states carry a visible "Sample
  view" chip and append *"Sample content, not customer data"* to their accessible description. The
  composed AxloPOS interface was **deleted** when the real screenshots landed, rather than kept
  behind a branch.
- **Pending content is declared, not inferred.** [`content/products/pending.ts`](content/products/pending.ts)
  names exactly what each product awaits, and is the source
  [`docs/LAUNCH-BLOCKERS.md`](docs/LAUNCH-BLOCKERS.md) is written from. It lives in its own module
  because `ProductShowcase` is a client component: anything on the `Product` object is serialised
  into the shipped HTML, so a field there would have *published* the very claim it documented.

---

## Accessibility

Target: **WCAG 2.2 AA**, verified with axe at two viewports.

Skip link · landmarks · one `h1` · no skipped heading levels · 2px focus ring at 2px offset ·
44px minimum targets · 15px body floor · no colour-only meaning · mobile drawer with focus trap,
Escape and scroll lock · carousels that never move focus and expose inactive slides as `inert`.

**Reduced motion is a designed mode, not a kill switch.** Honoured at three levels: the OS media
query, the in-page **Reduce motion** control, and per-component hooks. Under it, path draws snap to
their final state, loops stop, carousel autoplay never starts and its pause control is not rendered,
and reveals collapse to a short fade. All content and functionality remain.

Scroll reveals are deliberately **not** a Motion `initial` variant — that would serialise
`opacity: 0` into the server HTML and hide content from anyone whose JavaScript never runs. Elements
render visible, and only those still below the fold after hydration are hidden and released by an
observer.

---

## Screenshots

```bash
npm run screenshots
```

Builds, serves, captures `docs/screenshots/` at **1440×900, 1366×768, 1024×768, 768×1024, 390×844 and
360×800**, then tears the server down.

It sets `window.__AXLO_CAPTURE__` before hydration, which makes every reveal resolve immediately and
register no observer. Without it, `fullPage` capture resizes the viewport, re-fires the
IntersectionObservers, and produces screenshots with blank bands.

This is a **separate flag from reduced motion, on purpose**. Reduced motion is a real user preference
with its own rendering that has to keep being tested as itself; tooling must not borrow it. The script
exits non-zero if any element is still pending or any page overflows horizontally at any width.

> A `data-` attribute was tried first and did not work: React reconciles the attributes on `<html>`
> during hydration and strips anything the server did not render. A `window` property is outside
> React's tree.

---

## Testing

```bash
npm test
npx playwright test --ui
```

Runs against a real production build, because reveal observers, reduced motion and layout all behave
differently under the dev server. Two projects: desktop 1440×900 and mobile 390×844.

| Spec | Covers |
| --- | --- |
| `navigation` | Anchor resolution, hash sync, `aria-current`, sticky-header clearance, drawer focus contract |
| `accessibility` | axe sweep, heading order, focus rings, 44px targets, 15px type floor, decorative graphics hidden |
| `responsive` | No horizontal overflow at twelve resolutions; grid behaviour at each breakpoint |
| `products` | Both products, carousel a11y, external AxloPOS link safety, reduced-motion behaviour |
| `content` | CTA wording, mailto subject, unverifiable-claim sweep, no "coming soon", legal drafts unlinked and noindex |

---

## Documentation

| Document | What it covers |
| --- | --- |
| [`docs/LAUNCH-BLOCKERS.md`](docs/LAUNCH-BLOCKERS.md) | Everything outstanding before production |
| [`docs/REPOSITORY-CLEANUP.md`](docs/REPOSITORY-CLEANUP.md) | Retained unused code and completed housekeeping |
| [`content/products/pending.ts`](content/products/pending.ts) | What each product is still waiting on — internal, never shipped |
| [`docs/website-redesign-implementation-plan.md`](docs/website-redesign-implementation-plan.md) | Phase 0 audit (historical — predates the scope correction) |
| [`docs/PHASE-1-ARCHITECTURE.md`](docs/PHASE-1-ARCHITECTURE.md) | Original design direction (historical) |
| [`docs/website-premium-refinement-plan.md`](docs/website-premium-refinement-plan.md) | Prior refinement pass (historical) |

## Storybook

Config is present; the packages are intentionally not in `package.json`. Run
`npx storybook@latest init --builder webpack5` once, then remove `stories` and `.storybook` from the
`exclude` list in `tsconfig.json`.
