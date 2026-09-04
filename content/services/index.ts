/**
 * Capability content — the four areas of "What we do".
 *
 * The brief (§6.3 and §7) sets four areas, not three: Strategy, Experience,
 * Technology & AI, and Operations. Each carries the full deliverable list for
 * the What We Do page, plus three `facets` — the shortlist the homepage card
 * shows so the section stays scannable rather than becoming a service
 * catalogue on the front page.
 */

export type ServiceCategory = {
  id: string;
  index: string;
  title: string;
  /** The one-line promise, used as the heading on the What We Do page. */
  promise: string;
  description: string;
  /** Three keywords under the description on the homepage — scannable, not a list. */
  facets: [string, string, string];
  /** The full deliverable list, shown on /what-we-do. */
  deliverables: string[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'strategy',
    index: '01',
    title: 'Strategy',
    promise: 'Understand the business before building the technology.',
    description:
      'We map how the operation actually runs, then decide what is worth building — and in what order.',
    facets: ['Product Strategy', 'Process Analysis', 'Product Roadmaps'],
    deliverables: [
      'Product Strategy',
      'Business Process Analysis',
      'Digital Transformation',
      'Product Roadmaps',
    ],
  },
  {
    id: 'experience',
    index: '02',
    title: 'Experience',
    promise: 'Make complexity feel simple and usable.',
    description:
      'Complex operations do not need complex interfaces. We design the journey, prove it as a prototype, and systematise it.',
    facets: ['UX/UI Design', 'User Journeys', 'Design Systems'],
    deliverables: ['UX/UI Design', 'User Journeys', 'Design Systems', 'Prototyping'],
  },
  {
    id: 'technology-ai',
    index: '03',
    title: 'Technology & AI',
    promise: 'Build reliable, scalable technology with practical AI.',
    description:
      'Engineering that holds up in production, with AI applied where it measurably removes work.',
    facets: ['SaaS Development', 'AI Integration', 'System Integration'],
    deliverables: [
      'SaaS Development',
      'Web & Mobile Applications',
      'AI Integration',
      'API & System Integration',
      'Cloud / Architecture',
    ],
  },
  {
    id: 'operations',
    index: '04',
    title: 'Operations',
    promise: 'Turn software into measurable business advantage.',
    description:
      'The system has to keep earning its place: automated where it should be, measured, and improved after launch.',
    facets: ['Workflow Automation', 'Analytics', 'Product Evolution'],
    deliverables: [
      'Workflow Automation',
      'Business Systems',
      'Analytics',
      'Product Evolution',
      'Support & Optimisation',
    ],
  },
];
