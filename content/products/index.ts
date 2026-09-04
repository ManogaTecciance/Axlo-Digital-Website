/**
 * Product content — the four Axlo Digital products.
 *
 * CONTENT POLICY
 * No customer names, statistics, testimonials, awards, user counts, revenue
 * figures or business outcomes appear here. Every line describes what the
 * software does, who it is built for, and which problem it removes — never
 * what it has achieved for anyone. Section 24 of the brief ("Content & Brand
 * Governance") makes this a hard rule, not a preference.
 *
 * Every product carries the same shape, so none can drift into being the
 * better-presented one: positioning, audience, the problem and the value,
 * capabilities, feature groups and modules for its own page.
 *
 * `states` is the exception: it is present only where the product has real
 * composed UI to show (see components/product-demo). Comply360 and AxloPOS
 * have interfaces built; Axlo Payroll and Axlo Budget do not, and inventing
 * screenshots for them would be exactly the fabricated proof the brief rules
 * out. Their cards render the module map instead.
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

/** A named group of related capabilities on a product page. */
export type FeatureGroup = {
  name: string;
  summary: string;
};

export type Product = {
  id: string;
  /** URL segment under /products. */
  slug: string;
  /** Eyebrow index — rendered before the name. */
  index: string;
  name: string;
  /** What the product is, in one line. */
  positioning: string;
  /** The product page's h1 — the brief authors this per product. */
  headline: string;
  /** Who it is built for. */
  audience: string;
  /** The problem it removes, then the value it gives back. */
  description: string;
  /** Three capability labels for the card — no more. */
  capabilities: [string, string, string];
  /** Every module the product covers. Drives the product page module map. */
  modules: string[];
  /** Optional workflow spine, rendered as a connected sequence. */
  workflow?: string[];
  /** Optional named feature groups for the product page. */
  featureGroups?: FeatureGroup[];
  /** Small operational facts about the product. Omitted where none apply. */
  signals?: string[];
  /**
   * A constraint the client must keep current after launch. Rendered as a
   * visible note on the product page rather than buried in a code comment —
   * brief section 10 asks for exactly this on statutory claims.
   */
  complianceNote?: string;
  cta: {
    label: string;
    /** Absent until a confirmed URL exists — the CTA renders as a placeholder. */
    href?: string;
    /** Present when the link leaves the site. */
    external?: boolean;
    /** Overrides the visible label for assistive technology. */
    ariaLabel?: string;
  };
  /** Composed interface states. Present only where real UI exists. */
  states?: ProductState[];
};

export const products: Product[] = [
  {
    id: 'comply360',
    slug: 'comply360',
    index: '01',
    name: 'Comply360',
    positioning: 'Corporate tax compliance, without the spreadsheet chaos.',
    headline: 'Corporate tax compliance, without the spreadsheet chaos.',
    audience: 'For finance teams and tax practitioners.',
    description:
      'Comply360 gives finance teams a single workspace to manage corporate tax obligations, deadlines, documents, approvals and filing progress.',
    capabilities: ['Filing Visibility', 'Deadline Tracking', 'Compliance Workflow'],
    workflow: ['Track', 'Prepare', 'Review', 'Approve', 'File', 'Audit'],
    modules: [
      'VAT',
      'PAYE / APIT',
      'WHT',
      'Corporate Income Tax',
      'Tax instalments',
      'Filing calendar',
      'Document management',
      'Approval workflow',
      'Reconciliation tracking',
      'Compliance dashboard',
      'Audit trail',
      'Multi-entity management',
    ],
    featureGroups: [
      { name: 'Track', summary: 'Every obligation, its owner and its deadline in one calendar.' },
      { name: 'Prepare', summary: 'Working papers and supporting documents attached to the filing they belong to.' },
      { name: 'Review', summary: 'Reconciliations checked against the return before anyone signs it off.' },
      { name: 'Approve', summary: 'A recorded approval step, so submission is never an individual decision.' },
      { name: 'File', summary: 'Submission tracked to completion with its reference retained.' },
      { name: 'Audit', summary: 'A full history of who changed what, and when, for every entity.' },
    ],
    complianceNote:
      'Statutory and tax references shown in this product must be reviewed against the rules in force at launch, and kept current afterwards.',
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
    id: 'axlo-payroll',
    slug: 'axlo-payroll',
    index: '02',
    name: 'Axlo Payroll',
    positioning: 'Payroll without the spreadsheet headache.',
    headline: 'Payroll without the spreadsheet headache.',
    audience: 'For HR, finance and management teams.',
    description:
      'A modern payroll platform designed to simplify salary processing, employee records, statutory calculations, approvals and payroll reporting.',
    capabilities: ['Payroll Processing', 'Statutory Calculations', 'Approval Workflow'],
    workflow: ['Record', 'Calculate', 'Approve', 'Pay', 'Report'],
    modules: [
      'Employee master',
      'Payroll processing',
      'EPF / ETF',
      'APIT',
      'Salary advances',
      'Loans',
      'Overtime',
      'Leave integration',
      'Attendance integration',
      'Payslips',
      'Payroll reports',
      'Approval workflows',
      'Accounting integration',
    ],
    featureGroups: [
      { name: 'Employee records', summary: 'One master record per employee, feeding every run.' },
      { name: 'Statutory handling', summary: 'EPF, ETF and APIT calculated as part of the run, not alongside it.' },
      { name: 'Variable pay', summary: 'Advances, loans and overtime applied against the right period.' },
      { name: 'Approvals', summary: 'A payroll run is reviewed and approved before anything is disbursed.' },
      { name: 'Reporting', summary: 'Payslips and payroll reports produced from the same figures that were approved.' },
    ],
    complianceNote:
      'Statutory rates and thresholds (EPF, ETF, APIT) must be verified against the rules in force at launch, and kept current afterwards.',
    cta: { label: 'Talk to us about Axlo Payroll', href: '/contact' },
  },
  {
    id: 'axlo-budget',
    slug: 'axlo-budget',
    index: '03',
    name: 'Axlo Budget',
    positioning: 'Plan. Control. Forecast.',
    headline: 'Turn your budget into a management system.',
    audience: 'For CFOs, finance teams and management.',
    description:
      'Stop managing budgets across disconnected Excel files. Axlo Budget connects plans, actuals, forecasts and accountability.',
    capabilities: ['Budget vs Actual', 'Rolling Forecasts', 'Approval Workflow'],
    workflow: ['Plan', 'Allocate', 'Approve', 'Track', 'Forecast', 'Act'],
    modules: [
      'Annual budgeting',
      'Budget allocation',
      'Budget vs actual',
      'Rolling forecasts',
      'Scenario planning',
      'Revenue planning',
      'OPEX management',
      'CAPEX budgeting',
      'Headcount budgeting',
      'Approval workflow',
      'Variance commentary',
      'Management dashboard',
      'Multi-company / multi-BU',
      'ERP integration',
    ],
    featureGroups: [
      { name: 'Planning', summary: 'Annual budgets built by revenue, OPEX, CAPEX and headcount.' },
      { name: 'Allocation', summary: 'Budgets distributed to the business units accountable for them.' },
      { name: 'Control', summary: 'Actuals read against plan continuously, not at quarter end.' },
      { name: 'Forecasting', summary: 'Rolling forecasts and scenarios kept beside the original plan.' },
      { name: 'Accountability', summary: 'Variance commentary recorded against the owner of the line.' },
    ],
    cta: { label: 'Talk to us about Axlo Budget', href: '/contact' },
  },
  {
    id: 'axlopos',
    slug: 'axlopos',
    index: '04',
    name: 'AxloPOS',
    positioning: 'More than a POS. Your business operating system.',
    headline: 'More than a POS. Your business operating system.',
    audience: 'For retail, restaurants, hardware, tiles, clothing and other operational businesses.',
    description:
      'Selling, stock and back-office reporting usually run in separate systems. AxloPOS keeps the counter, the stockroom and the owner’s dashboard on one connected platform.',
    capabilities: ['Sales & Payments', 'Inventory', 'Operational Visibility'],
    workflow: ['Sell', 'Track stock', 'Reorder', 'Reconcile', 'Report'],
    modules: [
      'Point of Sale',
      'Payments',
      'Inventory',
      'Purchasing',
      'Customers',
      'Reporting',
      'Accounting integration',
      'Multi-branch',
      'Management dashboard',
    ],
    featureGroups: [
      { name: 'Selling', summary: 'A till that stays fast under load, with payments handled at the counter.' },
      { name: 'Stock', summary: 'Inventory moves as sales happen, so the stockroom matches the shop floor.' },
      { name: 'Purchasing', summary: 'Reordering driven by what actually sold, per branch.' },
      { name: 'Back office', summary: 'Accounting sync and management reporting off the same transaction record.' },
    ],
    /* Integration facts, phrased so they cannot be read as claims about the
       third-party platform itself (brief §13). "Connects to QuickBooks" says
       what AxloPOS does; "QuickBooks connected" reads like a QuickBooks
       feature sitting on an Axlo card. */
    signals: ['Live inventory', 'Connects to QuickBooks', 'Tablet ready'],
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

/** Lookup used by the dynamic product route. */
export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

/** The two products with real composed UI — the homepage showcases these. */
export const showcaseProducts = products.filter((product) => product.states?.length);
