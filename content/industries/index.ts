/**
 * Industries content.
 *
 * Brief §15 sets the shape of an industry page: common problems → relevant
 * Axlo products/solutions → example workflows → integration needs → CTA. Each
 * entry below carries exactly those five things, so the page template has no
 * per-industry special cases.
 *
 * `products` and `solutions` hold ids from content/products and
 * content/solutions. They are resolved at render time rather than duplicated,
 * so a product renamed in one place cannot go stale here.
 *
 * Nothing in this file claims Axlo has delivered into a sector. These are the
 * operational problems each industry has and the software that addresses them
 * — not a client list by another name.
 */

export type Industry = {
  id: string;
  slug: string;
  index: string;
  name: string;
  /** One-line framing of the sector's core operational tension. */
  positioning: string;
  /** The problems this sector recognises. */
  problems: string[];
  /** Product ids from content/products that apply. */
  products: string[];
  /** Solution ids from content/solutions that apply. */
  solutions: string[];
  /** Example end-to-end workflows the connected system would carry. */
  workflows: string[];
  /** What typically has to be integrated. */
  integrations: string[];
};

export const industries: Industry[] = [
  {
    id: 'retail',
    slug: 'retail',
    index: '01',
    name: 'Retail',
    positioning: 'Selling, stock and finance have to agree by the end of the day.',
    problems: [
      'Stock on the system does not match stock on the shelf.',
      'Branch performance is only visible after month end.',
      'Sales, purchasing and accounting are re-keyed by hand.',
      'Reordering is driven by memory rather than by what sold.',
    ],
    products: ['axlopos', 'axlo-budget'],
    solutions: ['quickbooks', 'system-integration', 'erp-business-systems'],
    workflows: [
      'Sale at the till reduces branch stock and posts to accounts the same day.',
      'Low stock triggers a purchase order against the right supplier.',
      'Goods received update inventory, costs and payables in one movement.',
      'Daily takings reconcile against banking without a spreadsheet.',
    ],
    integrations: ['Accounting', 'Payments', 'Inventory', 'Multi-branch reporting'],
  },
  {
    id: 'manufacturing',
    slug: 'manufacturing',
    index: '02',
    name: 'Manufacturing',
    positioning: 'Production, materials and cost need to be one number, not three.',
    problems: [
      'Material availability is confirmed after the job is scheduled.',
      'Job costing is reconstructed after the fact.',
      'Production, purchasing and finance work from different data.',
      'Capacity is planned in spreadsheets that nobody else can see.',
    ],
    products: ['axlo-budget'],
    solutions: ['odoo', 'erp-business-systems', 'system-integration', 'ai-automation'],
    workflows: [
      'A confirmed order checks materials and reserves them against the job.',
      'Production consumption posts to job cost as it happens.',
      'Purchasing is driven by the production plan rather than by reorder levels.',
      'Budget versus actual reads against real job cost, not estimates.',
    ],
    integrations: ['ERP', 'Inventory', 'Accounting', 'Production scheduling'],
  },
  {
    id: 'distribution',
    slug: 'distribution',
    index: '03',
    name: 'Distribution',
    positioning: 'Margin lives in the gap between what you bought and what you shipped.',
    problems: [
      'Stock sits in several locations with no single view.',
      'Pricing and discount rules differ per customer and live outside the system.',
      'Order-to-invoice involves manual steps at every handover.',
      'Supplier performance is not measured.',
    ],
    products: ['axlopos', 'axlo-budget'],
    solutions: ['odoo', 'system-integration', 'erp-business-systems'],
    workflows: [
      'Order captured once, then picked, shipped and invoiced from the same record.',
      'Multi-location stock visible as one availability figure.',
      'Customer-specific pricing applied automatically at order entry.',
      'Purchase, receipt and payable reconciled against the supplier invoice.',
    ],
    integrations: ['ERP', 'Accounting', 'Warehouse', 'Customer portals'],
  },
  {
    id: 'restaurants-hospitality',
    slug: 'restaurants-hospitality',
    index: '04',
    name: 'Restaurants & Hospitality',
    positioning: 'Service speed at the front, cost control at the back.',
    problems: [
      'Recipe cost and menu price drift apart as supply prices move.',
      'Wastage is noticed at stock count, not when it happens.',
      'Each outlet reports differently.',
      'Shift takings reconcile slowly and late.',
    ],
    products: ['axlopos'],
    solutions: ['quickbooks', 'system-integration', 'ai-automation'],
    workflows: [
      'Order at the counter or table consumes recipe ingredients from stock.',
      'Purchase prices update recipe cost and flag margin below target.',
      'Shift close reconciles cash, card and wallet in one step.',
      'Outlet performance reported on the same measures across sites.',
    ],
    integrations: ['Payments', 'Accounting', 'Inventory', 'Multi-outlet reporting'],
  },
  {
    id: 'professional-services',
    slug: 'professional-services',
    index: '05',
    name: 'Professional Services',
    positioning: 'The work is people, so utilisation and recovery are the business.',
    problems: [
      'Time is captured late and billed later.',
      'Project profitability is known only after invoicing.',
      'Resource planning happens in a spreadsheet.',
      'Client deliverables and approvals are tracked over email.',
    ],
    products: ['axlo-budget', 'axlo-payroll'],
    solutions: ['custom-software', 'ai-automation', 'system-integration'],
    workflows: [
      'Time recorded against the engagement it belongs to, as it is worked.',
      'Work in progress visible before it becomes an invoicing surprise.',
      'Approvals recorded against the deliverable rather than in an inbox.',
      'Payroll cost read against project recovery.',
    ],
    integrations: ['Accounting', 'Payroll', 'Document management', 'Client portals'],
  },
  {
    id: 'finance-accounting',
    slug: 'finance-accounting',
    index: '06',
    name: 'Finance & Accounting',
    positioning: 'Compliance is a deadline calendar, and it does not move.',
    problems: [
      'Obligations, filings and supporting documents live in separate places.',
      'Deadlines are tracked personally rather than institutionally.',
      'Multi-entity work multiplies the same manual process.',
      'Audit questions require reassembling history from email.',
    ],
    products: ['comply360', 'axlo-payroll', 'axlo-budget'],
    solutions: ['quickbooks', 'ai-automation', 'system-integration'],
    workflows: [
      'Every obligation carries an owner, a deadline and its supporting file.',
      'Preparation, review and approval recorded before submission.',
      'Reconciliations checked against the return that will be filed.',
      'Audit trail assembled continuously instead of on request.',
    ],
    integrations: ['Accounting', 'Payroll', 'Document management', 'Filing records'],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}
