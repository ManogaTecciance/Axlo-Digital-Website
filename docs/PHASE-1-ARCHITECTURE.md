# Phase 1 — Information Architecture, Design Direction & Motion Plan

**Axlo Digital** · axlodigital.com · _Connected technology. Faster business._

---

## 1. Positioning

Axlo Digital is presented as a **product, technology, design and engineering partner**, not a
marketing agency. Every structural decision reinforces three proof signals:

| Signal | How the site proves it |
| --- | --- |
| Product capability | AxloPOS gets a full product site, not a portfolio card |
| Engineering depth | Capability map, technical solution sections, engagement models |
| Design maturity | The site itself is the design system demo — tokens, states, motion, a11y |

Brand narrative spine: **The Connected Flow** — the diagonal from the Axlo mark enters in the
hero, threads every section boundary as a data path, becomes diagrams and interface connectors
mid-page, and resolves into the logo slash inside the final CTA.

---

## 2. Sitemap

```
/                          Home
/services                  Services overview
/services/[slug]           Individual service template  (6 services)
/work                      Case-study index (filterable)
/work/[slug]               Individual case-study template
/axlopos                   AxloPOS product site
/about                     About
/insights                  Insights index (filter + search)
/insights/[slug]           Article template
/contact                   Contact
/privacy                   Privacy policy
/terms                     Terms
/404                       Custom not-found
```

Service slugs: `product-strategy-ux`, `ui-ux-design-systems`, `web-mobile-engineering`,
`ai-business-automation`, `enterprise-software`, `product-support-evolution`.

Case-study categories: Digital Products · Enterprise Platforms · AI & Automation ·
Commerce & POS · Design Systems · Web Experiences.

**Content-placeholder policy.** No client names, metrics, testimonials, logos, awards, team
members or dates are invented. Where real content is required the UI renders a visible
`<PlaceholderNote>` — e.g. _"Verified outcome to be added"_ — which is also announced to
assistive technology. All placeholder strings live in `content/` so they are trivially
replaceable.

---

## 3. Homepage section rhythm

| # | Section | Theme | Flow-line role |
| --- | --- | --- | --- |
| 01 | Hero | Dark | Slash is born; 3D connected-operations engine |
| 02 | Brand proposition (Think → Design → Build → Evolve) | Light | Line becomes a 4-stage path |
| 03 | Capabilities (interactive service index) | Dark | Line becomes the active-item rail |
| 04 | Featured work | Light | Line becomes card connectors |
| 05 | AxloPOS showcase | Dark | Line becomes module wiring between UI panels |
| 06 | Connected capability map | Light | Line becomes the 8-stage journey graph |
| 07 | Why Axlo (5 value panels) | Dark | Line becomes small system diagrams |
| 08 | Process (01–07) | Light | Line becomes the timeline spine |
| 09 | Insights | Light | Line rests (editorial calm) |
| 10 | Final CTA | Dark | Line resolves into the Axlo slash |
| 11 | Footer | Dark | — |

Section-to-section transitions use a `<FlowConnector>` SVG that visually stitches the boundary,
so the alternating dark/light rhythm never reads as disconnected blocks.

---

## 4. Design direction

- **Dark-first, not dark-only.** Both themes are authored independently; dark is not an
  inversion. Section theme is declared per-section via `data-theme="dark|light"`, which flips the
  semantic token layer locally — the sticky header samples the section under it and re-tints.
- **Editorial, asymmetric.** 12-column desktop grid; hero and statement sections deliberately
  break to 7/5 and 5/7 splits. Generous vertical rhythm (`--space-*`, 4px base).
- **Restraint on effects.** No glassmorphism beyond one hero panel edge, no ambient particles,
  no permanent glow. The gradient appears only on the flow line, hero geometry, and at most one
  highlight per section.
- **Volt Lime budget: ≤5%** of any composition — reserved for "active/accelerating" states
  (current stage, selected filter, KPI delta) and never for large fills.
- **Contrast rule.** Dark text on Flow Aqua / Volt Lime surfaces, always. Enforced by giving
  those tokens a paired `--on-*` foreground token; no component picks a foreground by hand.

### Type

Sora (display) / Inter (everything else), loaded via `next/font` with `display: swap` and
preconnect. Fluid scale via `clamp()` in `styles/typography.css`, min body size 15px
(`--text-body-sm`). 14px (`--text-label`) and 13px (`--text-caption`) exist for tags,
eyebrows and product-UI captions only — never for running copy.

### Grid

4 / 8 / 12 columns at 360 / 768 / 1024. `--container-max` (1320px) is the width of the
*content column*: `.container` sets `max-width: calc(var(--container-max) + var(--gutter) * 2)`
so the page padding is never taken out of the measure. The gutter is stepped rather than
fluid — 20 / 24 / 36 / 48 / 56 / 72px at 0 / 480 / 768 / 1024 / 1280 / 1440 — as is the
section rhythm (`--section-padding-block`), so the vertical and horizontal beat is a
predictable figure per device class. Hero and visualization canvases may bleed to
`--container-wide` (1560px).

---

## 5. Component inventory

```
components/
├── foundations/     Button, IconButton, Link, Tag, Eyebrow, SectionHeading, Card,
│                    Surface, Divider, PlaceholderNote, VisuallyHidden, Skeleton
├── layout/          Container, Grid, Section, Stack, ThemeProvider, ThemeToggle
├── navigation/      Header, DesktopNav, MobileMenu, Footer, Breadcrumbs, PageTransition
├── motion/          FlowLine, FlowConnector, Reveal, TextMask, SlashMark, MotionConfig
├── sections/        Hero, BrandProposition, ServiceIndex, FeaturedWork, AxloPosShowcase,
│                    CapabilityMap, WhyAxlo, ProcessTimeline, InsightsTeaser, FinalCta
├── data-visualization/  FlowDiagram, NodeGraph, TimelineChart, BarChart, LineChart,
│                    DonutChart, KpiCard, ComparisonTable, ChartFrame (a11y summary + table)
├── case-studies/    CaseStudyCard, CaseStudyHero, CaseStudyFilters, CaseStudySection
├── product-demo/    PosPanelStack, PosModuleMap, PosScreen, StatusPulse
├── forms/           Field, TextInput, TextArea, Select, Checkbox, FormMessage, ContactForm
├── feedback/        Dialog, Toast, Tooltip, EmptyState, ErrorState, LoadingState
└── accessibility/   SkipLink, ReducedMotionProvider, ChartDescription, PauseControl
```

Every component ships default / hover / focus-visible / pressed / disabled states, loading and
error where relevant, both themes, responsive behaviour, and a11y notes in its story.

### Delivered against this plan

The inventory above is the plan. What shipped differs in a few places, deliberately:

- **Merged rather than separate.** `Breadcrumbs` lives in `layout/PageHero`; `DesktopNav` is part
  of `navigation/Header`; `IconButton`, `Card` and `Surface` did not earn their own components —
  the patterns are small enough that section CSS owns them.
- **Replaced.** `Reveal` is CSS + IntersectionObserver rather than a Motion wrapper (see §6), so
  `MotionConfig` is unnecessary. `PageTransition` was dropped: App Router navigations are fast
  enough that a transition would delay content for no comprehension gain.
- **Not built, and why.** `Testimonials` — we have no verified testimonials and will not invent
  them. Cookie-preference controls — no analytics or tracking cookies are set, so there is nothing
  to consent to; the control ships alongside the first script that needs it.
- **Data visualization** shipped as `Charts` (bar, line, donut, KPI, `ChartFrame`) and `Diagrams`
  (per-service and per-value system diagrams) plus `product-demo/PosModuleMap` for the connected
  node graph. `TimelineChart` and `ComparisonTable` are not yet needed by any page.

---

## 6. Motion plan

| Tier | Duration | Owner | Examples |
| --- | --- | --- | --- |
| Micro | 120–180ms | CSS | button press, link underline, tag select |
| Component | 180–240ms | Motion for React | tab/accordion swap, service panel change |
| Reveal | 400–700ms | CSS + IntersectionObserver | section entrance, staggered lists |
| Hero sequence | 900–1400ms | GSAP (the only timeline) | eyebrow → headline → copy → actions |
| Flow draw | on entry | CSS + IntersectionObserver | connector and stage-rail path draws |
| Ambient | 8–16s | CSS/R3F | node pulse, POS status ticks |

Easing token: `--ease-flow: cubic-bezier(0.22, 1, 0.36, 1)`.

Only GSAP timeline is the hero entrance. Motion for React owns component transitions (tab and
panel swaps). Scroll reveals are CSS-driven and progressively enhanced, so no content is ever
server-rendered at `opacity: 0`. React Three Fiber is used **only** for the hero. SVG owns every diagram.

**Reduced motion** is a first-class mode, not a disable switch: parallax, cursor response, camera
drift and looping motion are removed; path draws snap to their final state; reveals collapse to a
120ms opacity fade. All content and functionality remain. A `PauseControl` is offered for the
ambient hero loop regardless of preference.

**Prohibited:** scroll hijacking, motion behind body copy, text scrambling, cursor trails,
loading screens, animation that gates information.

---

## 7. Accessibility plan (WCAG 2.2 AA)

- Skip link, landmark regions, one `h1` per page, no skipped heading levels.
- Focus-visible ring: 2px `--color-focus` + 2px offset, high-contrast in both themes.
- Radix primitives supply dialog focus trapping/restoration, tabs roving focus, accordion semantics.
- Service index and capability map are **buttons + tab panels**, never hover-only; mobile falls
  back to accordions. Every diagram has a text alternative (`ChartDescription`) and a data table.
- No colour-only meaning: active states pair colour with a label, icon, weight or position change.
- Touch targets ≥44px for nav, CTAs, filters, form controls, toggles.
- Forms: real `<label>`s, descriptions via `aria-describedby`, `aria-invalid`, error summary with
  focus move, polite live region for success.

---

## 8. Performance strategy

One real-time 3D experience (hero). It is `next/dynamic`-imported with `ssr: false`, gated behind
a WebGL capability check + `prefers-reduced-motion`, and preceded by a static SVG poster that is
the mobile and no-WebGL experience. Server Components by default; `'use client'` only where
interaction demands it. Reserved aspect boxes for every media slot (no CLS). Animations pause via
`IntersectionObserver` when off-screen; DPR clamped and geometry reduced on low-power devices.

Targets: Lighthouse Perf 90+, A11y 95+, Best Practices 95+, SEO 95+.

---

## 9. SEO foundation

Per-route `generateMetadata`, canonical URLs, OG + Twitter cards, `sitemap.ts`, `robots.ts`, and
JSON-LD for Organization, WebSite, Service, Article, SoftwareApplication (AxloPOS), and
BreadcrumbList. Descriptive slugs, semantic structure, alt text on every meaningful image.

---

## 10. Build order

1. ✅ Architecture, direction, inventory, motion plan _(this document)_
2. Tokens, themes, typography, grid, primitives
3. Homepage, responsive + reduced motion
4. Secondary templates
5. Hero 3D, POS demo, scroll timelines
6. A11y / responsive / SEO / performance audit
