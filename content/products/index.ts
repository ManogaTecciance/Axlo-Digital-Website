/**
 * Product content — the two Axlo Digital products.
 *
 * CONTENT POLICY
 * No customer names, statistics, testimonials, awards, user counts, revenue
 * figures or business outcomes appear here. Every line describes what the
 * software does, who it is built for, and which problem it removes — never
 * what it has achieved for anyone.
 *
 * Each product carries the same shape, so neither can drift into being the
 * better-presented one: positioning, audience, the problem and the value, three
 * capabilities, and three interface states rendered as real composed UI (see
 * components/product-demo). Nothing here points at a screenshot file.
 */

export type ProductStateId =
  | 'comply-dashboard'
  | 'comply-filing'
  | 'comply-reporting'
  | 'pos-checkout'
  | 'pos-payment'
  | 'pos-dashboard';

export type ProductState = {
  id: ProductStateId;
  /** Short label — shown in the frame title and the carousel position. */
  label: string;
  /** One line under the frame explaining what the state shows. */
  caption: string;
};

export type Product = {
  id: string;
  /** Eyebrow index — rendered before the name. */
  index: string;
  name: string;
  /** What the product is, in one line. */
  positioning: string;
  /** Who it is built for. */
  audience: string;
  /** The problem it removes, then the value it gives back. */
  description: string;
  /** Three capability labels — no more. */
  capabilities: [string, string, string];
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
    positioning: 'One connected selling and operations platform.',
    audience: 'For retail, hardware, tiles, clothing and restaurant businesses.',
    description:
      'Selling, stock and back-office reporting usually run in separate systems. AxloPOS keeps the counter, the stockroom and the owner’s dashboard on one connected platform.',
    capabilities: ['Sales & Payments', 'Inventory', 'Operational Visibility'],
    signals: ['Live inventory', 'QuickBooks connected', 'Tablet ready'],
    cta: {
      label: 'Explore AxloPOS',
      href: 'https://www.axlopos.com/',
      external: true,
      ariaLabel: 'Explore the AxloPOS website',
    },
    states: [
      {
        id: 'pos-checkout',
        label: 'POS checkout',
        caption:
          'Product grid and a fixed cart: search, add, adjust quantities and apply discounts without leaving the till.',
      },
      {
        id: 'pos-payment',
        label: 'Payment',
        caption:
          'Split across cash, card and wallet, with change due calculated as the amount tendered is entered.',
      },
      {
        id: 'pos-dashboard',
        label: 'Business dashboard',
        caption:
          'Daily takings, best sellers, low-stock alerts and accounting sync status from one operational summary.',
      },
    ],
  },
];
