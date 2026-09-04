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
  /* The description is rendered under the label in the mobile drawer, so it has
     to move with `primaryCta.label` — left as "Start a project with us" it
     would put the retired wording back on screen directly above the button that
     replaced it. */
  { label: 'Contact', href: '#contact', sectionId: 'contact', description: 'Talk to Axlo about your project' },
];

/** All section ids in document order — the scroll-spy tracks these. */
export const sectionIds = ['home', 'services', 'products', 'how-we-work', 'contact'] as const;
export type SectionId = (typeof sectionIds)[number];

/**
 * Footer legal links.
 *
 * INTENTIONALLY EMPTY. `/privacy` and `/terms` exist as internal drafts and are
 * `noindex`, but they are not linked from anywhere on the site: draft legal
 * text must not be reachable by a visitor who could mistake it for the real
 * thing. The previous build showed "Privacy — Coming soon" chips here, which is
 * exactly the kind of unfinished-looking placeholder this release must not
 * publish.
 *
 * Add the two entries back in the same change that lands approved copy.
 */
export const legalNav: Array<{ label: string; href: string }> = [];

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
 *
 * The approved label is **"Talk to Axlo"**, adopted from §4 of the client
 * developer brief, which names it as the single primary conversion CTA. It
 * replaced "Start a project" — a wording that was itself the resolution of the
 * earlier three-label drift, and which nothing now repeats. Changing this line
 * changes the header, the hero and the mobile drawer together; that is the
 * whole point of it living here.
 *
 * The closing section keeps **"Start a conversation"**, and that is correct
 * rather than inconsistent: it opens a mail client, and a button that scrolls
 * must not read identically to one that launches mail.
 */
export const primaryCta = {
  label: 'Talk to Axlo',
  href: '#contact',
  sectionId: 'contact',
} as const;

/** Mailto for the closing CTA, with a ready-made subject line. */
export const contactMailto = `mailto:${site.email}?subject=${encodeURIComponent(
  'Start a project with Axlo Digital',
)}`;
