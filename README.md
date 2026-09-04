# Axlo Digital — website

_Connected technology for the way your business works._

Production frontend for [axlodigital.com](https://www.axlodigital.com): a Next.js App Router
site built on the **Axlo Flow design system**, dark-only, with a reduced-motion mode and a
connected-flow motion concept that runs from the hero to the final CTA.

Built to the *Axlo Digital Website Redesign & Development Brief* (26 August 2026). Section
references in the source (`brief §13`, `brief §20`…) point at that document.

---

## Quick start

You need **Node 18.18+** (developed on Node 22) and a package manager. The repo carries a
`pnpm-lock.yaml`, so pnpm gives a reproducible install:

```bash
pnpm install
pnpm dev                 # http://localhost:3000
```

npm works too (`npm install && npm run dev`), it just resolves from `package-lock.json`.

### Everything else

```bash
pnpm build               # production build (also type-checks and lints)
pnpm start               # serve the production build on :3000
pnpm start -p 4000       # …on another port

pnpm typecheck           # tsc --noEmit
pnpm lint                # eslint
pnpm test                # Playwright end-to-end suite
pnpm test:ui             # the same suite, with the Playwright inspector
```

`pnpm test` builds the site and starts it on port 4331 itself — you do not need a server
running first. On a clean machine, install the browser once:

```bash
npx playwright install chromium
```

If your environment already has a Chromium that Playwright did not download, point the run
at it instead:

```bash
PLAYWRIGHT_CHROMIUM_PATH=/path/to/chrome pnpm test
```

### Continuous integration

`.github/workflows/ci.yml` runs on every pull request and on pushes to `main`, in two
parallel jobs:

| Job | Runs | Roughly |
| --- | --- | --- |
| **Lint, types and build** | `pnpm typecheck`, `pnpm lint`, `pnpm build` | 2 min |
| **End-to-end tests** | `pnpm test` — 170 tests across two viewport projects | 10 min |

Both install with `pnpm install --frozen-lockfile`, so a `package.json` change that is not
reflected in `pnpm-lock.yaml` fails the build rather than silently resolving a different
tree than you get locally. Run `pnpm install` and commit the lockfile alongside the change.

The e2e job caches Playwright's browsers against the exact Playwright version, and uploads
`test-results/` (including traces from the retry) as an artifact when a run fails.

### Environment variables

None are required to run the site locally — it builds and serves with no configuration.
Two are read in production, both by the enquiry endpoint:

| Variable | Required | Purpose |
| --- | --- | --- |
| `AXLO_ENQUIRY_WEBHOOK` | To deliver enquiries | URL the contact form POSTs each enquiry to as JSON. |
| `AXLO_ENQUIRY_TOKEN` | Optional | Sent as `Authorization: Bearer …` with that request. |

With no webhook set, the form validates normally and then tells the visitor it is not
connected yet, offering a prefilled mailto. See [Contact form](#contact-form).

---

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling | CSS Modules + CSS custom properties (**no Tailwind**) |
| Component transitions | Motion for React (`motion`) |
| Scroll reveals | CSS, progressively enhanced — no animation library |
| Diagrams and product UI | SVG and composed HTML, hand-authored |
| Primitives | Radix UI — dialog only |
| Tests | Playwright (+ axe-core), run in GitHub Actions |

There is no GSAP, no three.js and no charting library: the hero entrance is a CSS keyframe,
and the product screens are composed from the primitives in `components/product-demo`.

---

## Project structure

```
app/                         29 routes + the enquiry API + sitemap/robots
├── page.tsx                 Homepage — nine bands (brief §6)
├── what-we-do/              The four capability areas in full (§7)
├── products/                Portfolio index (§8)
│   └── [slug]/              One template, four products (§9–§12)
├── solutions/               Partner platforms + Axlo engineering (§13, §14)
│   └── [slug]/              One template, six services
├── industries/              Six sectors (§15)
│   └── [slug]/              Problems → fit → workflows → integrations
├── why-axlo/                Six positions (§16)
├── about/                   Company, mission, vision, values, leadership (§17)
├── case-studies/            The proof framework (§18)
├── insights/                Article index and category model (§19)
├── contact/                 The conversion page (§20)
├── legal/                   privacy · terms · cookies (§23)
├── api/enquiry/             Server-side validation + delivery seam
└── not-found.tsx            Custom 404

components/
├── foundations/             Button, Logo, Tag, Eyebrow, Placeholder…
├── layout/                  Container, Section, Grid, PageHero, PageBlocks, LegalPage
├── navigation/              Header, MobileMenu, Footer, CtaLink
├── sections/                The homepage bands
├── motion/                  FlowLine, StageRail, Reveal, HeroDepth, CursorAffordance
├── product-demo/            Comply360 and AxloPOS screens, module map, carousel
├── forms/                   EnquiryForm
└── accessibility/           SkipLink

content/                     All copy. Pages read from here; none author their own.
├── products/                Four products: positioning, modules, feature groups
├── solutions/               Six services — `vendor` marks a partner platform
├── industries/              Six sectors, linked to products/solutions by id
├── company/                 Stages, Why Axlo, About, leadership, case studies
├── insights/                Article model + categories
└── legal/                   Privacy, terms and cookie copy

lib/                         site (nav + CTAs), seo, enquiry, analytics, hooks, motion
styles/                      tokens · dark-theme · typography · motion · globals
tests/                       Playwright specs
```

**The content layer is the point.** A product renamed in `content/products` changes the
homepage, the products index, its own page, every industry page that references it, the
footer, the sitemap and its structured data. No page restates content it did not author.

---

## Information architecture

```
/                       Hero → Problem → Capabilities → Products →
                        ERP & Finance → Why Axlo → How We Work → Proof → CTA
/what-we-do
/products               /products/{comply360,axlo-payroll,axlo-budget,axlopos}
/solutions              /solutions/{odoo,quickbooks,erp-business-systems,
                                    ai-automation,system-integration,custom-software}
/industries             /industries/{retail,manufacturing,distribution,
                                     restaurants-hospitality,professional-services,
                                     finance-accounting}
/why-axlo   /about   /case-studies   /insights   /contact
/legal/{privacy,terms,cookies}
```

---

## The owned/partner rule

**Odoo and QuickBooks are not Axlo products.** Brief §13, §24 and §26 all say so, and it is
the easiest thing here to break by accident — one card moved between two sections does it.

It is enforced structurally, not by careful wording:

- Owned software lives under `/products`; third-party platforms live under `/solutions`.
  The two never share a page, a card treatment or a URL prefix.
- `content/solutions` carries a `vendor` field. Set, and the UI labels the entry
  "Partner platform · <vendor>", the page adds an ownership statement, and the structured
  data emits `Service` (provided by Axlo) rather than `SoftwareApplication`.
- The homepage reads owned products first, then a separately-styled partner band.
- `tests/brand-separation.spec.ts` asserts all of it — including that a vendor name can
  only appear beside an Axlo product as an explicit integration ("Connects to QuickBooks").

If you add a platform Axlo implements rather than owns, put it in `content/solutions` with
a `vendor`. Nothing else needs changing.

---

## Content policy — read before editing copy

Brief §18 and §24 are hard rules, not preferences. **Nothing on this site may claim
something that cannot be verified.**

- No customer names, logos, testimonials or quotations without written permission.
- No metrics, percentages, client counts or years-of-experience claims unless verified.
- No sector track record. Industry pages describe the sector's problems, never Axlo's
  history in it.
- Mockup figures are demo data and are labelled as such, visibly and in the accessible
  name (brief §2).

Where the client has not supplied approved content, the export is an **empty list** and the
page renders a visible pending panel saying what is needed. `leadership`, `caseStudies` and
`articles` are all empty by policy — that is a deliberate, load-bearing value, not an
oversight. Supply entries and the pending panel disappears with no code change.

`tests/content.spec.ts` fails the build if an unverifiable claim appears on any page.

---

## Themes

The site is **dark-only**. `data-theme="dark"` is written once on `<html>` and never
changes; there is no light stylesheet in use and no theme switcher. Sections still carry
their own `data-theme` so the semantic token layer resolves inside them.

Motion is the one display preference, because it is an accessibility control rather than a
style choice: the OS setting is honoured by default, and the footer/drawer toggle lets
someone quieten motion on this site alone. It is stored in `localStorage` under
`axlo-motion` and applied before first paint.

---

## Accessibility

Targets, and what enforces them:

| Commitment | Enforced by |
| --- | --- |
| No WCAG 2.2 AA violations on any template | axe-core, per route |
| One `h1` per page, no skipped heading levels | `accessibility.spec.ts` |
| 15px body-copy floor | `accessibility.spec.ts` |
| 44px interactive targets (with the WCAG 2.5.8 inline and stretched-link exceptions) | `accessibility.spec.ts` |
| Visible focus ring on every control | `accessibility.spec.ts` |
| Decorative graphics hidden from assistive technology | `accessibility.spec.ts` |
| Status never conveyed by colour alone | Component CSS + review |
| Full keyboard operation, focus trapped in the drawer | `navigation.spec.ts` |
| Reduced motion honoured (OS and in-page) | `products.spec.ts` |

Scroll reveals are progressive enhancement: the server never sends hidden content, so a
visitor whose JavaScript fails sees everything.

### Manual checks before release

1. Tab the whole page — focus order matches reading order, nothing is trapped.
2. VoiceOver / NVDA over the product carousels and the enquiry form.
3. Zoom to 200% and to 400% — no content lost, no horizontal scroll.
4. Test with reduced motion on at OS level.
5. Windows High Contrast Mode.

---

## SEO

- Unique title and meta description per indexable page (asserted in `content.spec.ts`).
- Canonical URLs, Open Graph and Twitter cards; the OG image is a raster, not SVG.
- `sitemap.xml` and `robots.txt` are generated from the content layer — a new product,
  solution, industry or article appears without a second edit.
- Structured data: `Organization`, `WebSite`, `BreadcrumbList` on every secondary page,
  `SoftwareApplication` per product, `Service` per solution, `Article` per insight.
  No `aggregateRating`, `review` or invented `offers`.
- Breadcrumb markup is emitted only where a visible trail exists, which is Google's
  condition for using it.

---

## Contact form

`/contact` posts to `app/api/enquiry`, which:

1. Drops anything that fills the honeypot or submits in under three seconds — answering
   `200 OK`, because telling a bot it was detected only trains the next attempt.
2. Rate-limits to 5 submissions per IP per hour, in process.
3. Validates server-side using the same rules the browser ran (`lib/enquiry.ts`).
4. Forwards the enquiry as JSON to `AXLO_ENQUIRY_WEBHOOK`.

**Delivery is a seam, not a dependency.** No email provider is installed — choosing one is
Axlo's decision, and it carries an account, a cost and a data-processor entry in the
privacy policy. Any endpoint that accepts a JSON POST works: a CRM intake, a Zapier or Make
hook, Formspree, or a small mail-sending function.

With no webhook configured the endpoint answers `503 {"reason":"unconfigured"}` and the
form says so, offering a prefilled mailto. Nothing is ever reported as sent when it was not.

Nothing is logged. Analytics events carry field *names* on a validation failure and never a
value anybody typed.

---

## Analytics

No analytics platform is installed. `lib/analytics.ts` pushes named events to
`window.dataLayer` **only if something else has already created it**, so installing a tag
manager later starts reporting correctly-named conversions from day one with no second pass
over the components. Until then every call is a silent no-op.

Adding a platform means updating `/legal/privacy` and `/legal/cookies` first, and adding a
consent mechanism where the jurisdiction requires one.

---

## Conventions

- **Content lives in `content/`.** A page that authors its own copy is a bug.
- **CSS Modules only.** No utility classes, no inline styles except computed values.
- **Semantic tokens only** (`--color-*`, `--space-*`, `--text-*`). Components never touch
  the raw brand palette in `tokens.css`.
- **Comments explain why, not what.** The non-obvious decisions are documented at the top
  of the file that makes them.
- **Every animation has a reduced-motion path**, and it is a real alternative, not a
  removal.
