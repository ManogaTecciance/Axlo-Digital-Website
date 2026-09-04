import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { termsSections } from '@/content/legal';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Terms of Service', href: '/legal/terms' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Terms of Service',
  description:
    'The terms governing use of the Axlo Digital website, including product information, third-party platforms, intellectual property and liability.',
  path: '/legal/terms',
});

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />
      <LegalPage
        eyebrow="Legal"
        title="Terms of Service"
        lead="These terms cover this website. Work carried out by Axlo Digital is governed by the agreement signed for that engagement. Items marked pending need legal review before launch."
        trail={trail}
        sections={termsSections}
      />
    </>
  );
}
