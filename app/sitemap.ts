import type { MetadataRoute } from 'next';
import { getArticles } from '@/content/insights';
import { industries } from '@/content/industries';
import { products } from '@/content/products';
import { solutions } from '@/content/solutions';
import { site } from '@/lib/site';

/**
 * Sitemap.
 *
 * Every entry is derived from the content layer, so a product, solution,
 * industry or article added there appears here without a second edit — which
 * is the only way a sitemap stays correct once a site has this many routes.
 *
 * Priorities describe relative importance within this site, which is all
 * search engines use them for: the homepage and the two conversion surfaces
 * lead, then the portfolio, then supporting pages, then legal.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path === '/' ? '' : path}`;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url('/'), changeFrequency: 'weekly', priority: 1 },
    { url: url('/contact'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/products'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/solutions'), changeFrequency: 'monthly', priority: 0.9 },
    { url: url('/what-we-do'), changeFrequency: 'monthly', priority: 0.8 },
    { url: url('/industries'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/why-axlo'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/about'), changeFrequency: 'monthly', priority: 0.7 },
    { url: url('/case-studies'), changeFrequency: 'monthly', priority: 0.6 },
    { url: url('/insights'), changeFrequency: 'weekly', priority: 0.6 },
    { url: url('/legal/privacy'), changeFrequency: 'yearly', priority: 0.3 },
    { url: url('/legal/terms'), changeFrequency: 'yearly', priority: 0.3 },
    { url: url('/legal/cookies'), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: url(`/products/${product.slug}`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const solutionRoutes: MetadataRoute.Sitemap = solutions.map((solution) => ({
    url: url(`/solutions/${solution.slug}`),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((industry) => ({
    url: url(`/industries/${industry.slug}`),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Empty until articles are supplied; the shape is here so publishing one is
  // a content change rather than a code change.
  const articleRoutes: MetadataRoute.Sitemap = getArticles().map((article) => ({
    url: url(`/insights/${article.slug}`),
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'yearly',
    priority: 0.5,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...solutionRoutes,
    ...industryRoutes,
    ...articleRoutes,
  ].map((entry) => ({ lastModified, ...entry }));
}
