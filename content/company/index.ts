/* Company-level content: the four connected delivery stages, and the business
   workflows the products on this page actually handle. */

export type Stage = {
  id: string;
  index: string;
  name: string;
  summary: string;
  /** Optional supporting line — omitted keeps the "How we work" band compact. */
  detail?: string;
};

/** Section 04 — How we work. Four concise, connected stages. */
export const brandStages: Stage[] = [
  {
    id: 'think',
    index: '01',
    name: 'Think',
    summary: 'Understand the business, users, workflows, and opportunity.',
  },
  {
    id: 'design',
    index: '02',
    name: 'Design',
    summary: 'Turn complexity into clear flows, prototypes, and systems.',
  },
  {
    id: 'build',
    index: '03',
    name: 'Build',
    summary: 'Develop reliable, scalable, responsive digital products.',
  },
  {
    id: 'evolve',
    index: '04',
    name: 'Evolve',
    summary: 'Measure, support, improve, and scale over time.',
  },
];

/**
 * The trust strip.
 *
 * Every entry is a workflow one of the two products on this page visibly
 * handles — each is checkable against the Comply360 views and the two AxloPOS
 * screenshots further up, or against the approved AxloPOS description. Nothing
 * here is a claim about a customer, a sector Axlo has shipped into, or a
 * business outcome; those would all be unverifiable, and the brief rules them
 * out.
 *
 * "Accounting sync" was the sixth entry and has been withdrawn. It was
 * checkable only against the composed AxloPOS dashboard's "Connected systems"
 * card, and that composition has been replaced by real screenshots which show
 * no such thing. Left in place it would assert an accounting integration from
 * a strip whose whole premise is that every line can be verified by scrolling
 * up. See blocker R3.
 */
export const workflowDomains = [
  'Tax compliance',
  'Sales and payments',
  'Inventory',
  'Customers',
  'Suppliers',
  'Reporting',
] as const;
