/**
 * Solutions content — the services layer.
 *
 * THE BRAND RULE THIS FILE EXISTS TO ENFORCE (brief §13):
 * Odoo and QuickBooks are **not** Axlo products. They are third-party
 * platforms Axlo implements, integrates, optimises and supports. Every entry
 * here carries an explicit `vendor` field: when it is set, the UI labels the
 * solution as a partner platform and the copy is constrained to implementation
 * language. Owned products live in content/products and are presented
 * differently on purpose, so a visitor can never mistake one layer for the
 * other.
 */

export type Solution = {
  id: string;
  /** URL segment under /solutions. */
  slug: string;
  index: string;
  name: string;
  /** One-line positioning. */
  positioning: string;
  /** What this covers, in a sentence or two. */
  description: string;
  /** Everything included. Rendered as the capability map. */
  capabilities: string[];
  /**
   * The third-party platform this service implements, where there is one.
   * Set = partner platform (never presented as Axlo-owned). Unset = an Axlo
   * engineering discipline.
   */
  vendor?: string;
  /** Who this is for. */
  audience: string;
};

export const solutions: Solution[] = [
  {
    id: 'odoo',
    slug: 'odoo',
    index: '01',
    name: 'Odoo ERP',
    vendor: 'Odoo',
    positioning: 'Flexible ERP. Implemented around your business.',
    description:
      'Axlo implements, integrates and supports Odoo ERP. We configure the platform around how the business already runs, migrate what exists today, and stay with it after go-live.',
    audience: 'For businesses standardising finance, sales, inventory, purchasing, manufacturing or HR on one ERP.',
    capabilities: [
      'Odoo consulting',
      'Implementation',
      'Finance / Accounting',
      'Sales / CRM',
      'Inventory',
      'Purchase',
      'Manufacturing',
      'HR',
      'Migration',
      'Integration',
      'Training',
      'Support & optimisation',
    ],
  },
  {
    id: 'quickbooks',
    slug: 'quickbooks',
    index: '02',
    name: 'QuickBooks Implementation',
    vendor: 'QuickBooks',
    positioning: 'Make QuickBooks work for your business.',
    description:
      'Axlo sets up, migrates and integrates QuickBooks so the accounting system reflects the business rather than the other way round — then trains the team that has to use it.',
    audience: 'For finance teams moving onto QuickBooks, or getting more out of an existing installation.',
    capabilities: [
      'Setup and configuration',
      'Chart of accounts',
      'Migration',
      'Opening balances',
      'Financial reporting',
      'User and permissions',
      'Workflow configuration',
      'Integration',
      'Training',
      'Ongoing support',
    ],
  },
  {
    id: 'erp-business-systems',
    slug: 'erp-business-systems',
    index: '03',
    name: 'ERP & Business Systems',
    positioning: 'The right platform, configured around the real workflow.',
    description:
      'Platform selection, implementation and optimisation across enterprise business systems — including, but not limited to, the platforms above. The work starts with the operation, not the software.',
    audience: 'For businesses choosing, replacing or consolidating core business systems.',
    capabilities: [
      'Platform evaluation',
      'Requirements analysis',
      'Implementation planning',
      'Data migration',
      'Process configuration',
      'Change management',
      'User training',
      'Post-launch optimisation',
    ],
  },
  {
    id: 'ai-automation',
    slug: 'ai-automation',
    index: '04',
    name: 'AI & Automation',
    positioning: 'Use AI where it creates measurable operational value.',
    description:
      'We apply AI to specific, repetitive, high-volume work where the benefit can be measured — document handling, reporting, routing and process steps that currently consume people’s time.',
    audience: 'For teams with manual processes that scale badly.',
    capabilities: [
      'AI assistants',
      'Workflow automation',
      'Document intelligence',
      'Reporting automation',
      'Process optimisation',
    ],
  },
  {
    id: 'system-integration',
    slug: 'system-integration',
    index: '05',
    name: 'System Integration',
    positioning: 'Connect the systems that keep the business moving.',
    description:
      'ERP, accounting, point-of-sale and in-house systems that hold different versions of the same truth. Integration work makes them agree, continuously, without manual re-entry.',
    audience: 'For businesses running several systems that do not talk to each other.',
    capabilities: [
      'ERP integration',
      'Accounting integration',
      'POS integration',
      'API development',
      'Data synchronisation',
    ],
  },
  {
    id: 'custom-software',
    slug: 'custom-software',
    index: '06',
    name: 'Custom Software & Product Engineering',
    positioning: 'Build technology around the actual business workflow.',
    description:
      'Where no platform fits, we design and build the product — web, mobile or internal — and keep engineering it after launch rather than handing over and leaving.',
    audience: 'For businesses whose operation does not fit an off-the-shelf system.',
    capabilities: [
      'Web applications',
      'Mobile applications',
      'SaaS platforms',
      'Internal business systems',
      'MVP / prototypes',
      'Long-term product engineering',
    ],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((solution) => solution.slug === slug);
}

/** Partner platforms — surfaced separately from Axlo-owned products. */
export const partnerSolutions = solutions.filter((solution) => solution.vendor);

/** Axlo engineering disciplines — no third-party vendor attached. */
export const engineeringSolutions = solutions.filter((solution) => !solution.vendor);
