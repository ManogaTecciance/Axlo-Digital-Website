# Axlo Digital — Website Restructure: Audit & Implementation Plan

**Branch:** `feature/axlo-website-restructure` (created from `feature/website-premium-refinement` @ `2b8df1c`)
**Date:** 2026-08-26
**Phase:** 0 — audit and plan. **No production-facing code has been changed.**
**Scope:** evolve the approved single-page Axlo Digital site into a structured multi-page corporate, product and connected-business-solutions platform, preserving the Axlo Flow identity.

---

## 0. Source-of-truth status — read this first

> **BLOCKER — the referenced developer brief is not in the repository or on this machine.**
>
> `/docs/Axlo_Digital_Website_Redesign_Developer_Brief.docx` does not exist. A filesystem sweep of
> `~/Downloads`, `~/Documents`, `~/Desktop` and the whole `TECCIANCE` tree found **no `.docx`, `.doc` or `.pdf`**
> matching the brief. `/docs` contains only two prior internal documents:
> `PHASE-1-ARCHITECTURE.md` and `website-premium-refinement-plan.md`.

**Consequence.** The master prompt is currently the *only* source of truth. It carries the strategic direction,
the IA, the homepage structure and the approved positioning lines — all of which are actionable. What it does
**not** carry, and what the brief was expected to supply, is the **deep product content** (§10: "Use the supplied
product content from the developer brief"): feature groups, core workflows, audiences, integrations and security
notes for Comply360, Axlo Payroll, Axlo Budget and AxloPOS.

**How this plan handles it.** Everything derivable from the prompt is planned in full. Everything that depends
on the missing brief is listed in §7 (Missing content and assets) as a named content dependency, with a
structural placeholder strategy that never fabricates a claim. Supply the `.docx` and the affected work
un-blocks without re-planning.

---

## 1. Current website architecture

A **single-page landing site** on Next.js 15 App Router. One content route; every "destination" is an in-page
section addressed by hash and driven by an `IntersectionObserver` scroll-spy.

```
Next.js 15.1.6 · React 19 · TypeScript 5.7 (strict)
CSS Modules + CSS custom properties — no Tailwind
motion@11 (component transitions) · @radix-ui/react-dialog (mobile drawer)
Playwright 1.62 + @axe-core/playwright (e2e + a11y)
Storybook config present, packages deliberately NOT installed
```

**Document order on `/`:** Hero → Services → `FlowConnector` → Products → Trust strip → How We Work
(`BrandProposition`) → Final CTA, with `Header` / `Footer` / `SkipLink` / `CursorAffordance` from the root layout.

**Health at HEAD:** `tsc --noEmit` passes. Working tree clean. 12,430 lines across `app/`, `components/`,
`content/`, `lib/`, `styles/`, `tests/`, `stories/`.

---

## 2. Existing route inventory

| Path | File | Kind | Notes |
| --- | --- | --- | --- |
| `/` | `app/page.tsx` | Page | The entire site. 5 sections + trust strip. Emits `SoftwareApplication` JSON-LD ×2. |
| `*` (404) | `app/not-found.tsx` | Page | Links back to `/#services` etc. **Breaks under multi-page IA.** |
| `/sitemap.xml` | `app/sitemap.ts` | Route | Returns **exactly one URL**. |
| `/robots.txt` | `app/robots.ts` | Route | Correct; disallows `/api/`. |
| `/icon.svg` | `app/icon.svg` | Metadata file | Favicon. |
| `/apple-icon` | `app/apple-icon.tsx` | Metadata file | Generated apple-touch-icon. |
| `/opengraph-image` | `app/opengraph-image.tsx` | Metadata file | Generated raster OG card (site-wide). |

**Total: 1 content route.** No `/contact`, no product pages, no solutions, no legal routes, no API routes,
no server actions, no dynamic segments.

---

## 3. Existing component inventory

44 `.tsx` components in 8 folders. Assessment column: **Keep** (reuse as-is) · **Refactor** (reuse with change) ·
**Retire** (superseded) · **Fix** (defective today).

### `components/accessibility/`
| Component | Assessment | Note |
| --- | --- | --- |
| `SkipLink` | **Keep** | Correct skip-to-content. Works unchanged on every route. |

### `components/foundations/`
| Component | Assessment | Note |
| --- | --- | --- |
| `Button` | **Keep** | Polymorphic `<button>`/`next/link`/`<a>`, 4 variants × 3 sizes, loading + `aria-busy`, auto-detects external `href`. Form-ready. |
| `Logo` | **Keep** | Inlined brand lockup, `currentColor` letters + flow-gradient diagonal. `as="link"` already points at `/`. |
| `Primitives` | **Keep** | `Eyebrow`, `Tag`, `SectionHeading`, `PlaceholderNote`, `Divider`, `Skeleton`, `Status`, `VisuallyHidden`. `PlaceholderNote` is the existing unpublished-content mechanism — reused heavily in Phase 3. |

### `components/layout/`
| Component | Assessment | Note |
| --- | --- | --- |
| `Layout` (`Container`/`Section`/`Grid`/`Stack`) | **Refactor** | Sound. `Section` is typed `theme?: 'dark'` — widen only if the light theme returns. |
| `SectionHeader` | **Keep** | eyebrow → h2 → lead ladder on `--flow-*` tokens. |
| `PageHero` + `Breadcrumbs` | **Refactor** | **Already built and currently unused** — designed for exactly the secondary pages this project adds. Two fixes: hard-coded `id="page-title"` (collides if ever used twice) and `<ol>/<li>` carrying `display:contents`, which strips list semantics in some AT. |
| `LegalPage` | **Fix** | **Broken:** imports `@/app/legal.module.css`, which does not exist. Unreferenced today, so the build passes; it will fail the moment `/privacy` imports it. Stylesheet must be authored. |
| `ThemeProvider` | **Refactor** | Motion preference only — theme is fixed dark on `<html>`. Pre-paint inline script is correct. |
| `MotionToggle` | **Keep** | The in-page reduced-motion control. |

### `components/motion/`
| Component | Assessment | Note |
| --- | --- | --- |
| `Reveal` / `RevealGroup` / `RevealItem` | **Keep** | Best-in-class contract: server never emits hidden content; hides only what it has confirmed is below the fold and can reveal again. No-JS safe. Reused on every new page. |
| `FlowLine` (`FlowConnector`, `SlashMark`) | **Keep** | The flow-line visual language. |
| `HeroDepth` | **Keep** | Hero parallax wrapper, reduced-motion aware. |
| `CursorAffordance` | **Keep** | Gated on fine pointer + hover. |
| `StageRail` | **Retire** | Unreferenced. Superseded by the ribbon inside `BrandProposition`. |

### `components/navigation/`
| Component | Assessment | Note |
| --- | --- | --- |
| `Header` | **Refactor (major)** | Built entirely for hash navigation + scroll-spy. Becomes route-aware. |
| `MobileMenu` | **Refactor** | Radix Dialog gives focus trap, Escape, background inert, scroll lock — **all §7 mobile requirements already satisfied**. Only the link model and `onCloseAutoFocus` behaviour change. |
| `Footer` | **Refactor** | Three columns → the §8.08 column set. `legalNav` "Coming soon" spans become real routes. |
| `SectionLink` / `SectionCta` | **Refactor → `RouteLink` / `RouteCta`** | Same styling contract, `next/link` instead of `navigateToSection`. |
| `ProductLink` | **Keep** | Already handles external-vs-internal safely (`target="_blank"` + `rel="noopener noreferrer"` + `aria-label`). |
| `FooterControls` / `FooterEmail` | **Keep** | |

### `components/product-demo/`
| Component | Assessment | Note |
| --- | --- | --- |
| `AppFrame` | **Keep** | The a11y + content-integrity boundary: `role="img"` + one accurate `aria-label` suffixed *"Sample content, not customer data."*, plus a visible **"Sample view"** chip. This is already the §8 "Demo Data / Illustrative Example" mechanism — it only needs its label vocabulary aligned. |
| `Comply360Interface` | **Keep** | 3 composed states, container queries. |
| `AxloPosInterface` | **Keep** | 3 composed states. |
| `ProductMediaCarousel` | **Keep** | Prev/next/dots/position/pause, polite live region, **focus never moved on transition**, autoplay suspended on hover/focus/tab-hidden/off-screen, disabled entirely under reduced motion, `inert` on inactive slides. Meets §20 verbatim. |

### `components/sections/`
| Component | Assessment | Note |
| --- | --- | --- |
| `Hero` | **Refactor** | Keep the composition; replace copy, CTA order and the flow narrative. |
| `ServicesSection` | **Refactor** | 3 pillars → 4 (Brand & Growth added). Grid + connector line re-flow to 4-across / 2×2. |
| `ProductsSection` | **Refactor** | 2 full alternating panels → compact 4-card set with weighted prominence. |
| `ProductShowcase` | **Reuse on product pages** | Too tall for the new compact homepage — becomes the *product-page* hero/showcase block. |
| `TrustSection` | **Refactor** | Absorbed into the merged §8.05 "Why Axlo + Proof". |
| `BrandProposition` | **Keep** | Think → Design → Build → Evolve with the stepped flow ribbon. §8.06 says preserve — preserve. Copy updated to the §8.06 wording. |
| `ProcessDiagrams` | **Keep** | The four stage figures. |
| `FinalCta` | **Refactor** | New headline/copy; mailto → `/contact`. |
| `StartHereIcon` | **Keep** | |

### `components/data-visualization/`
| Component | Assessment | Note |
| --- | --- | --- |
| `Charts` | **Keep (dormant)** | Bar/line/donut/KPI + `ChartFrame` with a11y summary. Referenced only by Storybook. Retain for Insights/Case-studies. |
| `Diagrams` | **Retire or absorb** | Unreferenced anywhere, including stories. Decide at Phase 3. |

---

## 4. Existing design-system and token inventory

| File | Role | Status |
| --- | --- | --- |
| `styles/tokens.css` | **Primitives** — brand palette, spacing (4px base, `--space-1…40`), stepped section rhythm, container/gutter/grid, radii, z-index, motion easings + durations, font families. Responsive at 480/768/1024/1280/1440. | **Keep verbatim.** All seven approved colours present: Axlo Midnight `#0B1220`, Kinetic Teal `#006C68`, Flow Aqua `#00D4C7`, Volt Lime `#C7FF3D`, Axlo Cloud `#F4F7F7`, Digital Slate `#5F6B75`, Pure White `#FFFFFF`. |
| `styles/dark-theme.css` | **Semantic** tokens under `[data-theme='dark']`. Every accent is paired with an `--color-on-*` foreground so no component picks a contrast by hand. | **Keep.** Extend with the new surface roles in §5 below. |
| `styles/light-theme.css` | Authored light semantic layer. | **NOT IMPORTED.** Site is dark-only by decision. See Decision **D5**. |
| `styles/typography.css` | Sora display / Inter body, fluid `clamp()` scale, 15px body floor, utility classes. | **Keep.** |
| `styles/motion.css` | Keyframes, ambient-pause hook, and the full reduced-motion block for both `prefers-reduced-motion` and `[data-motion='reduced']`. | **Keep.** |
| `styles/globals.css` | Reset, focus ring (2px `--color-focus`, 2px offset), reveal states, print. | **Refactor** — `scroll-padding`/`scroll-margin` rules are single-page assumptions. |

**Governance already in force and to be preserved:** components consume *only* the semantic layer;
raw brand values are never referenced directly outside `tokens.css`. This satisfies §18 as-is.

---

## 5. Existing asset inventory

| Asset | Dimensions | Size | Used? | Assessment |
| --- | --- | --- | --- | --- |
| `public/brand/axlo-logo-light.svg` | vector | 2.3 KB | Source for inlined `Logo` | **Keep** |
| `public/brand/axlo-digital-icon.svg` | vector | 1.1 KB | — | **Keep** |
| `public/hero/axlo-hero-image.jpg` | **7680 × 4320** | **2.63 MB** | Yes — hero, `priority` | **Downsample master.** 8K source for a ≤1560px slot. |
| `public/hero/hero-insight.jpg` | 900 × 1400 | 36 KB | Yes — decorative quote backdrop, `alt=""` | **Keep** |
| `public/hero/hero-operations.jpg` | 1920 × 1080 | 45 KB | **No** — README only | **Orphan.** Flagged, not deleted (per §1). |
| `public/og/axlo-default.svg` | vector | 2.8 KB | **No** — superseded by `app/opengraph-image.tsx` | **Orphan.** Correctly superseded: SVG OG cards do not render on any major social platform. |

> ### ⚠ There are **zero product screenshots** in this repository.
>
> §8 instructs: *"Use the existing real AxloPOS screenshots… Store all images locally and use `next/image`."*
> **No such files exist.** The previous refinement pass deleted the two AxloPOS PNGs
> (`axlopos-owner-dashboard.png`, `axlopos-checkout-cart.png`) because they were empty branded frames, and
> replaced them with `AxloPosInterface.tsx` — a composed DOM/CSS interface.
>
> What exists today is **higher quality than a screenshot** on every axis this brief cares about: it is
> theme-aware, reads crisply at any zoom, has **zero CLS** (no image to reserve or lazy-load), stays readable
> at small sizes (§26.17), and is exposed to assistive technology as one accurate sentence rather than forty
> disconnected numbers. See Decision **D3**.

---

## 6. Existing animation and interaction inventory

| Interaction | Mechanism | Reduced-motion behaviour | Assessment |
| --- | --- | --- | --- |
| Hero entrance | Pure CSS `[data-hero-step]` keyframe + per-step delay. No library, no observer. | Collapsed by the global block | **Keep** |
| Hero depth/parallax | `HeroDepth`, pointer-driven | Disabled via `useReducedMotion` | **Keep** |
| Scroll reveals | `Reveal*` — CSS transition + `IntersectionObserver`, visible-first | `[data-reveal]` forced visible | **Keep** |
| Section flow connectors | `FlowConnector` SVG path draw | `[data-flow-path]` snaps to final state | **Keep** |
| Process ribbon | `BrandProposition` — SVG stepped path + entrance sequence | Sequence forced to `shown` | **Keep** |
| Product carousel | `ProductMediaCarousel` — CSS transform slide, 7 s autoplay | **Autoplay never runs; pause control not rendered** | **Keep** |
| Header progress rail | `motion` `useScroll` + `useSpring` | Not rendered at all | **Refactor** — a read-position rail is a single-page affordance |
| Scroll-spy active state | One `IntersectionObserver` over 5 ids | n/a | **Retire** — replaced by `usePathname()` |
| Smooth in-page scroll | `lib/scroll.ts` + `scroll-behavior` | `auto` | **Retire for nav; retain the helper** for on-page ToC anchors (legal pages, What We Do) |
| Custom cursor | `CursorAffordance`, fine-pointer gated | Disabled | **Keep** |
| Ambient status ticks | `.axlo-ambient` + `[data-ambient='paused']` | Paused | **Keep** |

**Nothing prohibited by §19 is currently present** — no scroll hijacking, no pinned sections, no continuous
parallax, no autoplay audio, no motion behind body copy. The reduced-motion implementation is already
three-layer (OS media query → in-page toggle → per-component hooks).

---

## 7. Gap analysis against the target

### 7.1 Structural gaps

| # | Requirement | Today | Gap |
| --- | --- | --- | --- |
| G1 | 29-route multi-page IA (§6) | 1 content route | **Total.** 28 routes to add. |
| G2 | 7-item nav + persistent "Talk to Axlo" (§7) | 4 hash items + "Talk to Axlo" | Nav model and active-state mechanism change. **CTA label resolved 2026-08-31** — "Talk to Axlo" adopted from the brief; the 7-item nav is deferred to V2. |
| G3 | `aria-current="page"` (§7) | `aria-current="true"` | Value is wrong for route navigation. Test asserts the wrong value too. |
| G4 | Four brand layers, visually distinct (§4) | Products and Services only; no Solutions layer | New content model, new section, new page family, new visual treatment. |
| G5 | 4 owned products (§4) | 2 (`Comply360`, `AxloPOS`) | Axlo Payroll + Axlo Budget absent entirely. |
| G6 | Brand & Growth service line (§5) | Absent | New 4th homepage pillar + new What-We-Do group. |
| G7 | Contact page + validated form (§16) | `mailto:` only | No form, no server action, no validation, no spam protection, no rate limiting, no adapter. |
| G8 | Legal routes (§17) | Footer "Coming soon" spans | 3 routes; `LegalPage` exists but is **broken** (missing stylesheet). |
| G9 | Industries / Case studies / Insights (§12, §14, §15) | Absent | 3 content families, 3 templates, 3 indexes. |
| G10 | Breadcrumbs on deeper routes (§21) | `Breadcrumbs` built, unused | Wire up + `BreadcrumbList` JSON-LD. |

### 7.2 Content and messaging gaps

| # | Requirement | Today |
| --- | --- | --- |
| G11 | Master positioning "Connected technology for the way your business works." | `site.primaryMessage` = "Connected technology. Faster business." |
| G12 | Hero headline "We build digital products that make complex business operations simple." | "We design and build digital products that keep businesses moving." |
| G13 | Approved company description / mission / vision / values (§13) | Absent |
| G14 | Approved product positioning lines (§8.03) | Comply360 and AxloPOS carry different lines |
| G15 | Odoo / QuickBooks never presented as Axlo-owned (§4, §11, §26.7) | No Solutions content exists yet — **but** `content/products` currently lists **"QuickBooks connected"** as an AxloPOS signal. That is an unverified integration claim and must be confirmed or removed. |

### 7.3 Technical gaps

| # | Requirement | Today |
| --- | --- | --- |
| G16 | Unique metadata per route (§21) | `pageMetadata()` helper exists and is good; only one route uses it |
| G17 | Sitemap covering all routes | Returns 1 URL |
| G18 | `Article`, `Product`/`SoftwareApplication`, `BreadcrumbList` schema | `Organization`, `WebSite`, `SoftwareApplication`×2 (on the homepage) |
| G19 | Per-page OG imagery | One site-wide generated card |
| G20 | Content-provider abstraction for Insights (§15) | No content layer beyond 3 typed modules |
| G21 | 360×800 test viewport (§25) | `RESOLUTIONS` covers 12 sizes but **not 360×800** |
| G22 | Multi-route test sweep | All 5 specs assert against `/` only |

### 7.4 Defects found

| # | Defect | Impact |
| --- | --- | --- |
| **D-a** | `components/layout/LegalPage.tsx:5` imports `@/app/legal.module.css` — **file does not exist** | Build fails the moment any route imports `LegalPage`. Blocks §17. |
| **D-b** | `app/not-found.tsx:44` builds hrefs as `` `/${item.href}` `` → `/#services` | Every 404 link becomes wrong once sections become routes. |
| **D-c** | `README.md` describes a 13-page site with GSAP, React Three Fiber and Radix accordion/toast/tooltip — **none of which exist** | Misleads any new engineer. Must be rewritten. |
| **D-d** | `public/hero/axlo-hero-image.jpg` is a 7680×4320 / 2.63 MB master for a ≤1560px slot | Build-time re-encode cost; LCP risk. |
| **D-e** | Orphans: `motion/StageRail.tsx`, `data-visualization/Diagrams.tsx` (+ CSS), `lib/motion.ts`, `public/hero/hero-operations.jpg`, `public/og/axlo-default.svg` | Dead surface. Flagged, not deleted. |
| **D-f** | `PageHero` hard-codes `id="page-title"`; `Breadcrumbs` puts `display:contents` on `<ol>`/`<li>` | Duplicate-id risk; list semantics dropped in some AT. |

---

## 8. Proposed revised sitemap

29 routes. Mirrors §6 exactly — no additions, no duplicate-purpose pages.

```
/                                     Home — 7 bands (§8)
/what-we-do                           Service architecture — 5 groups (§9)
/products                             Owned-product overview (4)
  /products/comply360
  /products/axlo-payroll
  /products/axlo-budget
  /products/axlopos                   + external cross-link to axlopos.com
/solutions                            Platform & engineering overview (6)
  /solutions/odoo
  /solutions/quickbooks
  /solutions/erp-business-systems
  /solutions/ai-automation
  /solutions/system-integration
  /solutions/custom-software
/industries                           Overview (6)
  /industries/[slug]                  retail · manufacturing · distribution ·
                                      restaurants-hospitality · professional-services ·
                                      finance-accounting
/why-axlo                             6 principles + proof framework
/about                                Company, mission, vision, values, philosophy, leadership
/case-studies                         Index — renders published entries only
  /case-studies/[slug]
/insights                             Index + category filter + tags
  /insights/[slug]
/contact                              "Talk to Axlo" — the one conversion endpoint
/privacy  /terms  /cookies            Legal — launch dependency
404                                   Rebuilt for multi-page
/sitemap.xml  /robots.txt             Generated from the route + content registry
```

**Empty-state policy.** `/case-studies` has no approved entries. It is generated from the content registry and
renders **only published** items. Until one exists it must either be excluded from the sitemap and nav, or ship
a genuine "what a case study will contain" page — never fabricated project cards. See Decision **D6**.

---

## 9. Homepage migration plan

Current 5 bands → target 7 bands. Nothing is discarded; two merges reduce length while adding two new layers.

| # | Target band (§8) | Source | Action |
| --- | --- | --- | --- |
| 01 | **Hero** | `Hero` | **Refine.** New eyebrow (unchanged string), new headline, new supporting copy. **CTA order flips**: primary → *Explore Our Products* → `/products`; secondary → *Talk to Axlo* → `/contact`. Flow concept re-narrated as **People → Data → Systems → AI → Decisions → Business**. Keep composition, `HeroDepth`, CSS entrance. |
| 02 | **Business Problem + What We Do** | `ServicesSection` | **Merge + extend.** New heading *"Your business is connected. Your systems should be too."*; add the connected-consequence chain and the **Fragmented → Connected** before/after visual; 3 pillars → **4** (Brand & Growth first). Links to `/what-we-do`. No long service lists. |
| 03 | **Products** | `ProductsSection` + `ProductShowcase` | **Restructure.** Two tall alternating panels → **four compact cards** with weighted prominence: Comply360 + AxloPOS lead (real interface art exists), Payroll + Budget follow with clearly-labelled conceptual visuals. Card = name · positioning line · short description · visual · product-page CTA. `ProductShowcase` **moves to the product pages**. |
| 04 | **Solutions** | *new* | **Add.** 6 platform/engineering entries, visually distinct from Products — different surface tone, different card geometry, implementation-verb language, no Axlo product badging. |
| 05 | **Why Axlo + Proof** | `TrustSection` | **Merge.** 6 principles + a proof rail. Proof renders **only** approved logos/testimonials/metrics/case studies; with none approved, the component and content model ship and the public rail renders nothing (dev-only placeholders via `PlaceholderNote`). Links to `/why-axlo` and `/case-studies`. |
| 06 | **How We Work** | `BrandProposition` | **Preserve.** Ribbon, stage figures and entrance sequence unchanged; copy set to the §8.06 wording. |
| 07 | **Final CTA** | `FinalCta` | **Refine.** *"Have a complex business problem? Let's make it flow."* → `/contact`. Removes the `mailto:` conversion path. |
| 08 | **Footer** | `Footer` | **Extend.** Brand line, primary nav, product links, solution links, contact, Privacy, Terms, Cookie Policy, copyright, motion control. **No social links** (`site.social` stays empty by policy). |

**Net effect:** two new layers (Solutions, Proof) added while the page gets *shorter*, because Problem+Capabilities
merge into one band and Products drops from two full-height panels to one compact grid.

---

## 10. Proposed component architecture

```
components/
├── accessibility/    SkipLink ✔
├── foundations/      Button ✔  Logo ✔  Primitives ✔
│                     + Card              shared surface for product/solution/industry/insight cards
│                     + Badge             owned-product vs implemented-platform marker (icon + text, never colour alone)
├── layout/           Layout ✔  SectionHeader ✔  ThemeProvider ✔  MotionToggle ✔
│                     PageHero ⟳ (fix id + list semantics)   LegalPage ⟳ (author missing stylesheet)
│                     + Breadcrumbs        promoted out of PageHero, emits BreadcrumbList JSON-LD
│                     + ContentSection     the repeated "heading + body + list" block on template pages
├── motion/           Reveal ✔  FlowLine ✔  HeroDepth ✔  CursorAffordance ✔    StageRail ✘
├── navigation/       Header ⟳  MobileMenu ⟳  Footer ⟳  ProductLink ✔  FooterControls ✔  FooterEmail ✔
│                     SectionLink → RouteLink ⟳       SectionCta → RouteCta ⟳
│                     + NavDisclosure      accessible Products/Solutions menu (button + aria-expanded)
│                     + TalkToAxloCta      the one primary CTA, worded once
├── product-demo/     AppFrame ✔  Comply360Interface ✔  AxloPosInterface ✔  ProductMediaCarousel ✔
│                     + PayrollInterface   conceptual, "Illustrative Example"-labelled
│                     + BudgetInterface    conceptual, "Illustrative Example"-labelled
├── sections/         Hero ⟳  ServicesSection ⟳  ProductsSection ⟳  BrandProposition ✔
│                     ProcessDiagrams ✔  FinalCta ⟳  StartHereIcon ✔  ProductShowcase → product pages
│                     TrustSection → merged into WhyAxloSection
│                     + SolutionsSection   homepage band 04
│                     + WhyAxloSection     homepage band 05 (principles + proof rail)
│                     + ConnectedSystems   the Fragmented → Connected before/after visual
├── templates/        + ProductPage  + SolutionPage  + IndustryPage  + CaseStudyPage  + InsightArticle
│                     one data-driven template per family (§6)
├── proof/            + ProofRail  + LogoWall  + Testimonial  + MetricStat  + LeadershipGrid
│                     every one renders nothing unless its entry is approved+published
├── forms/            + Field  + TextInput  + TextArea  + Select  + Checkbox
│                     + FormError  + ErrorSummary  + ContactForm
├── data-visualization/  Charts ✔ (dormant)      Diagrams ✘
└── seo/              + JsonLd    single typed emitter for every schema
```

`✔ keep · ⟳ refactor · ✘ retire`

**Server/Client boundary.** Everything above is a Server Component unless it needs state. Client islands stay
limited to: `Header`/`MobileMenu`/`NavDisclosure`, `ProductMediaCarousel`, `Reveal*`, `HeroDepth`,
`CursorAffordance`, `MotionToggle`/`ThemeProvider`, `ContactForm`, and the Insights filter.

---

## 11. Proposed content architecture

Typed modules under `content/`, read through thin providers in `lib/content/` so a CMS can be swapped in later
without touching layout code (§15, §23).

```
content/
├── site.ts           positioning, nav, footer, CTA vocabulary  (replaces lib/site.ts single-page model)
├── services/         5 groups (Brand & Growth · Strategy · Experience · Technology & AI · Operations)
│                     each: problem · approach · deliverables · value · relatedProducts · relatedSolutions
├── products/         4 entries — extended shape (see below)
├── solutions/        6 entries — extended shape (see below)
├── industries/       6 entries: problems · products · solutions · workflows · integrations
├── why-axlo/         6 principles
├── company/          description · mission · vision · values · philosophy + brandStages ✔
├── leadership/       model only — renders nothing until approved
├── case-studies/     model only — renders published entries only
└── insights/         articles + categories + tags, behind lib/content/insights.ts
```

**Product shape** (§23, extended for content-integrity):
```ts
slug · name · positioning · description · audience · featureGroups[] · coreWorkflows[]
screenshots[]        // local assets or composed-interface ids
internalUrl · externalUrl
availability         // 'in-development' | 'available' — never asserted without approval
demoData: boolean    // drives the visible "Demo Data" / "Illustrative Example" label
integrations[]       // only confirmed entries render
seo · publicationStatus
```

**Solution shape:**
```ts
slug · name · positioning · description · capabilities[] · implementationSteps[]
industries[] · relatedProducts[] · seo · publicationStatus
+ vendorRelationship: 'implemented-by-axlo'   // structural guarantee against §26.7
```

That last field is deliberate: **no solution entry can be rendered with Axlo product badging**, because the
template branches on it. Ownership language is enforced by the type system, not by copy review.

**Content-integrity rules carried forward from the current codebase** (already enforced by `tests/content.spec.ts`):
no client counts, no outcome percentages, no "trusted by" / "award-winning" / "industry-leading", no
`aggregateRating` / `review` / `offers` in structured data. These regexes get extended, not replaced.

---

## 12. Accessibility risks (WCAG 2.2 AA)

| Risk | Why | Mitigation |
| --- | --- | --- |
| **A1 · Nav overflow at 1024–1280** | 7 links + CTA + logo in Sora/Inter will not fit 1024px comfortably | Raise the drawer breakpoint to **1280px**; Products/Solutions become `NavDisclosure` menus. Decision **D2**. |
| **A2 · `aria-current` value** | Route nav needs `"page"`, code emits `"true"` | Fix in `Header`, `MobileMenu`, `Breadcrumbs`; update the assertion in `tests/navigation.spec.ts`. |
| **A3 · Disclosure menus** | New pattern — the riskiest a11y addition in the project | Button + `aria-expanded` + `aria-controls`, Escape closes and restores focus, arrow-key roving, hover **never** the only way in. |
| **A4 · Mobile drawer focus return** | §7 requires focus to **return to the trigger**; current code deliberately sends it to the destination *section* | With routes, the destination is a new document — Radix's default (restore to trigger) becomes correct. Simplification, not a new risk. |
| **A5 · Form accessibility** | Entirely new surface | Real `<label>`s, `aria-describedby` hints, `aria-invalid`, inline errors, an `ErrorSummary` that takes focus on submit failure, `role="status"` success. Never colour-only. |
| **A6 · Heading hierarchy across 29 routes** | One H1 per page, no skipped levels | `PageHero` owns the single H1 on every secondary route; template sections start at H2. Extend the existing heading test to sweep all routes. |
| **A7 · 44px targets in denser layouts** | 4-up product cards + 6-up solution cards + footer columns | Existing 44px test extends to every route. |
| **A8 · Breadcrumb list semantics** | `display:contents` on `<ol>`/`<li>` drops list role in some AT | Rebuild with flex on the `<ol>` and real `<li>`s. |
| **A9 · Duplicate `id="page-title"`** | Hard-coded in `PageHero` | Generate via `useId()` or accept an `id` prop. |
| **A10 · Text zoom to 200%** | Denser grids reflow worse | Add a 200%-zoom assertion to the responsive sweep. |

**Already satisfied, to be preserved:** skip link, focus ring (2px + 2px offset, both themes), Radix focus trap /
Escape / background inert / scroll lock, carousel that never moves focus, decorative graphics hidden from AT,
15px body-copy floor, three-layer reduced motion.

---

## 13. SEO and performance risks

### SEO
| Risk | Mitigation |
| --- | --- |
| **S1** · 28 new routes shipping with default metadata | `generateMetadata` on every route via the existing `pageMetadata()` helper; a test asserts unique title + description + canonical for **every** route in the registry. |
| **S2** · Sitemap returns 1 URL | Generate `app/sitemap.ts` from the same registry that generates the routes — it cannot drift. |
| **S3** · Thin content on 6 industry + 6 solution pages | Real depth per page; where the brief content is missing, publish fewer pages rather than thin ones. Any page below threshold gets `noindex` until filled. |
| **S4** · Homepage `SoftwareApplication` schema describes 2 of 4 products | Move `SoftwareApplication` to each product page where it belongs; homepage keeps `Organization` + `WebSite`. |
| **S5** · Structured-data overreach | `offers`, `aggregateRating`, `review` stay banned — already asserted in `tests/content.spec.ts`. |
| **S6** · One OG card for 29 routes | Per-family `opengraph-image.tsx` (product / solution / insight), reusing the existing generated-card approach. |
| **S7** · Odoo/QuickBooks pages ranking as vendor pages | Titles and H1s lead with the Axlo service verb ("Odoo ERP implementation and support"), never the bare vendor name. |

### Performance
| Risk | Mitigation |
| --- | --- |
| **P1** · Hero LCP from a 2.63 MB / 8K master | Downsample to ~2560px wide, quality ~80 progressive; keep `priority` + `fetchPriority="high"`. Only the master changes — no code edit. |
| **P2** · 4 composed product interfaces on the homepage | Homepage cards use a **static** visual; the interactive `ProductMediaCarousel` runs on product pages only. |
| **P3** · Client-component creep across 29 routes | Server Components by default; the client-island list in §10 is the budget. |
| **P4** · CLS on new image slots | Explicit dimensions or reserved aspect boxes everywhere; composed interfaces are already CLS-free. |
| **P5** · `motion` shipped for one header rail | The read-position rail is a single-page affordance — dropping it may remove `motion` from the client bundle entirely. Confirm at Phase 4. |
| **P6** · Third-party scripts | None installed. `lib/analytics.ts` stays a dependency-free `window.dataLayer` seam. |

---

## 14. Missing client content and assets

Grouped by whether it **blocks a route**, **blocks a section**, or **blocks launch**.

### 🔴 Blocks launch
| # | Item | Note |
| --- | --- | --- |
| M1 | **The developer brief `.docx`** | Not on this machine. The deep product content depends on it. |
| M2 | **Privacy Policy, Terms of Service, Cookie Policy** | Professionally drafted and approved. Generated text is not approved text (§17). |
| M3 | **Contact delivery provider** | Email or CRM destination + credentials, or explicit approval to ship the adapter with no live provider. |

### 🟠 Blocks a route
| # | Item |
| --- | --- |
| M4 | **Axlo Payroll** — positioning detail, audience, workflows, feature groups, availability status |
| M5 | **Axlo Budget** — same |
| M6 | **Comply360** — feature groups, core workflows, confirmed integrations, security notes, availability status |
| M7 | **AxloPOS** — feature groups, confirmed integrations (**incl. whether the current "QuickBooks connected" claim is verified**), security notes |
| M8 | **Odoo / QuickBooks engagement scope** — exactly which of consulting / implementation / configuration / integration / migration / training / optimisation / support Axlo delivers today |
| M9 | **Industry content** ×6 — real problems, workflows and integration needs per sector |
| M10 | **Leadership** — names, roles, bios, photographs. *None will be invented (§13).* |
| M11 | **Insights** — at least 3–5 real articles, or approval to launch `/insights` empty |

### 🟡 Blocks a section
| # | Item |
| --- | --- |
| M12 | Approved customer logos |
| M13 | Approved testimonials with attribution |
| M14 | Verified metrics |
| M15 | Published case studies (currently **zero**) |
| M16 | Real product screenshots for Payroll and Budget — or approval for conceptual visuals (**recommended**, Decision **D3**) |
| M17 | Partnership / certification status for Odoo and QuickBooks — **assumed none until confirmed** (§11) |
| M18 | Contact details beyond `hello@axlodigital.com`: phone, address, business hours |
| M19 | Verified social profile URLs (`site.social` stays empty until supplied) |
| M20 | The **Fragmented → Connected** before/after illustration, if a designed asset is preferred over a built SVG |

---

## 15. Technical risks and decisions requiring approval

Seven items where a different answer changes the build. **These are the questions to answer at this checkpoint.**

> **D1 · CTA wording conflict.**
> §7 and acceptance criterion #26.10 require the primary CTA to be **"Talk to Axlo"** consistently. But §8.07
> specifies the homepage closing CTA as **"Start the conversation"**. That reintroduces exactly the
> two-labels-for-one-action problem the previous pass removed — `tests/content.spec.ts` currently *asserts*
> single-label consistency.
> **Recommendation:** "Talk to Axlo" everywhere (header, mobile drawer, product pages, solution pages, footer);
> allow **"Start the conversation"** as the one authored exception in the homepage closing band, since §8.07
> states it verbatim. Both resolve to `/contact`. The consistency test is scoped to the global CTA.
> *Alternative:* "Talk to Axlo" literally everywhere, overriding §8.07's copy.

> **D2 · Navigation density.**
> 7 nav items + CTA + logo does not fit 1024px.
> **Recommendation:** drawer below **1280px** (up from 1024px); Products and Solutions become accessible
> disclosure menus on desktop. *Alternative:* keep 1024px and drop two items from the top level.

> **D3 · Product visuals.**
> §8 says "use the existing real AxloPOS screenshots" — **none exist**. What exists is a composed DOM interface
> that outperforms a screenshot on readability, zoom, CLS, theming and accessibility.
> **Recommendation:** keep composed interfaces for all four products; label Payroll and Budget as
> *Illustrative Example* and Comply360/AxloPOS states as *Demo Data*, using the existing `AppFrame` chip.
> Supply real screenshots later and they drop into the same slots. *Alternative:* capture real screenshots from
> the live AxloPOS product for that page only.

> **D4 · Contact form dependencies.**
> **Recommendation — no new dependencies.** Hand-rolled validators in `lib/validation.ts` (one form shape),
> a Next.js Server Action, a provider-independent `ContactAdapter` interface with a logging no-op implementation,
> and provider-free spam protection: honeypot + submission-timing floor + in-memory IP rate limit, with
> documented env vars. *Alternative:* add `zod` (server-only, ~14 KB, does not reach the client bundle) — needs
> approval per §1.

> **D5 · Light theme.**
> `styles/light-theme.css` is fully authored but **not imported**; the site is dark-only by decision, and
> `ThemeProvider`/`FooterControls` say so explicitly. §18 lists "existing light and dark themes"; §8.08 says
> "theme control **where currently supported**" — which today means motion only.
> **Recommendation:** stay dark-only through Phases 1–4; re-evaluate in Phase 5. Re-enabling means auditing
> contrast across 29 routes and widening `Section`'s `theme` prop — real work, no conversion benefit.

> **D6 · Empty case studies.**
> Zero approved case studies (§14 forbids invented ones).
> **Recommendation:** build the framework; **omit `/case-studies` from nav and sitemap** until one entry is
> published. Homepage proof rail renders nothing rather than "coming soon" cards (§8.05 forbids those as final
> content). *Alternative:* ship the route with a genuine methodology page.

> **D7 · Insights content layer.**
> §15 forbids installing a CMS without approval.
> **Recommendation:** typed local content modules behind `lib/content/insights.ts`, with the provider interface
> documented so MDX or a headless CMS is a drop-in later. No dependency. *Alternative:* add `@next/mdx` now
> (needs approval).

**Non-decision risks, mitigated in the plan:** the hero-headline line-break test (§9 band 01 changes the string
that `tests/responsive.spec.ts` asserts renders as exactly 2 lines — the authored break must be re-derived and
the test updated); the `LegalPage` broken import (**D-a**, fixed in Phase 2); the 404 hrefs (**D-b**, Phase 1);
the stale README (**D-c**, Phase 4).

---

## 16. Phased implementation plan

Each phase ends at a review gate. Nothing is committed, pushed or merged without instruction.

### Phase 0 — Audit and plan ✅ *this document*
Repository inspected · gaps identified · risks and decisions surfaced · **stopping for approval.**

### Phase 1 — Architecture and homepage
Route scaffold for all 29 paths · replace hash navigation with route navigation (`RouteLink`, `RouteCta`,
`usePathname()`, `aria-current="page"`) · rebuild `Header` with `NavDisclosure` + 1280px drawer breakpoint ·
rewire `MobileMenu` · rebuild `Footer` to §8.08 · establish `content/` models and `lib/content/` providers ·
migrate the homepage to the 7-band structure (Hero, Problem+What We Do, compact Products, Solutions,
Why Axlo + Proof, How We Work, Final CTA) · fix the 404 · downsample the hero master.
**→ Review gate.**

### Phase 2 — Core corporate pages
What We Do (5 groups) · Products overview + 4 product pages from one template · Solutions overview + 6 solution
pages from one template · Why Axlo · About · Contact (form, server action, validation, spam protection,
rate limit, adapter) · legal route structures + the missing `legal.module.css`.
**→ Review gate.**

### Phase 3 — Supporting content
Industries overview + template ×6 · case-study framework (publication-gated) · Insights index, article template,
category filter, tags · leadership content model (renders nothing unapproved) · proof components ·
`Breadcrumbs` on every deeper route.
**→ Review gate.**

### Phase 4 — SEO, analytics, security, performance
Per-route metadata + canonicals · `Organization` / `SoftwareApplication` / `Article` / `BreadcrumbList` JSON-LD ·
registry-driven sitemap + robots · per-family OG imagery · analytics event layer extension · consent controls
*if and only if* a script is added · contact-form hardening · performance audit (LCP / INP / CLS) ·
full accessibility audit · README rewrite.
**→ Review gate.**

### Phase 5 — Advanced motion and final polish
Product interactions · refined route transitions · motion performance · reduced-motion regression pass ·
cross-device visual QA. **Not started before content architecture and conversion flows are approved.**

---

## 17. Files expected to be added, modified, or removed

### Added (~95 files)

**Routes** — `app/{what-we-do,products,solutions,industries,why-axlo,about,case-studies,insights,contact,privacy,terms,cookies}/page.tsx`,
`app/products/[slug]/`, `app/solutions/[slug]/`, `app/industries/[slug]/`, `app/case-studies/[slug]/`,
`app/insights/[slug]/`, per-family `opengraph-image.tsx`, `app/legal.module.css` *(fixes **D-a**)*.

**Content** — `content/site.ts`, `content/services/`, `content/solutions/`, `content/industries/`,
`content/why-axlo/`, `content/leadership/`, `content/case-studies/`, `content/insights/`;
`content/products/` extended from 2 to 4 entries with the extended shape.

**Lib** — `lib/content/{products,solutions,industries,insights,case-studies}.ts` (provider abstraction),
`lib/routes.ts` (the single registry driving nav, sitemap and metadata tests), `lib/validation.ts`,
`lib/contact-adapter.ts`, `lib/schema.ts`.

**Components** — `templates/` (5), `forms/` (8), `proof/` (5), `seo/JsonLd`, `navigation/{NavDisclosure,TalkToAxloCta,RouteLink,RouteCta}`,
`sections/{SolutionsSection,WhyAxloSection,ConnectedSystems}`, `foundations/{Card,Badge}`,
`layout/{Breadcrumbs,ContentSection}`, `product-demo/{PayrollInterface,BudgetInterface}` — each with its CSS module.

**Tests** — `tests/routes.spec.ts`, `tests/metadata.spec.ts`, `tests/contact-form.spec.ts`,
`tests/brand-integrity.spec.ts` (asserts Odoo/QuickBooks are never presented as owned), `tests/proof-empty.spec.ts`.

**Docs** — `docs/CONTENT-MODEL.md`, `docs/ENVIRONMENT.md`, `docs/CMS-MIGRATION.md`, `docs/LAUNCH-BLOCKERS.md`.

### Modified (~35 files)
`app/{page,layout,not-found,sitemap,robots}.tsx|ts` · `lib/{site,seo,scroll,analytics}.ts` ·
`components/navigation/{Header,MobileMenu,Footer,SectionLink,SectionCta}.tsx` + CSS ·
`components/sections/{Hero,ServicesSection,ProductsSection,ProductShowcase,TrustSection,FinalCta,BrandProposition}.tsx` + CSS ·
`components/layout/{PageHero,LegalPage,Layout}.tsx` *(fixes **D-f**)* · `components/product-demo/AppFrame.tsx` (label vocabulary) ·
`content/{products,services,company}/index.ts` · `styles/{globals,dark-theme,tokens}.css` ·
`tests/{navigation,content,responsive,accessibility,products}.spec.ts` · `tests/helpers.ts` (**add 360×800**) ·
`playwright.config.ts` · `README.md` *(fixes **D-c**)*.

### Removed (deletions only on approval, per §1)
`components/motion/StageRail.tsx` (+CSS usage) · `components/data-visualization/Diagrams.tsx` + `Diagrams.module.css` ·
`lib/motion.ts` — **all currently unreferenced**. Assets `public/hero/hero-operations.jpg` and
`public/og/axlo-default.svg` are **flagged as orphaned but retained**, per the instruction not to delete assets.

### Replaced (not deleted)
`public/hero/axlo-hero-image.jpg` — same filename, downsampled master *(fixes **D-d**)*. No code change.

---

## 18. Acceptance-criteria traceability (§26)

| # | Criterion | Where satisfied |
| --- | --- | --- |
| 1 | Premium Axlo identity recognisable | §4 tokens preserved verbatim; §6 motion preserved |
| 2 | Positioned as technology + digital products | §9 bands 01–04; §11 content models |
| 3 | Brand & Growth included without weakening enterprise positioning | §9 band 02 (4th pillar, first position); §11 `content/services` |
| 4 | Homepage concise | §9 — two merges; Products drops from 2 tall panels to 1 compact grid |
| 5 | Owned products separated from third-party solutions | §11 `vendorRelationship` field + distinct treatment in §9 band 04 |
| 6 | All four products represented | §9 band 03; §17 content extension |
| 7 | Odoo/QuickBooks never presented as owned | §11 type-level guarantee + `tests/brand-integrity.spec.ts` |
| 8 | No fake proof | §11 integrity rules; §15 **D6**; publication-gated rendering |
| 9 | Demo figures clearly labelled | `AppFrame` "Sample view" chip + `aria-label` suffix; §15 **D3** |
| 10 | Primary CTA consistently "Talk to Axlo" | §15 **D1** — *needs your decision* |
| 11 | Contact conversion works accessibly | §12 A5; Phase 2 |
| 12 | Legal identified as launch dependency | §14 M2; `docs/LAUNCH-BLOCKERS.md` |
| 13 | All primary routes have metadata | §13 S1 + `tests/metadata.spec.ts` |
| 14 | Responsive | §16 Phase 4; 13 viewports incl. new 360×800 |
| 15 | Keyboard navigation | §12 A3, A4 |
| 16 | Reduced motion | §6 — already three-layer, preserved |
| 17 | Screenshots readable | §15 **D3** — composed interfaces are resolution-independent |
| 18 | No unnecessary or duplicate pages | §8 — 29 routes, exactly the §6 tree |
| 19 | No production branch changed | Branch `feature/axlo-website-restructure`; `main` untouched |
| 20 | Nothing pushed or merged | No push, no merge, no commit |

---

## Status

**Phase 0 complete. Stopping for approval.**

To proceed, please confirm decisions **D1–D7** (§15) and supply the items in §14 — starting with **M1, the
developer brief `.docx`**, which is the single largest content dependency in this plan.
