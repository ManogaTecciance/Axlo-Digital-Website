import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/** Single-page site — the homepage is the only route. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
