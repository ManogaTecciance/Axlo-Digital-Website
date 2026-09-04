/**
 * Product content — the two Axlo Digital products.
 *
 * CONTENT POLICY
 * No customer names, statistics, testimonials, awards, user counts, revenue
 * figures or business outcomes appear here. Every line describes what the
 * software does and which problem it removes — never what it has achieved for
 * anyone, and never that it is available, live, production-ready or integrated
 * with a third-party system. No availability badge is rendered anywhere.
 *
 * Content still awaited for either product is recorded in ./pending.ts, which
 * is deliberately kept out of this module: everything here crosses the client
 * boundary and is serialised into the page.
 *
 * Both products carry the same shape, so neither can drift into being the
 * better-presented one. They differ in one respect only, and it is a factual
 * one: AxloPOS states are **real product screenshots** (`media`), Comply360
 * states are composed interfaces drawn from the shared primitive kit and
 * labelled as sample views. A state is one or the other, never both.
 */

export type ProductStateId =
  | 'comply-dashboard'
  | 'comply-filing'
  | 'comply-reporting'
  | 'pos-owner-dashboard'
  | 'pos-checkout-cart';

/**
 * A real screenshot of a shipped product.
 *
 * `width` and `height` are the file's own intrinsic pixel dimensions, so
 * `next/image` reserves the correct box before the bytes arrive and the image
 * is never scaled to a ratio that is not its own. Change a file and these must
 * change with it.
 */
export type ProductScreenshot = {
  src: string;
  width: number;
  height: number;
  /** The whole accessible description of the screenshot. */
  alt: string;
  /**
   * Governance label, rendered under the frame whenever the interface on screen
   * shows figures that are not approved real-world performance data.
   *
   * Present on a screenshot rather than on the carousel because it describes
   * *this file's* contents: swap in an approved capture whose figures are real
   * and the label is dropped with it, in the same edit.
   */
  dataNotice?: string;
};

/**
 * The one wording for the demo-data disclosure, so the two screenshots cannot
 * drift apart. Required by §2 and §24 of the client brief: sample figures in
 * product visuals must be labelled unless they are real, approved data.
 */
export const ILLUSTRATIVE_DATA_NOTICE = 'Demo environment · Illustrative data';

export type ProductState = {
  id: ProductStateId;
  /** Short label — shown in the frame title and the carousel position. */
  label: string;
  /** One line under the frame explaining what the state shows. */
  caption: string;
  /** Present when the state is a real screenshot rather than a composed view. */
  media?: ProductScreenshot;
};

export type Product = {
  id: string;
  /** Eyebrow index — rendered before the name. */
  index: string;
  name: string;
  /**
   * What the product is, in one accent line. Optional: a product whose only
   * approved copy is a single sentence carries that sentence as its
   * `description` and nothing else, rather than having a second line written
   * for it to fill the slot.
   */
  positioning?: string;
  /** Who it is built for. Optional for the same reason as `positioning`. */
  audience?: string;
  /** The problem it removes, then the value it gives back. */
  description: string;
  /** Capability labels. Every one must be visible in the product's own states. */
  capabilities: string[];
  /** Small operational facts about the product. Omitted where none apply. */
  signals?: string[];
  cta: {
    label: string;
    /** Absent until a confirmed URL exists — the CTA renders as a placeholder. */
    href?: string;
    /** Present when the link leaves the site. */
    external?: boolean;
    /** Overrides the visible label for assistive technology. */
    ariaLabel?: string;
  };
  states: ProductState[];
};

export const products: Product[] = [
  {
    id: 'comply360',
    index: '01',
    name: 'Comply360',
    positioning: 'Sri Lanka’s corporate tax compliance workspace.',
    audience: 'For finance teams and tax practitioners inside Sri Lankan companies.',
    description:
      'Corporate tax obligations usually live across spreadsheets, inboxes and filing portals. Comply360 organises deadlines, filings, supporting documents and compliance progress in one connected operational view.',
    capabilities: ['Filing Visibility', 'Deadline Tracking', 'Compliance Workflow'],
    // No confirmed public URL yet — rendered as a clearly-labelled placeholder.
    cta: { label: 'Explore Comply360' },
    states: [
      {
        id: 'comply-dashboard',
        label: 'Compliance dashboard',
        caption:
          'Readiness, tracked obligations and upcoming statutory deadlines across the financial year, in one view.',
      },
      {
        id: 'comply-filing',
        label: 'Filing workflow',
        caption:
          'Each filing moves through preparation, review, approval and submission with its supporting documents attached.',
      },
      {
        id: 'comply-reporting',
        label: 'Reporting overview',
        caption:
          'Filing history and document completeness summarised for management and audit review.',
      },
    ],
  },
  {
    id: 'axlopos',
    index: '02',
    name: 'AxloPOS',
    /*
     * WHY THERE IS NO `positioning` OR `audience` LINE HERE
     * One neutral sentence is the approved description of this product, and it
     * is reproduced below verbatim. The two lines that used to sit above it
     * were withdrawn rather than reworded — the withdrawn wording and the
     * reason are recorded in ./pending.ts, which nothing imports. The panel
     * renders without them; see `ProductShowcase`, which promotes the
     * description when a product leads with it.
     */
    description:
      'AxloPOS is a connected point-of-sale and business operations platform for sales, payments, inventory, customers, suppliers, reporting, and operational workflows.',
    /* Every pill below names a domain from the sentence above and is visible in
       one of the two screenshots. Nothing here is a claim about availability,
       maturity or third-party integration. */
    capabilities: ['Sales & Payments', 'Inventory', 'Customers & Suppliers', 'Reporting'],
    /*
     * `signals` is deliberately absent — the two chips it carried were both
     * withdrawn, and no release-stage badge of any kind is rendered until an
     * exact approved product status is supplied. When one is, it belongs in
     * copy that says what it is, not in an accent-dotted chip. Detail in
     * ./pending.ts; blocker R3.
     */
    cta: {
      label: 'Explore AxloPOS',
      href: 'https://www.axlopos.com/',
      external: true,
      ariaLabel: 'Explore the AxloPOS website',
    },
    states: [
      {
        id: 'pos-owner-dashboard',
        label: 'Owner dashboard',
        caption:
          'Sales, profit, transactions, inventory value, quotations, performance reporting and operational alerts in one summary.',
        media: {
          src: '/images/products/axlopos/axlopos-owner-dashboard.png',
          width: 2048,
          height: 967,
          alt: 'AxloPOS owner dashboard showing sales, profit, transactions, inventory value, quotations, performance reporting, and operational alerts.',
          dataNotice: ILLUSTRATIVE_DATA_NOTICE,
        },
      },
      {
        id: 'pos-checkout-cart',
        label: 'Checkout',
        caption:
          'Product search and catalogue, customer selection, cart items, discounts, totals and the payment action on one screen.',
        media: {
          src: '/images/products/axlopos/axlopos-checkout-cart.png',
          width: 2048,
          height: 967,
          alt: 'AxloPOS checkout interface showing product search, product catalogue, customer selection, cart items, discounts, totals, and payment action.',
          dataNotice: ILLUSTRATIVE_DATA_NOTICE,
        },
      },
    ],
  },
];
