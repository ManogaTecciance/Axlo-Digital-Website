# Website premium refinement — audit and plan

**Branch:** `feature/website-premium-refinement`
**Base:** `main` @ `341859d` (Initial commit)
**Scope:** refine the existing single-page site. No redesign, no new visual direction.

---

## 1. What the current build gets right

These are load-bearing decisions. None of them should be undone by this pass.

| Area | Why it works |
| --- | --- |
| Token layer | `styles/tokens.css` holds raw brand values; components only ever read the semantic layer (`--color-*`). The dark theme in `dark-theme.css` is authored, not an inversion. |
| Reveal contract | `components/motion/Reveal.tsx` renders content **visible** on the server and only hides what it has confirmed is below the fold and can reveal again. No-JS visitors never lose content. |
| Scroll spy | One `IntersectionObserver` over five section ids (`lib/scroll.ts`) — no scroll listeners, no layout thrash. |
| Reduced motion | Honoured at three levels: OS media query, an in-page toggle (`data-motion="reduced"` on `<html>`), and per-component hooks. |
| Progressive enhancement | Every navigation item is a real `#hash` anchor; JS only upgrades the scroll. |
| Mobile drawer | Radix Dialog supplies focus trap + Escape, and `onCloseAutoFocus` hands focus to the *destination section* rather than back to the trigger. |
| Comply360 visual | Already a composed DOM interface with container queries, exposed as a single `role="img"`. |

## 2. Problems found

### UX / storytelling
1. **AxloPOS is visibly weaker than Comply360.** Its two PNGs (`axlopos-owner-dashboard.png`, `axlopos-checkout-cart.png`) are branded placeholders — an empty frame with a teal header bar — documented as such in their own README. Comply360 renders a real composed dashboard. The two products do not read as equals.
2. **Neither product states business value.** Both give *what it is* and *three capabilities*. Neither says who it serves or what problem it removes.
3. **CTA language is inconsistent.** Header says "Start a Project", hero says "Start a project", the closing section says "Start a conversation". Three labels for one action.
4. **No trust layer.** Nothing on the page grounds the claims in real operational territory.
5. **Final CTA is diluted** by a three-item "I'd like to" pill row competing with the primary action.
6. **Footer is two columns** and omits the products entirely.

### Typography
7. Service descriptions run four capability tags each — past the point of scanning.
8. Muted text is `--ink-400` `#8C9AA7`; the approved dark hierarchy specifies `#9AA8B3`.
9. Semantic status colours in `dark-theme.css` (`#4ade80`, `#fbbf24`, `#ff8a8a`, aqua for info) are ad-hoc and do not match the approved palette.
10. Hero headline ramp tops out at 76px but starts at 50px on a 1024 tablet — under the 48–58 band only by luck, not by design.

### Spacing
11. Section padding is 64 → 128px. The target rhythm is 64–80 mobile → 120–144 desktop, so every band is ~12% short at the top end.
12. `--space-7` (28px) does not exist, so `1.75rem` is hard-coded in `Hero.module.css` — the one arbitrary value in the system.

### Performance
13. `three`, `@react-three/fiber`, `@radix-ui/react-accordion`, `-tabs`, `-toast`, `-tooltip`, `-label` are declared dependencies with **zero imports** anywhere in `app/`, `components/`, `lib/`, `stories/`.
14. Both product screenshots are 2880×1360 PNGs decoded for a frame that is at most ~800 CSS px wide.
15. `gsap` is dynamically imported for the hero sequence — a whole animation library for one staggered fade that CSS already expresses elsewhere in the codebase.

### SEO
16. Title is `Axlo Digital — Connected technology. Faster business.`, not the approved string.
17. OG image is **SVG** (`/og/axlo-default.svg`). Most crawlers (Facebook, LinkedIn, X, Slack) will not render it.
18. No favicon, no apple-touch-icon.
19. No `SoftwareApplication` structured data for the two products.

### Accessibility
20. Footer email is a 176×20 hit area — under the 44px minimum. *(fixed in the previous pass; re-verify)*
21. `useWebGLSupport` / `useLowPowerDevice` hooks exist for a hero that no longer uses WebGL — dead API surface.

### Analytics
22. **No analytics platform is installed.** Per instruction, none will be added. A dependency-free event bridge is wired instead: it forwards to `window.dataLayer` if a tag manager is ever present and is a silent no-op otherwise.

## 3. A specification conflict, and how it is resolved

The brief asks for **all three** of these on the hero headline:

- desktop font size **68–76px**
- the two-line break `We design and build digital products` / `that keep businesses moving.`
- headline **max-width ≈ 900px**

They cannot co-exist. The longest authored line measures ≈ 17.8× the font size in Sora 600, so holding it on one line at 68px needs **≈1213px**, not 900px. At 900px the headline breaks into three uncontrolled lines and the stated layout is lost.

**Resolution:** honour the font sizes and the stated line breaks — the two things specified most explicitly — and let the measure be what they require (82rem cap, container-limited). The 900px figure is the one requirement dropped, and it is called out in the final report rather than silently ignored.

## 4. Components — reuse, refactor, add

**Reuse unchanged:** `Reveal` / `RevealGroup` / `RevealItem`, `Container` / `Section` / `Grid` / `Stack`, `Button`, `SectionCta`, `SectionLink`, `Logo`, `SkipLink`, `MobileMenu`, `ThemeProvider`, `MotionToggle`, `useScrollSpy`.

**Refactor:** `ProductsSection` (inline panel → `ProductShowcase` + `ProductCapabilityTag`), `Header` (extract `DesktopNavigation`), `AxloPosScreenshotCarousel` → generic `ProductMediaCarousel` driven by rendered states rather than image files.

**Add:** `AxloPosInterface` (3 composed states), `Comply360Interface` (3 composed states), `TrustSection`, `SectionHeader`, `lib/analytics.ts`, `app/icon.svg`, `app/apple-icon.png`, `app/opengraph-image.tsx`.

**Remove:** `HeroSequence` (gsap) → CSS-driven `Reveal`; unused deps; dead hooks.

## 5. Motion system

One language, four moves:

| Move | Where | Timing |
| --- | --- | --- |
| Fade + 16–20px rise | every section reveal | 400–650ms, `--ease-flow` |
| Line draw | services connector, process ribbon | 600–1100ms, once, on entry |
| Colour / weight transition | nav active state, capability hover, stage hover | 150–200ms |
| Cross-state slide | product carousel | 500–700ms, `cubic-bezier(0.22, 1, 0.36, 1)` |

Scale is capped at 1.02. No spin, no continuous parallax, no scroll hijacking. Every one collapses to a ≤120ms opacity change under reduced motion, and the carousel stops auto-rotating entirely.

## 6. Testing plan

Automated (`tests/`, Playwright + axe):
- axe WCAG 2.2 AA sweep at 1440 and 390, plus the mobile drawer open
- no horizontal overflow at all 12 target resolutions
- nav anchors resolve, hash syncs, `aria-current` tracks the active section, heading clears the sticky header
- drawer: focus trap, Escape, focus handed to the destination
- carousel: controls present, autoplay advances, pauses on hover, held under reduced motion
- external product CTAs carry `target="_blank"` + `rel="noopener noreferrer"`
- no rendered body copy below 15px
- interactive targets ≥ 44px

Manual: Lighthouse, real-device tablet/mobile, keyboard-only walk.
