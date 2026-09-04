import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

/**
 * INTERNAL DRAFT — NOT PUBLISHED.
 *
 * The route resolves so the draft can be reviewed, but it is `noindex` and no
 * link to it appears anywhere on the site. Draft legal text must not be
 * crawled, indexed, or discoverable by a visitor who could mistake it for the
 * real thing.
 *
 * Restore the footer link and drop `noindex` in the same change that lands
 * approved copy — see `docs/LAUNCH-BLOCKERS.md`.
 */
export const metadata: Metadata = {
  ...pageMetadata({
    title: 'Privacy Policy',
    description: 'How Axlo Digital collects, uses and protects personal information.',
    path: '/privacy',
  }),
  robots: { index: false, follow: false },
};

/**
 * Privacy Policy.
 *
 * NOT FINAL LEGAL COPY, AND NOT GENERATED LEGAL COPY.
 *
 * The sections below describe what this website actually does — which is
 * verifiable from the codebase and therefore safe to state — and mark
 * everything requiring a lawyer's judgement as pending. What is stated here
 * (no analytics installed, no tracking cookies set, no third-party scripts) is
 * true of this build today and is checkable in `lib/analytics.ts` and
 * `app/layout.tsx`.
 *
 * Nothing here constitutes a data-protection notice. Production release stays
 * blocked until reviewed copy is supplied.
 */
export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lead="How Axlo Digital collects, uses and protects personal information."
      status="This document is a working draft. It has not been reviewed or approved by a qualified legal adviser and is not in force. It is published so the site's actual data handling is transparent during development — it is not a data-protection notice, and it should not be relied on."
      sections={[
        {
          id: 'what-this-site-does',
          title: 'What this website currently does',
          paragraphs: [
            'This section describes the technical behaviour of this website as built. It is accurate at the time of writing and checkable against the source code.',
          ],
          bullets: [
            'No analytics platform is installed. No page views, sessions or visitor identifiers are collected or transmitted.',
            'No tracking, advertising or profiling cookies are set by this website.',
            'No third-party scripts run on any page.',
            'Fonts are served from the site’s own origin at build time rather than fetched from a third party at page load.',
            'The only personal information the site receives is what you choose to send in an email using the addresses published on the contact page.',
          ],
        },
        {
          id: 'information-we-collect',
          title: 'Information we collect',
          paragraphs: [
            `When you email ${site.email}, we receive whatever you include in that message — typically your name, your email address, your organisation and the details of your enquiry.`,
          ],
          pending:
            'The full categories of personal data, lawful bases for processing, and the position on data collected through the contact form once it is live all require legal review before this section is complete.',
        },
        {
          id: 'how-we-use-it',
          title: 'How we use it',
          paragraphs: [
            'We use the information you send us to respond to your enquiry and, where a working relationship follows, to deliver and support the services we agree.',
          ],
          pending:
            'Retention periods, the position on marketing communications, and any onward processing require legal review.',
        },
        {
          id: 'sharing',
          title: 'Sharing and third parties',
          pending:
            'This section must list every processor and sub-processor once the contact form’s delivery provider and any CRM are selected. It cannot be written before those decisions are made.',
        },
        {
          id: 'your-rights',
          title: 'Your rights',
          pending:
            'The applicable data-protection regime, the rights it confers, and how to exercise them require legal review and confirmation of the jurisdictions Axlo Digital operates in.',
        },
        {
          id: 'contact',
          title: 'Contacting us about privacy',
          paragraphs: [
            `Until a dedicated data-protection contact is published, privacy enquiries can be sent to ${site.email}.`,
          ],
          pending:
            'A named data-protection contact, the registered company address, and any supervisory-authority details are required before this document can be finalised.',
        },
      ]}
    />
  );
}
