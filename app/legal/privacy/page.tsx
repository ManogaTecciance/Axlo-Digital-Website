import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { privacySections } from '@/content/legal';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Privacy Policy', href: '/legal/privacy' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Privacy Policy',
  description:
    'How Axlo Digital handles information you send through this website: what is collected, what is not, how it is used, and how to ask for it to be removed.',
  path: '/legal/privacy',
});

export default function PrivacyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />
      <LegalPage
        eyebrow="Legal"
        title="Privacy Policy"
        lead="What this website collects, what it does not, and what happens to anything you send us. Items marked pending need input from Axlo Digital or its legal adviser before launch."
        trail={trail}
        sections={privacySections}
      />
    </>
  );
}
