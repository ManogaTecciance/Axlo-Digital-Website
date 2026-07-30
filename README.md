# Axlo Digital — website

_Connected technology. Faster business._

Production frontend for [axlodigital.com](https://www.axlodigital.com): a Next.js App Router
site built on the **Axlo Flow design system**, with an authored dark and light theme, a
reduced-motion mode, and a connected-flow motion concept that runs from the hero to the final CTA.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
npm run typecheck
```

Requires Node 18.18+ (developed on Node 24).

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | CSS Modules + CSS custom properties (**no Tailwind**) |
| Component transitions | Motion for React (`motion`) |
| Complex timelines | GSAP — exactly one timeline, the hero entrance |
| 3D | React Three Fiber — the hero scene only |
| Diagrams | SVG, hand-authored |
| Primitives | Radix UI — dialog, accordion, toast, tooltip |

One library per animation responsibility. Nothing overlaps.

---

## Project structure

```
app/                      Routes (13 pages + API route + sitemap/robots)
├── page.tsx              Homepage — 11 sections
├── services/[slug]/      Reusable service template
├── work/[slug]/          Reusable case-study template (16 sections)
├── axlopos/              AxloPOS product site
├── insights/[slug]/      Article template
├── contact/              Contact form
├── privacy/ terms/       Legal
└── not-found.tsx         Custom 404

components/
├── foundations/          Button, Logo, Tag, Eyebrow, SectionHeading, Placeholder…
├── layout/               Container, Section, Grid, PageHero, ThemeProvider, ThemeToggle
├── navigation/           Header, MobileMenu, Footer
├── sections/             The eleven homepage sections
├── motion/               FlowLine, StageRail, Reveal, HeroSequence, CursorAffordance
├── data-visualization/   Charts, ChartFrame, Diagrams
├── case-studies/         Cards, previews, filterable index
├── product-demo/         AxloPOS screens and module map
├── insights/             Article cards and index
├── forms/                Field primitives + ContactForm
├── feedback/             Dialog, Toast, Tooltip, Empty/Error/Loading states
└── accessibility/        SkipLink

content/                  All copy, as typed modules
├── services/  work/  insights/  company/  axlopos/

styles/
├── tokens.css            Primitive tokens (raw brand values)
├── light-theme.css       Semantic tokens — light
├── dark-theme.css        Semantic tokens — dark (authored, not inverted)
├── typography.css        Fluid scale
├── motion.css            Keyframes + reduced-motion rules
└── globals.css           Reset, focus, helpers

docs/PHASE-1-ARCHITECTURE.md   IA, design direction, component inventory, motion plan
```

---

## Design system

**Two token layers.** `styles/tokens.css` holds raw brand values. The theme files map those to
semantics — `--color-surface`, `--color-action`, `--color-on-accent`. **Components consume only
semantics.** That rule is what makes both themes work without forking a component, and it is the
first thing to check in review.

Foreground pairing is a token, not a per-usage decision: `--color-on-accent` and
`--color-on-highlight` resolve to dark ink, so white text can never land on Flow Aqua or Volt Lime.

**Section-local themes.** Any `<Section theme="dark|light">` flips the semantic layer for its
subtree, which is how the page alternates bands. The sticky header samples the section beneath it
and re-tints to match.

**The gradient** (`--gradient-flow`) is reserved for the Axlo diagonal, brand paths, hero geometry
and one highlight per section. Never body text, form fields, standard navigation, every button, or
error states. Volt Lime is budgeted at roughly 5% of any composition.

---

## Themes

Three states — light, dark, follow the system — exposed as a radiogroup so "system" is directly
selectable rather than hidden behind a two-way switch. The preference persists in
`localStorage` and is applied by a small inline script before first paint, so a stored dark
preference never flashes light.

---

## Motion

| Tier | Duration | Owner |
| --- | --- | --- |
| Micro | 150ms | CSS |
| Component | 220ms | Motion for React |
| Reveal | 560ms | CSS + IntersectionObserver |
| Hero sequence | ~1200ms | GSAP (one timeline) |
| Ambient | 8–16s | CSS / R3F |

Easing is a single token: `cubic-bezier(0.22, 1, 0.36, 1)`.

Scroll reveals are deliberately **not** a Motion `initial` variant: that would
serialise `opacity: 0` into the server HTML and hide content from anyone whose
JavaScript never runs. Instead elements render visible, and only those still
below the fold after hydration are hidden and revealed by an
IntersectionObserver — so nothing flashes and nothing is ever lost.

**Reduced motion is a designed mode, not a kill switch.** With `prefers-reduced-motion: reduce`
or the in-page **Reduce motion** control (footer and mobile menu): parallax and pointer response
are removed, path draws snap to their final state, loops stop, the 3D hero is replaced by its SVG
poster, and reveals collapse to a 120ms opacity fade. All content and functionality remain.

The hero also carries a **pause control** for its ambient loop regardless of preference.

---

## The hero

`components/sections/HeroVisual.tsx` decides what to render. The R3F scene mounts only when the
viewport is tablet-plus, WebGL is available, motion is not reduced, and the visual is on screen.
In every other case — including first paint and no-JS — the SVG poster (`HeroPoster.tsx`) renders
instead. The poster is a real drawing of the idea, not a loading shim, so nothing is lost when the
scene never mounts. Space is reserved by aspect ratio, so there is no layout shift either way.
Geometry, packet count and DPR are reduced on low-power devices.

---

## Accessibility

Target: **WCAG 2.2 AA**.

- Skip link, landmarks, one `h1` per page, no skipped heading levels.
- Focus ring: 2px `--color-focus` at 2px offset, contrast-checked in both themes.
- The service index and capability map are tablists (click + arrow keys + focus), falling back to
  accordions below 1024px. **Nothing is hidden behind hover.**
- Every diagram is either decorative-and-hidden with the meaning in adjacent copy, or given a
  role, label and text alternative. Charts ship a written summary and a real data table.
- No colour-only meaning anywhere: active and status states pair colour with a label, icon,
  weight or position.
- Forms use real labels, `aria-describedby` for descriptions and errors, `aria-invalid`, an error
  summary that takes focus on failed submit, and a polite live region for success.
- Touch targets ≥44px on all major controls.
- The custom cursor is **additive** — the system cursor is never hidden — and it is disabled on
  coarse pointers and under reduced motion.

### Manual checks before release

```
□ Tab the whole page: focus always visible, order matches reading order
□ Operate the service index and capability map by keyboard alone
□ Open and close the mobile menu by keyboard — focus returns to the trigger
□ Submit the contact form empty — the error summary takes focus
□ Zoom text to 200% — no clipping, no horizontal page scroll
□ Toggle reduced motion — content and functionality unchanged
□ Toggle light/dark — hierarchy and contrast hold in both
□ Disable JavaScript — content, navigation and links still work
```

---

## Performance

- One real-time 3D experience, dynamically imported with `ssr: false`, behind a capability check.
- Server Components by default; `'use client'` only where interaction requires it.
- Aspect-ratio boxes reserve space for every media slot — no CLS.
- Animations pause off-screen via `IntersectionObserver`; the canvas drops to `frameloop="demand"`
  when paused.
- Fonts via `next/font` with `display: swap`.

Targets: Lighthouse Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+.

---

## SEO

Per-route `generateMetadata`, canonical URLs, Open Graph and Twitter cards, `app/sitemap.ts`,
`app/robots.ts`, and JSON-LD for Organization, WebSite, Service, Article, SoftwareApplication and
BreadcrumbList.

---

## Content policy — read before editing copy

**Nothing is invented.** No client names, logos, testimonials, awards, partnerships, business
metrics, certifications, office locations, team members or project outcomes appear anywhere unless
they have been supplied and verified.

Where information is missing, the UI renders a visible `<PlaceholderNote>` — for example
_"Verified outcome to be added"_ — which is also exposed to assistive technology. Case studies
carry `contentStatus: 'placeholder'` and render a notice while that flag is set.

### Replacing placeholder content

1. **Case studies** — `content/work/index.ts`. Replace `client`, fill `detail.outcomes` with
   verified results, then set `contentStatus: 'verified'`. The notice disappears automatically.
2. **Articles** — `content/insights/index.ts`. Add author and date fields alongside
   `bylineStatus`, then update `ArticleCard` and the article template to render them.
3. **Social links** — `lib/site.ts`, `site.social`. The footer renders the section only when the
   array is non-empty; the placeholder notice disappears at the same time.
4. **Team** — `app/about/page.tsx`, the "Team" block.
5. **Legal** — `app/privacy/page.tsx` and `app/terms/page.tsx` carry `pending` notes on every
   section awaiting legal review.
6. **AxloPOS integrations** — `content/axlopos/index.ts`. Modules with `status: 'to-confirm'`
   render an integration disclaimer. Remove the flag only once the integration is confirmed.

Search for `PlaceholderNote`, `placeholder` and `to-confirm` to find every one.

---

## Contact form

Client-side validation drives feedback; `app/api/contact/route.ts` re-validates server-side
because the client checks are not trustworthy. Spam prevention avoids CAPTCHA (itself an
accessibility barrier) in favour of a hidden honeypot, a minimum time-to-submit gate, and
server-side validation.

**Delivery is not wired up.** The route acknowledges receipt without side effects. Connect a
transactional email provider or CRM at the `TODO(integration)` marker, and add rate limiting at
the edge before launch.

---

## Storybook

Storybook packages are installed on demand rather than shipped as app dependencies:

```bash
npx storybook@latest init --builder webpack5
npm run storybook
```

`.storybook/main.ts`, `.storybook/preview.tsx` and the stories in `stories/` are already written.
The preview adds a **Theme** toolbar with a `Both` option that renders each story in light and
dark side by side, plus the a11y addon.

After installing, remove `"stories"` and `".storybook"` from `exclude` in `tsconfig.json` so the
stories typecheck with the rest of the app.

---

## Conventions

- Components consume semantic tokens only — never `--flow-aqua` and friends directly.
- Every interactive component defines default, hover, focus-visible, pressed and disabled.
- Copy lives in `content/`, not in components, so it can be replaced without touching JSX.
- Prefer a Server Component. Add `'use client'` only when state, effects or event handlers demand it.
- New motion belongs to the tier that already owns that responsibility. Do not add a third
  animation library.
