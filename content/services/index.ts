/**
 * Services content — the three capability areas shown on the homepage.
 *
 * The first release deliberately presents three categories, not six. No
 * deliverable lists, no per-service pages, no "explore this service" links —
 * the section states what Axlo Digital does and keeps moving.
 *
 * Each area carries exactly three capability tags. Four was past the point of
 * scanning: the tags exist so the eye can confirm the description, not so the
 * section can enumerate a service catalogue.
 */

export type ServiceCategory = {
  id: string;
  index: string;
  title: string;
  description: string;
  /** Three keywords under the description — scannable, not a list. */
  facets: [string, string, string];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'strategy-experience',
    index: '01',
    title: 'Strategy & Experience',
    description:
      'We shape product strategies and user experiences around real business operations.',
    facets: ['Product Strategy', 'UX Design', 'Design Systems'],
  },
  {
    id: 'technology-ai',
    index: '02',
    title: 'Technology & AI',
    description:
      'We build reliable, scalable digital products using modern engineering and practical AI.',
    facets: ['Product Engineering', 'AI Integration', 'System Architecture'],
  },
  {
    id: 'products-operations',
    index: '03',
    title: 'Products & Operations',
    description:
      'We create connected digital platforms that simplify everyday business workflows.',
    facets: ['SaaS Platforms', 'Operations Systems', 'Product Evolution'],
  },
];
