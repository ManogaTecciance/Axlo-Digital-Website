import type { Metadata } from 'next';
import { products, type Product } from '@/content/products';
import type { Solution } from '@/content/solutions';
import { site } from './site';

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /**
   * Optional OG image path relative to the site root. Left undefined for the
   * homepage so Next's file-based `app/opengraph-image.tsx` supplies it — the
   * previous default pointed at an SVG, which Facebook, LinkedIn, X and Slack
   * all decline to render.
   */
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  type = 'website',
  publishedTime,
}: PageMetaInput): Metadata {
  const url = `${site.url}${path === '/' ? '' : path}`;
  const fullTitle = path === '/' ? site.seoTitle : `${title} · ${site.name}`;
  const images = image
    ? [{ url: `${site.url}${image}`, width: 1200, height: 630, alt: `${title} — ${site.name}` }]
    : undefined;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: 'en',
      ...(images ? { images } : {}),
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(image ? { images: [`${site.url}${image}`] } : {}),
    },
  };
}

/* --------------------------------------------------------------------------
   Structured data. Every builder emits only facts we actually hold — no
   invented ratings, addresses, employee counts or founding dates.
   -------------------------------------------------------------------------- */

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: site.url,
    email: site.email,
    slogan: site.tagline,
    description: site.description,
    logo: `${site.url}/brand/axlo-logo-light.svg`,
    ...(site.social.length > 0 ? { sameAs: site.social.map((s) => s.href) } : {}),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
  };
}

/**
 * `BreadcrumbList` for a secondary page.
 *
 * Mirrors the visible breadcrumb trail rendered by `PageHero`, which is the
 * condition Google states for using it — the markup must describe a trail the
 * page actually shows.
 */
export function breadcrumbSchema(trail: Array<{ label: string; href: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${site.url}${crumb.href === '/' ? '' : crumb.href}`,
    })),
  };
}

/**
 * `Article` for an insight.
 *
 * `author` is emitted as a Person because that is what the content model
 * holds. No `image` is emitted unless one exists — Google would rather have
 * the field absent than pointing at nothing.
 */
export function articleSchema(article: {
  title: string;
  summary: string;
  slug: string;
  publishedAt: string;
  author: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: article.author },
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
      logo: `${site.url}/brand/axlo-logo-light.svg`,
    },
    mainEntityOfPage: `${site.url}/insights/${article.slug}`,
  };
}

/**
 * `SoftwareApplication` for the product portfolio.
 *
 * Only fields we can actually stand behind are emitted. Notably absent:
 * `aggregateRating`, `review` and `offers` — Google treats all three as
 * eligible for rich results, so publishing invented values would be both a
 * false claim and a structured-data violation. `url` appears only where a
 * confirmed public address exists.
 */
export function productSchemas() {
  return products.map((product) => productSchema(product));
}

/** One product's `SoftwareApplication`, used by its own page. */
export function productSchema(product: Product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: `${product.positioning} ${product.description}`,
    featureList: product.modules,
    url: `${site.url}/products/${product.slug}`,
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    ...(product.cta.external && product.cta.href ? { sameAs: [product.cta.href] } : {}),
  };
}

/**
 * `Service` for a solution page.
 *
 * A partner platform is described as a service Axlo *provides in relation to*
 * that platform — never as software Axlo publishes. `provider` is always Axlo;
 * the vendor appears only in the service name and description. This is the
 * structured-data half of the brand rule in brief section 13.
 */
export function serviceSchema(solution: Solution) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: solution.vendor ? `${solution.name} implementation and support` : solution.name,
    serviceType: solution.name,
    description: solution.description,
    provider: { '@type': 'Organization', name: site.name, url: site.url },
    url: `${site.url}/solutions/${solution.slug}`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${solution.name} capabilities`,
      itemListElement: solution.capabilities.map((capability) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: capability },
      })),
    },
  };
}
