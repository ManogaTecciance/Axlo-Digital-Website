# Launch blockers

Everything outstanding before this site can go to production.

**Scope:** Axlo Digital v1 is a single-page landing site at `app/page.tsx` with six sections, plus two
internal legal drafts that are `noindex` and unlinked. Approved products are **Comply360** and
**AxloPOS** only.

Last updated: 2026-08-31 (client brief compliance audit; decisions recorded).

**Two blockers now stand between this site and public launch: L1 and L6.**

---

## 🔴 Blocks launch

### L1 — Legal copy
**Status:** none supplied. **Owner:** client + qualified legal adviser.

`/privacy` and `/terms` exist as **internal drafts**. They are `noindex, nofollow` and are **not
linked from anywhere on the site**, so no visitor can reach them and no crawler will index them.
Every clause requiring legal judgement is marked *Pending legal review*, and each page carries a
visible "not in force" notice.

Nothing was generated to fill space. Automatically generated legal content is not professionally
approved content.

| Document | Outstanding |
| --- | --- |
| Privacy Policy | Categories of personal data, lawful bases, retention periods, processor list, applicable regime, rights and how to exercise them, named data-protection contact, registered address |
| Terms of Service | Scope, acceptable use, limitation of liability, warranty disclaimers, indemnities, governing law, registered entity |

**Confirmed in Phase 2:** this does **not** block design, implementation, responsiveness,
accessibility or QA work, and none of that work was held back for it. It blocks one thing only —
**final public launch**. The site must not be marked launch-ready until either approved copy is
supplied, or the business owner explicitly confirms the final legal-content decision after
appropriate review. Supplying copy also restores the two footer links (`legalNav` in `lib/site.ts`).

---

### L6 — AxloPOS public-safe product screenshots
**Status:** current captures **not approved for publication**. **Owner:** client — AxloPOS product team.

The two screenshots in `public/images/products/axlopos/` are reclassified as **INTERNAL /
PRE-LAUNCH PRODUCT EVIDENCE**. They are **retained, not deleted** — the Products section keeps
working and every layout, ratio, lazy-loading and zero-CLS guarantee stays verifiable against them.

They cannot be published because the images show “Hardware POS” branding rather than AxloPOS, a
QuickBooks integration that blocker R3 withdrew from the copy as unverified, environment-specific
financial figures, and foregrounded failure states. **All four pass the test suite**, because
`tests/content.spec.ts` asserts over `document.body.textContent` and cannot read pixels — the
guardrails were built for copy and this is not copy.

Until approved captures are supplied, every public AxloPOS visual carries a visible
**“Demo environment · Illustrative data”** disclosure, worded once as `ILLUSTRATIVE_DATA_NOTICE`
and enforced by `tests/products.spec.ts`. That satisfies the brief's demo-data governance rule
(§2, §24) for the interim; it does not clear this blocker.

**No replacement may be invented, generated, redrawn or composed.** Full capture specification and
definition of done: [`AXLOPOS-SCREENSHOT-REQUIREMENTS.md`](AXLOPOS-SCREENSHOT-REQUIREMENTS.md).

---

## 🟠 Open, does not block launch

### R3 — AxloPOS availability status
**Affects:** `content/products/index.ts`

**Closed for the current landing-page scope.** Every unverified availability and integration claim
has been removed from the page, and nothing has replaced it:

| Withdrawn | Where it was | Why |
| --- | --- | --- |
| `signals: ['Live inventory', 'Tablet ready']` | AxloPOS panel, accent-dotted chips | "Live" reads as a release-stage badge beside a product name; "Tablet ready" is an unverified platform claim |
| `audience: 'For retail, hardware, tiles, clothing and restaurant businesses.'` | AxloPOS panel | Asserts a customer base across five named sectors that no approved information supports |
| `positioning: 'One connected selling and operations platform.'` | AxloPOS panel | Superseded by the approved neutral sentence |
| `'Accounting sync'` | Trust strip (`content/company`) | Checkable only against the composed dashboard's "Connected systems" card, which no longer exists — it would have asserted an accounting integration |
| The composed "Connected systems" card | `AxloPosInterface.tsx` | Component deleted outright; see S1 |

AxloPOS now carries exactly one approved sentence and four capability pills, each naming a domain
from that sentence and visible in one of the two screenshots. **No availability badge of any kind is
rendered** — not Live, Beta, Pilot or Coming Soon.

`tests/content.spec.ts` enforces this: a test fails if any of those claims, or any release-stage
badge, reappears in the Products section.

**Still awaited (not blocking):** the exact approved product availability status, and verification of
the withdrawn accounting-platform integration. Both are recorded in `content/products/pending.ts`.
Supply either and it can be published as copy — not as a chip.

---

## ✅ Closed in Phase 2

### S1 — AxloPOS product imagery
Two **real AxloPOS screenshots** are now the product's only interface content:

| File | Slide | Intrinsic size | Alt text |
| --- | --- | --- | --- |
| `public/images/products/axlopos/axlopos-owner-dashboard.png` | 01 | 2048 × 967 | AxloPOS owner dashboard showing sales, profit, transactions, inventory value, quotations, performance reporting, and operational alerts. |
| `public/images/products/axlopos/axlopos-checkout-cart.png` | 02 | 2048 × 967 | AxloPOS checkout interface showing product search, product catalogue, customer selection, cart items, discounts, totals, and payment action. |

Served through `next/image` with the files' own intrinsic dimensions, responsive `sizes`, `quality`
above the default, `loading="lazy"` (the section is far below the fold), and proportional scaling
only — no crop, no fixed container ratio, and no temporary upload URL. `object-fit: contain` is set
as a fail-safe rather than as a fitting strategy: `height: auto` means the box already carries the
file's own ratio, so it is an identity today and guarantees the whole interface stays visible if a
future rule ever constrains the height. The dark-theme photographic grade is switched off over them
so the product's interface renders in its own colours.

Because the intrinsic dimensions are declared, the box is reserved at the file's ratio before any
bytes arrive: measured CLS attributable to the carousel is **0.000** at both 1440 × 900 and 390 × 844.
`tests/products.spec.ts` locks this down by asserting the reserved ratio while the images are still
undecoded.

`components/product-demo/AxloPosInterface.tsx` and its stylesheet have been **deleted**, not left
behind a branch — there is no path back to publishing a drawn interface for a product whose real one
we hold. Comply360 keeps its composed states, which remain labelled "Sample view".

### S2 — Approved proof content
No customer logos, testimonials, metrics, awards, certifications, partnerships or case studies exist,
and none are rendered. No placeholder proof section has been added. **Not a blocker:** none of this
content is required by the approved landing-page scope.

### S3 — Contact details
`hello@axlodigital.com` is the only contact detail published. No phone number, address, office
location or social profile is invented; `site.social` and `legalNav` are empty by policy. **Not a
blocker.**

---

## Closed — no longer applicable after the scope correction

| ID | Was | Why closed |
| --- | --- | --- |
| **L2** | Developer brief `.docx` required for Payroll and Budget content | Payroll and Budget are out of scope. No brief is required. |
| **L3** | Contact delivery provider | A contact page and validated form are not part of this release. The Final CTA opens mail directly. |
| **R1** | Axlo Payroll product content | Product removed from scope entirely. |
| **R2** | Axlo Budget product content | Product removed from scope entirely. |
| **R4** | Odoo / QuickBooks engagement scope | Solution pages and the Solutions section are out of scope. No page makes any Odoo or QuickBooks claim. |
| **R5** | Industry page content | Industries are out of scope. |
| **R6** | Insights articles | Insights is out of scope. |
| **R7** | Leadership content | The About page is out of scope. |
| — | Light theme | v1 is intentionally dark-only. Not a blocker. No theme control is exposed anywhere — the only footer control is the reduced-motion toggle, which is an accessibility control and stays. |

---

## Phase status

| Phase | Status |
| --- | --- |
| 0 — Audit and plan | ✅ Complete |
| 1 — Single-page refinement, scope-corrected | ✅ Complete |
| 2 — Real screenshots, R3 closure, hardening and QA | ✅ **Complete — approved 2026-08-31** |

## Project status (recorded on approval, 2026-08-31)

| Area | Status |
| --- | --- |
| Design & Development | ✅ Complete |
| Responsive QA | ✅ Complete |
| Accessibility QA | ✅ Complete |
| Reduced Motion | ✅ Complete |
| AxloPOS Real Screenshots | ⏳ **Integration complete; assets not approved for publication — L6** |
| Navigation / Anchors | ✅ Complete |
| Testing | ✅ Complete |
| Production Build | ✅ Complete |
| Legal Content | ⏳ **Pending approval** |
| Public Launch | 🔴 **Blocked by L1 and L6** |

**The landing-page design and development implementation is complete and accepted.** The site must
not be marked "ready for public launch" until approved Privacy and Terms content is supplied **and**
public-safe AxloPOS screenshots are approved.

**Two blockers remain: L1 and L6.** Neither is a code defect — both are awaited client content.
Full handoff: [`HANDOFF.md`](HANDOFF.md) (superseded in part; see its banner).

### Decisions recorded at Phase 2 approval

1. No further design or implementation changes unless a genuine defect is found in final visual review.
2. Mobile lazy-loading behaviour and the updated test approach are kept as they are.
3. The screenshot-capture timeout fix stays **isolated to the capture tooling**. Production image-loading
   behaviour must not be modified to accommodate screenshot automation.
4. The 2048 × 967 intrinsic dimensions and the CLS regression test are kept.
5. Privacy and Terms drafts remain `noindex`, unlinked, and internally marked as drafts. No legal
   wording is to be fabricated or published without approval.

### Decisions recorded at the brief compliance audit (2026-08-31)

| Ref | Question | Decision |
| --- | --- | --- |
| F-01/03/04 | Are the current AxloPOS screenshots approved as-is? | **No.** Reclassified INTERNAL / PRE-LAUNCH PRODUCT EVIDENCE, retained not deleted. Replacement required — **L6** |
| F-02 | Label illustrative figures? | **Yes.** “Demo environment · Illustrative data”, discreet, near the media, never a watermark |
| §27 | Adopt the brief's quick-reference homepage copy? | **No.** Current V1 wording is retained. §27 wording is **SUPERSEDED BY LATER APPROVED V1 COPY** and the differences are **not defects** |
| §4 | Primary CTA label | **Changed to “Talk to Axlo”**, from the one source in `lib/site.ts`. The Final CTA keeps “Start a conversation” |
| §6.2, §6.6 | Add Problem and Why Axlo bands to V1? | **No.** Both **DEFERRED TO V2 BY APPROVED V1 SCOPE**. The six-section structure is unchanged; no new sections |
| §22/§23 | Analytics and consent | **V1 launches tracking-free.** No analytics, pixels or consent tooling. Deferred to post-launch/V2, subject to a separate privacy and consent review. **Not a V1 launch defect** |
