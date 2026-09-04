import type { Metadata } from 'next';
import { products } from '@/content/products';
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
 * `SoftwareApplication` for the two products.
 *
 * Only fields we can actually stand behind are emitted. Notably absent:
 * `aggregateRating`, `review` and `offers` — Google treats all three as
 * eligible for rich results, so publishing invented values would be both a
 * false claim and a structured-data violation. `url` appears only where a
 * confirmed public address exists.
 */
export function productSchemas() {
  return products.map((product) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    // Positioning is optional; joining a missing one would emit "undefined ..."
    // into structured data.
    description: [product.positioning, product.description].filter(Boolean).join(' '),
    featureList: product.capabilities,
    publisher: { '@type': 'Organization', name: site.name, url: site.url },
    ...(product.cta.href ? { url: product.cta.href } : {}),
  }));
}
