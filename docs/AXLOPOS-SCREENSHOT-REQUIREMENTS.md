# AxloPOS product screenshots — replacement requirement

**Status:** open · blocks public launch (blocker **L6**)
**Raised:** 2026-08-31, from the client brief compliance audit
**Owner:** client — AxloPOS product team

---

## Decision

The two AxloPOS screenshots currently in the repository are **NOT approved for publication**. They
are reclassified as:

> **INTERNAL / PRE-LAUNCH PRODUCT EVIDENCE**

They are **retained, not deleted**. They remain in place so the Products section keeps working, so
layout, aspect ratio, lazy loading, carousel behaviour and the zero-CLS guarantee stay verifiable,
and so the replacement can be dropped in against a known-good reference.

| File | Intrinsic | Classification |
| --- | --- | --- |
| `public/images/products/axlopos/axlopos-owner-dashboard.png` | 2048 × 967 | Internal / pre-launch product evidence |
| `public/images/products/axlopos/axlopos-checkout-cart.png` | 2048 × 967 | Internal / pre-launch product evidence |

**No replacement screenshot may be invented, generated, redrawn, mocked up or composed.** Only a
real capture from an AxloPOS environment, approved by the client, may replace these.

---

## Why they are not publishable

Four defects, all inside the images and therefore invisible to every DOM-level content check in the
test suite. This is the point worth remembering: `tests/content.spec.ts` asserts over
`document.body.textContent`, so it cannot read pixels. All four pass today.

| # | Defect | Detail |
| --- | --- | --- |
| 1 | **Wrong product branding** | Both captures show **“Hardware POS”** in the top-left lockup. The page, the CTA and the alt text all say **AxloPOS**. If “Hardware POS” is a tenant or store name, it is also customer-identifying detail on a public page. |
| 2 | **Unverified QuickBooks integration** | A **QuickBooks** sidebar item, the footnote “QuickBooks is the inventory & accounting master”, an alert “Failed QuickBooks syncs — 3 recent sales failed to sync”, and “Records waiting to sync — 3 records queued for QuickBooks”. Blocker **R3** withdrew exactly this claim from the copy as unverified; the images assert it anyway. Brief §13 also forbids third-party platforms reading as Axlo-owned. |
| 3 | **Environment-specific operational data** | Realistic currency figures (Rs. 62,693.22 net sales; Rs. 342,852,126.40 inventory value; Rs. 305,909.98 seven-day sales), percentages (+16.1%, −36.4%), counts (268 stocked products, 276 catalogue products), and real-looking SKU names. |
| 4 | **Failure states foregrounded** | A red “6 sync failed” header badge and a “Business Attention” panel showing 2 critical / 1 warning: out-of-stock products, failed syncs, low-stock items. The largest product visual on the site currently shows the product not coping. |

Two further quality issues to fix on any recapture:

- **Implausible demo data.** Gross Profit (Rs. 62,731.47) **exceeds** Net Sales (Rs. 62,693.22) —
  profit above revenue. In the checkout view a 100% order discount reduces a Rs. 13,715.92 subtotal
  to a **Grand Total of Rs. 0.00**, and the payment button reads “Proceed to Payment · Rs. 0.00”.
  The audience for this product is finance-literate and will notice both.
- **A mouse cursor is captured** in both images.

---

## What the replacement must satisfy

### Content

1. **AxloPOS branding** in the application lockup — not “Hardware POS”, not a tenant or store name.
2. **Demo-safe, illustrative data throughout.** No real customer, supplier, employee, transaction,
   pricing or inventory data.
3. **Internally coherent figures.** Gross profit below net sales; totals that follow from their line
   items; no 100% discounts or zero grand totals.
4. **No unverified availability or integration claim visible anywhere in the interface** — including
   sidebar items, sync banners, status chips and footnotes. If an accounting integration is to be
   shown, it must first be verified and approved, which also clears blocker **R3**.
5. **No error, failure or degraded state** presented as the product's resting condition.
6. **No sensitive information**: no credentials, tokens, API keys, email addresses, phone numbers,
   personal names, addresses or tax identifiers.
7. **No cursor, tooltip, focus ring, browser chrome, OS chrome, notification or extension artefact.**

### Capture

| Requirement | Value |
| --- | --- |
| Views required | **Two** — 01 owner dashboard, 02 checkout / cart |
| Aspect ratio | Both files the **same** ratio as each other |
| Current ratio | 2048 × 967 (≈ 2.12 : 1) — preferred, so the content model is a two-line change |
| Minimum width | 2048px, so the 62vw desktop slot is served above 1×; 2× is better |
| Format | PNG, no alpha |
| Theme | Dark, matching the current captures — the page is dark-only |
| Chrome | Application only. No browser or OS frame |

### If the ratio changes

Update **both** entries in `content/products/index.ts` — `width` and `height` must be the files'
true intrinsic pixels. `tests/products.spec.ts` asserts the reserved box against 2048 / 967 and will
fail until they match, which is the intended behaviour: the CLS guarantee depends on those numbers
being right.

---

## The demo-data label

Until figures are confirmed as real and approved, every public AxloPOS visual carries a visible
disclosure:

> **Demo environment · Illustrative data**

Implemented as `dataNotice` on the media entry in `content/products/index.ts`, worded once as
`ILLUSTRATIVE_DATA_NOTICE`, and rendered by `ProductScreenshot` as a caption bar beneath the frame.
It is real text, not baked into the pixels, so assistive technology reads it with the image. It is
never a watermark — nothing is drawn over the interface. Enforced by `tests/products.spec.ts`.

**If the replacement captures use figures that are real and approved for publication, drop
`dataNotice` from that media entry** and the label disappears with it. The label describes the
file's contents, so it is removed in the same edit that replaces the file — never separately.

---

## Definition of done

- [ ] Client supplies two approved captures meeting every content and capture requirement above
- [ ] Files replace the existing paths, or new paths are set in `content/products/index.ts`
- [ ] `width` / `height` match the new files' true intrinsic pixels
- [ ] Alt text re-checked against what the new captures actually show
- [ ] `dataNotice` retained, or removed if the figures are real and approved
- [ ] Classification in this document and in `LAUNCH-BLOCKERS.md` updated to approved
- [ ] `npm run typecheck && npm run lint && npm run build && npm test` clean
- [ ] `npm run screenshots` re-run and the AxloPOS panel reviewed at all six sizes
- [ ] Superseded internal captures retained or archived — **not deleted** without instruction
