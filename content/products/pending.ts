/**
 * Content the approved products are still waiting on.
 *
 * INTERNAL ONLY — AND STRUCTURALLY SO.
 *
 * This lives in its own module rather than as a field on `Product` for one
 * concrete reason: `ProductShowcase` is a client component, so every product
 * object it receives is serialised into the Flight payload and ends up in the
 * shipped HTML. A `pendingContent` field on `Product` was therefore *not*
 * internal at all — the withdrawn "QuickBooks connected" claim was sitting in
 * the page source, in a note explaining that it had been withdrawn.
 *
 * `tests/content.spec.ts` caught it. Keeping the data here, where no component
 * imports it, makes the guarantee real: nothing in this file reaches the
 * browser.
 *
 * `docs/LAUNCH-BLOCKERS.md` is written from this list. Keep the two in step.
 */

export type PendingContent = {
  /** Matches `Product['id']` in ./index.ts. */
  productId: 'comply360' | 'axlopos';
  awaiting: string[];
};

export const pendingContent: PendingContent[] = [
  {
    productId: 'comply360',
    awaiting: [
      'Confirmed third-party integrations',
      'Security and operational notes',
      'A public product URL, if one is planned',
      'Real product screenshots, if the composed interface is to be replaced',
    ],
  },
  {
    /*
     * WITHDRAWN AXLOPOS COPY — recorded here, and nowhere that ships.
     *
     * Two lines were removed from the product panel and are not to be restored
     * without approval:
     *   • positioning — "One connected selling and operations platform."
     *     Superseded by the approved neutral sentence.
     *   • audience — "For retail, hardware, tiles, clothing and restaurant
     *     businesses." Asserts a customer base across five named sectors that
     *     no approved information supports.
     *
     * And two `signals` chips: "Live inventory" — which reads as a release-stage
     * badge beside a product name — and "Tablet ready", an unverified platform
     * claim.
     */
    productId: 'axlopos',
    awaiting: [
      // Blocker L6. The captures currently in the repository are INTERNAL /
      // PRE-LAUNCH PRODUCT EVIDENCE — they show "Hardware POS" branding, a
      // QuickBooks integration this list still records as unverified, demo
      // financial figures and foregrounded failure states. Retained, not
      // deleted. Until approved captures arrive, both carry a visible
      // "Demo environment · Illustrative data" disclosure. Full specification:
      // docs/AXLOPOS-SCREENSHOT-REQUIREMENTS.md
      'Approved public-safe AxloPOS screenshots — AxloPOS branding, demo-safe data',
      // Nothing on the page states or implies a release stage. Supply the exact
      // approved wording and it can be published as copy; until then no badge
      // of any kind — Live, Beta, Pilot, Coming Soon — is rendered.
      'The exact approved product availability status',
      // Listed against AxloPOS as a capability in an earlier build and
      // withdrawn from the copy: no approved information confirms it. The
      // composed dashboard that also carried it has since been deleted.
      'Verification of the withdrawn accounting-platform integration claim',
      'Any other confirmed third-party integrations',
      'Security and operational notes',
    ],
  },
];
