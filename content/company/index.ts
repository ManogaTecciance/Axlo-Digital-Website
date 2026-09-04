/* Company-level content: the four connected delivery stages, the reasons to
   choose Axlo, the corporate story, and the proof framework.

   CONTENT POLICY (brief §18, §24)
   Customer logos, testimonials, metrics, case studies and leadership bios are
   all things this file could easily invent and must not. Where the client has
   not supplied approved content, the export is an EMPTY LIST plus the shape
   the content will take — the UI renders the framework and says plainly that
   entries are pending. An empty array here is a deliberate, load-bearing
   value, not an oversight. */

export type Stage = {
  id: string;
  index: string;
  name: string;
  summary: string;
  /** Optional supporting line — omitted keeps the "How we work" band compact. */
  detail?: string;
};

/** How we work — four concise, connected stages. */
export const brandStages: Stage[] = [
  {
    id: 'think',
    index: '01',
    name: 'Think',
    summary: 'Understand the business, users, workflows, and opportunity.',
    detail:
      'We start with how the operation actually runs today — including the spreadsheets and workarounds — before proposing anything.',
  },
  {
    id: 'design',
    index: '02',
    name: 'Design',
    summary: 'Turn complexity into clear flows, prototypes, and systems.',
    detail:
      'Journeys, interfaces and a design system, tested as prototypes before they become engineering work.',
  },
  {
    id: 'build',
    index: '03',
    name: 'Build',
    summary: 'Develop reliable, scalable, responsive digital products.',
    detail:
      'Engineering with the integrations, performance and security the business will depend on in production.',
  },
  {
    id: 'evolve',
    index: '04',
    name: 'Evolve',
    summary: 'Measure, support, improve, and scale over time.',
    detail:
      'Support and continuous improvement after launch, because an operational system is never finished.',
  },
];

/**
 * The trust strip.
 *
 * Every entry is a workflow the Axlo product portfolio visibly handles — each
 * is checkable against the product pages. Nothing here is a claim about a
 * customer, a sector Axlo has shipped into, or a business outcome; those would
 * all be unverifiable, and the brief rules them out.
 */
export const workflowDomains = [
  'Tax compliance',
  'Payroll',
  'Budgeting',
  'Sales and payments',
  'Inventory',
  'Accounting sync',
] as const;

/* ---- The problem the site opens with (brief §6.2) ----------------------- */

/**
 * Before / after. Deliberately concrete: these are the tools a fragmented
 * operation actually runs on, and the connected equivalent.
 */
export const disconnectedSignals = [
  'Spreadsheets emailed back and forth',
  'Approvals living in WhatsApp',
  'Separate systems for sales, stock and finance',
  'Manual re-entry between platforms',
  'Reports assembled by hand each month',
] as const;

export const connectedSignals = [
  'One record, entered once',
  'Approvals recorded in the workflow',
  'Sales, stock and finance in step',
  'Systems synchronised continuously',
  'Reporting off live operational data',
] as const;

/* ---- Why Axlo (brief §16) ----------------------------------------------- */

export type Pillar = {
  id: string;
  index: string;
  name: string;
  summary: string;
};

export const whyAxloPillars: Pillar[] = [
  {
    id: 'business-first',
    index: '01',
    name: 'Business First',
    summary: 'We start with the business problem, not the technology.',
  },
  {
    id: 'product-thinking',
    index: '02',
    name: 'Product Thinking',
    summary: 'We build products designed to evolve, scale and create long-term value.',
  },
  {
    id: 'connected-by-design',
    index: '03',
    name: 'Connected by Design',
    summary: 'We connect people, processes, data and systems.',
  },
  {
    id: 'ai-where-it-matters',
    index: '04',
    name: 'AI Where It Matters',
    summary: 'We apply AI to practical workflows, not simply because it is trending.',
  },
  {
    id: 'built-to-scale',
    index: '05',
    name: 'Built to Scale',
    summary: 'Technology and architecture should support growth.',
  },
  {
    id: 'long-term-partnership',
    index: '06',
    name: 'Long-Term Partnership',
    summary: 'Support and continuous improvement beyond launch.',
  },
];

/* ---- About (brief §17) --------------------------------------------------- */

export const about = {
  headline: 'We build technology around the way businesses actually work.',
  description:
    'Axlo Digital is a technology and digital product company focused on simplifying complex business operations through software, AI and connected digital experiences. We bring together business understanding, product thinking, design, engineering and AI to create technology that delivers practical business outcomes.',
  mission: 'Make complex business operations simpler through technology.',
  vision: 'Build a new generation of connected digital products for businesses everywhere.',
  values: [
    { name: 'Think commercially.', summary: 'Technology decisions are business decisions.' },
    { name: 'Design simply.', summary: 'Complexity belongs in the system, not in the interface.' },
    { name: 'Build responsibly.', summary: 'Reliability, security and maintainability are not optional extras.' },
    { name: 'Improve continuously.', summary: 'The work continues after launch.' },
  ],
} as const;

/**
 * Leadership.
 *
 * EMPTY BY POLICY. Brief §17 asks for professional photographs and concise
 * bios, and adds "use only approved company information" — so names, roles,
 * photographs and biographies must come from the client. The About page
 * renders the section with a visible pending note until entries are supplied.
 */
export type Leader = {
  id: string;
  name: string;
  role: string;
  bio: string;
  /** Path under /public. */
  photo?: string;
};

export const leadership: Leader[] = [];

/** What the client needs to supply for each leadership entry. */
export const leadershipRequirements = [
  'Full name and role',
  'Two- to three-sentence biography',
  'Professional photograph (square, minimum 800×800)',
  'Approval to publish',
] as const;

/* ---- Proof and case studies (brief §18) ---------------------------------- */

/**
 * The case-study shape from brief §18, in order. The framework ships; the
 * entries do not, because publishing an invented client story is the single
 * most damaging thing this site could do.
 */
export type CaseStudy = {
  id: string;
  slug: string;
  client: string;
  industry: string;
  problem: string;
  existingProcess: string;
  solution: string;
  approach: string;
  result: string;
  technology: string[];
  quote?: { text: string; attribution: string };
};

export const caseStudies: CaseStudy[] = [];

/** The nine-part structure a case study must fill, shown on /case-studies. */
export const caseStudyStructure = [
  { step: '01', name: 'Client / industry', detail: 'Named only with written permission.' },
  { step: '02', name: 'Business problem', detail: 'The operational problem in the client’s own terms.' },
  { step: '03', name: 'Existing process', detail: 'How the work was done before — systems, handovers, manual steps.' },
  { step: '04', name: 'Axlo solution', detail: 'What was designed and built, and what it replaced.' },
  { step: '05', name: 'Implementation approach', detail: 'Phasing, migration, training and go-live.' },
  { step: '06', name: 'Result / measurable impact', detail: 'Verified figures only — never estimated or illustrative.' },
  { step: '07', name: 'Technology / integrations', detail: 'Platforms, systems and integration points.' },
  { step: '08', name: 'Client quote', detail: 'Attributed accurately and approved before publication.' },
  { step: '09', name: 'Call to action', detail: 'The next step for a reader with the same problem.' },
] as const;

/** Proof assets the client must supply and approve before launch. */
export const proofRequirements = [
  'Customer logos, with written permission to publish',
  'Verified company and product metrics',
  'Client testimonials, approved and accurately attributed',
  'Before / after workflow stories',
  'Case studies with measurable outcomes',
  'Leadership credentials',
  'Technology and integration experience',
] as const;
