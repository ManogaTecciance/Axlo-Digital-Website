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
    title: 'Terms of Service',
    description: 'The terms on which Axlo Digital provides this website and its services.',
    path: '/terms',
  }),
  robots: { index: false, follow: false },
};

/**
 * Terms of Service.
 *
 * NOT FINAL LEGAL COPY, AND NOT GENERATED LEGAL COPY.
 *
 * Terms of service are contractual. Drafting them from a template — or from a
 * model — produces text that reads like a contract and holds like nothing at
 * all, which is worse than having no page. Every operative clause here is
 * marked pending.
 *
 * The only substantive statement is the one about the site's content, which is
 * about Axlo's own material and therefore safe to make.
 */
export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms of Service"
      lead="The terms on which Axlo Digital provides this website and its services."
      status="This document is a working draft. It has not been drafted or reviewed by a qualified legal adviser, it is not in force, and it creates no contractual obligation on any party. Services engagements are governed by the individual agreement signed for that work."
      sections={[
        {
          id: 'scope',
          title: 'Scope',
          paragraphs: [
            'These terms would govern use of this website. They do not govern any services engagement — that is covered by the separate written agreement for the specific work.',
          ],
          pending:
            'The relationship between these website terms and Axlo Digital’s services agreements requires legal review.',
        },
        {
          id: 'content',
          title: 'Website content',
          paragraphs: [
            'The text, design, code, product interfaces and brand assets on this website are the property of Axlo Digital unless attributed otherwise.',
            'Product figures shown on this website are demo data or illustrative examples, labelled as such on every frame. They do not represent customer data and are not screenshots of released software unless explicitly identified as such.',
            'Any third-party platform or product name referred to is the trademark of its respective owner. Axlo Digital claims no ownership of, partnership with, or certification from any third-party vendor.',
          ],
        },
        {
          id: 'acceptable-use',
          title: 'Acceptable use',
          pending:
            'Permitted and prohibited uses of this website require legal review.',
        },
        {
          id: 'liability',
          title: 'Liability and disclaimers',
          pending:
            'Limitation of liability, warranty disclaimers and indemnities are the operative clauses of any terms of service. They must be drafted by a qualified legal adviser for the applicable jurisdiction. Nothing is stated here in the interim.',
        },
        {
          id: 'governing-law',
          title: 'Governing law',
          pending:
            'The governing law and jurisdiction require confirmation of Axlo Digital’s registered entity and operating jurisdictions before they can be stated.',
        },
        {
          id: 'contact',
          title: 'Questions about these terms',
          paragraphs: [`Questions can be sent to ${site.email}.`],
        },
      ]}
    />
  );
}
