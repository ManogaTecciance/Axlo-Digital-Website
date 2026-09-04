export const site = {
  name: 'Axlo Digital',
  legalName: 'Axlo Digital',
  url: 'https://www.axlodigital.com',
  email: 'hello@axlodigital.com',
  tagline: 'Accelerated Experiences. Linked Operations.',
  /** The approved page title. Distinct from the brand tagline. */
  seoTitle: 'Axlo Digital — Connected Technology for Real Business Operations',
  /** Master positioning line (brief §3). */
  positioning: 'Connected technology for the way your business works.',
  primaryMessage: 'We build digital products that make complex business operations simple.',
  secondaryMessage:
    'We design, build and evolve digital products that connect people, processes, data and systems—helping businesses operate smarter and grow with confidence.',
  description:
    'Axlo Digital combines business thinking, product design, software engineering and AI to create connected digital platforms that help businesses operate smarter, faster and with greater control.',
  /**
   * Social profiles are intentionally empty. Add entries only when real,
   * verified URLs are supplied — the footer renders nothing otherwise.
   */
  social: [] as Array<{ label: string; href: string }>,
} as const;

/**
 * Multi-page architecture.
 *
 * The site was a single scrolling document; the brief (§4, §5, §22) replaces
 * that with a real route hierarchy. `href` is now a path, not a hash, and the
 * header marks the active item from `usePathname()` rather than a scroll
 * observer.
 *
 * The homepage still has named sections, and they still carry ids so
 * `/#products` deep-links work — but no navigation item depends on them.
 */
export type NavItem = {
  label: string;
  href: string;
  description?: string;
  /** Child routes — rendered in the footer and the mobile drawer. */
  children?: Array<{ label: string; href: string }>;
};

export const primaryNav: NavItem[] = [
  {
    label: 'What We Do',
    href: '/what-we-do',
    description: 'Strategy, experience, technology and operations',
  },
  {
    label: 'Products',
    href: '/products',
    description: 'Comply360, Axlo Payroll, Axlo Budget, AxloPOS',
    children: [
      { label: 'Comply360', href: '/products/comply360' },
      { label: 'Axlo Payroll', href: '/products/axlo-payroll' },
      { label: 'Axlo Budget', href: '/products/axlo-budget' },
      { label: 'AxloPOS', href: '/products/axlopos' },
    ],
  },
  {
    label: 'Solutions',
    href: '/solutions',
    description: 'ERP, finance technology, AI and integration',
    children: [
      { label: 'Odoo ERP', href: '/solutions/odoo' },
      { label: 'QuickBooks', href: '/solutions/quickbooks' },
      { label: 'ERP & Business Systems', href: '/solutions/erp-business-systems' },
      { label: 'AI & Automation', href: '/solutions/ai-automation' },
      { label: 'System Integration', href: '/solutions/system-integration' },
      { label: 'Custom Software', href: '/solutions/custom-software' },
    ],
  },
  {
    label: 'Industries',
    href: '/industries',
    description: 'Where these systems are put to work',
  },
  {
    label: 'Why Axlo',
    href: '/why-axlo',
    description: 'How we think about building technology',
  },
  {
    label: 'About',
    href: '/about',
    description: 'The company, mission and leadership',
  },
  {
    label: 'Insights',
    href: '/insights',
    description: 'Writing on operations, AI and finance technology',
  },
];

/**
 * The homepage's own sections.
 *
 * Used for in-page anchors and the homepage-only scroll spy. These are not
 * navigation destinations any more — the header lists routes.
 */
export const homeSectionIds = [
  'home',
  'problem',
  'capabilities',
  'products',
  'erp-finance',
  'why-axlo',
  'how-we-work',
  'proof',
  'contact',
] as const;
export type HomeSectionId = (typeof homeSectionIds)[number];

/** Footer legal links — real pages now, no longer placeholders. */
export const legalNav: Array<{ label: string; href: string }> = [
  { label: 'Privacy Policy', href: '/legal/privacy' },
  { label: 'Terms of Service', href: '/legal/terms' },
  { label: 'Cookie Policy', href: '/legal/cookies' },
];

/**
 * Footer company column — the pages that are neither a product nor a solution.
 */
export const companyNav: Array<{ label: string; href: string }> = [
  { label: 'About', href: '/about' },
  { label: 'Why Axlo', href: '/why-axlo' },
  { label: 'Industries', href: '/industries' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Footer product column.
 *
 * Every product now has a page on this site, so each entry is an internal
 * route. AxloPOS additionally has a confirmed public product site, which the
 * product page itself links out to — the footer stays internal so the column
 * behaves consistently.
 */
export const productNav: Array<{ label: string; href: string }> = [
  { label: 'Comply360', href: '/products/comply360' },
  { label: 'Axlo Payroll', href: '/products/axlo-payroll' },
  { label: 'Axlo Budget', href: '/products/axlo-budget' },
  { label: 'AxloPOS', href: '/products/axlopos' },
];

/** Footer solutions column. */
export const solutionNav: Array<{ label: string; href: string }> = [
  { label: 'Odoo ERP', href: '/solutions/odoo' },
  { label: 'QuickBooks', href: '/solutions/quickbooks' },
  { label: 'ERP & Business Systems', href: '/solutions/erp-business-systems' },
  { label: 'AI & Automation', href: '/solutions/ai-automation' },
  { label: 'System Integration', href: '/solutions/system-integration' },
  { label: 'Custom Software', href: '/solutions/custom-software' },
];

/**
 * The one conversion action, worded once.
 *
 * The brief (§4) names it: "Talk to Axlo", visible throughout the site. Every
 * primary CTA reads from here rather than authoring its own label, which is
 * how the site previously ended up with three names for one action.
 */
export const primaryCta = {
  label: 'Talk to Axlo',
  href: '/contact',
} as const;

/** The secondary hero action (brief §6.1). */
export const secondaryCta = {
  label: 'Explore Our Products',
  href: '/products',
} as const;

/** Mailto fallback, used where the contact form cannot be delivered. */
export const contactMailto = `mailto:${site.email}?subject=${encodeURIComponent(
  'Enquiry for Axlo Digital',
)}`;

/**
 * Enquiry subjects for the contact form (brief §20).
 *
 * Shared between the form control and the server-side validator, so the
 * accepted values can never drift from the offered ones.
 */
export const enquirySubjects = [
  'Build a digital product',
  'Automate a process',
  'AI solution',
  'System integration',
  'Comply360',
  'Axlo Payroll',
  'Axlo Budget',
  'AxloPOS',
  'Odoo ERP',
  'QuickBooks',
  'ERP / business systems',
  'Digital transformation',
  'Other',
] as const;
export type EnquirySubject = (typeof enquirySubjects)[number];

/** Preferred contact methods offered on the form. */
export const contactMethods = ['Email', 'Phone', 'Either'] as const;
export type ContactMethod = (typeof contactMethods)[number];
