import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { cookieSections } from '@/content/legal';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Cookie Policy', href: '/legal/cookies' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Cookie Policy',
  description:
    'This site sets no tracking, advertising or analytics cookies. The one item stored in your browser is your reduced-motion preference, documented here in full.',
  path: '/legal/cookies',
});

export default function CookiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />
      <LegalPage
        eyebrow="Legal"
        title="Cookie Policy"
        lead="No tracking, advertising or analytics cookies are set by this site. What is stored, and what would change if analytics is added later."
        trail={trail}
        sections={cookieSections}
      />
    </>
  );
}
