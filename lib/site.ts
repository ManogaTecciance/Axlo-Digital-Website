export const site = {
  name: 'Axlo Digital',
  legalName: 'Axlo Digital',
  url: 'https://www.axlodigital.com',
  email: 'hello@axlodigital.com',
  tagline: 'Accelerated Experiences. Linked Operations.',
  /** The approved page title. Distinct from the brand tagline. */
  seoTitle: 'Axlo Digital — Connected Digital Products for Real Operations',
  primaryMessage: 'Connected technology. Faster business.',
  secondaryMessage:
    'We transform complex ideas and operations into intelligent, connected digital experiences.',
  description:
    'Axlo Digital is a digital product and technology company combining product strategy, experience design, AI, automation and software engineering to build connected digital systems.',
  /**
   * Social profiles are intentionally empty. Add entries only when real,
   * verified URLs are supplied — the footer renders nothing otherwise.
   */
  social: [] as Array<{ label: string; href: string }>,
} as const;

/**
 * Single-page architecture.
 *
 * Every primary destination is a section on the homepage, addressed by hash.
 * `sectionId` is the bare id (no `#`) the scroll-spy observer watches; `href`
 * is the real anchor so navigation still works with JavaScript disabled.
 */
export type NavItem = {
  label: string;
  href: string;
  sectionId: string;
  description?: string;
};

export const primaryNav: NavItem[] = [
  { label: 'Services', href: '#services', sectionId: 'services', description: 'What we do to move businesses forward' },
  { label: 'Products', href: '#products', sectionId: 'products', description: 'Focused products for real operations' },
  { label: 'How We Work', href: '#how-we-work', sectionId: 'how-we-work', description: 'Think, design, build, evolve' },
  { label: 'Contact', href: '#contact', sectionId: 'contact', description: 'Start a project with us' },
];

/** All section ids in document order — the scroll-spy tracks these. */
export const sectionIds = ['home', 'services', 'products', 'how-we-work', 'contact'] as const;
export type SectionId = (typeof sectionIds)[number];

/** Footer legal links — placeholders until real policy pages are supplied. */
export const legalNav: Array<{ label: string; placeholder: boolean }> = [
  { label: 'Privacy', placeholder: true },
  { label: 'Terms', placeholder: true },
];

/**
 * Footer product column.
 *
 * `external` is set only where a confirmed public URL exists. Comply360 has
 * none yet, so it points at the product section on this page rather than
 * becoming a dead link or an invented address.
 *
 * Social profiles would belong in this column too, and none are listed: the
 * brief asks for "other approved profile links", and `site.social` is empty by
 * policy until verified URLs are supplied.
 */
export const productNav: Array<{
  label: string;
  href: string;
  external?: boolean;
  ariaLabel?: string;
  sectionId?: string;
}> = [
  { label: 'Comply360', href: '#products', sectionId: 'products' },
  {
    label: 'AxloPOS',
    href: 'https://www.axlopos.com/',
    external: true,
    ariaLabel: 'Explore the AxloPOS website',
  },
];

/**
 * The one project action, worded once.
 *
 * The header used to say "Start a Project", the hero "Start a project" and the
 * closing section "Start a conversation" — three labels for one thing. Every
 * project CTA on the site now reads from here or repeats this exact string.
 */
export const primaryCta = {
  label: 'Start a project',
  href: '#contact',
  sectionId: 'contact',
} as const;

/** Mailto for the closing CTA, with a ready-made subject line. */
export const contactMailto = `mailto:${site.email}?subject=${encodeURIComponent(
  'Start a project with Axlo Digital',
)}`;
