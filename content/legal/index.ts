/**
 * Legal content — Privacy, Terms and Cookies.
 *
 * Brief §23 requires these live before launch, replacing the "Coming soon"
 * placeholders. What follows describes what this website *actually does*,
 * which is the only honest basis for a policy:
 *
 *   • No analytics platform is installed. `lib/analytics.ts` pushes to a
 *     `window.dataLayer` only if something else has already created one.
 *   • The only browser storage is `localStorage['axlo-motion']`, holding the
 *     visitor's reduced-motion preference. It is not a cookie, is not read by
 *     the server, and identifies nobody.
 *   • The contact form collects what the visitor types and sends it to Axlo.
 *
 * Facts only Axlo can supply — registered company details, the operating
 * jurisdiction, the data-protection contact, retention periods — are marked
 * `pending` rather than invented. They render as visible notes on the page, so
 * nobody can mistake an unfilled item for a completed policy.
 *
 * REVIEW REQUIRED: this is drafted from the site's actual behaviour, not legal
 * advice. It needs a qualified review against the applicable jurisdiction
 * before the site goes public.
 */

import type { LegalSection } from '@/components/layout/LegalPage';
import { site } from '@/lib/site';

/** Shown at the top of every policy page. */
export const legalLastReviewed = 'Pending first legal review';

export const privacySections: LegalSection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    paragraphs: [
      `${site.name} operates this website. If you have a question about this policy or about how your information is handled, contact us at ${site.email}.`,
    ],
    pending:
      'Registered company name, company registration number, registered address and operating jurisdiction to be supplied by Axlo Digital.',
  },
  {
    id: 'what-we-collect',
    title: 'What we collect',
    paragraphs: [
      'We collect the information you choose to send us. Nothing on this site asks for information you have not decided to provide.',
    ],
    bullets: [
      'Contact enquiries: your name, company, email address, and — if you supply them — your phone number, preferred contact method, the subject you selected, and the message you wrote.',
      'Technical request data: our hosting provider records standard web-server information such as IP address, browser type and requested page, for security and reliability.',
      'Display preference: whether you have asked this site to reduce motion. This is stored in your own browser and never sent to us.',
    ],
  },
  {
    id: 'what-we-do-not-collect',
    title: 'What we do not collect',
    paragraphs: [
      'This website does not run advertising trackers, does not build visitor profiles, and does not sell or rent personal information to anyone.',
      'At the time of writing, no third-party analytics platform is installed on this site. If one is added, this policy and the cookie policy will be updated before it goes live, and any consent required in your jurisdiction will be requested first.',
    ],
  },
  {
    id: 'how-we-use-it',
    title: 'How we use it',
    bullets: [
      'To reply to your enquiry and to discuss the work you have asked about.',
      'To keep the website secure, available and working correctly.',
      'To meet legal or regulatory obligations where they apply.',
    ],
    paragraphs: [
      'We do not use enquiry information for automated decision-making, and we do not add you to a marketing list because you contacted us.',
    ],
  },
  {
    id: 'sharing',
    title: 'Who we share it with',
    paragraphs: [
      'We share personal information only with service providers who help us operate the site and respond to enquiries — for example our hosting and email providers — and only to the extent they need it to perform that service.',
      'We may disclose information where we are legally required to do so.',
    ],
    pending:
      'The list of processors actually used in production (hosting, email delivery, CRM if any) and their locations to be confirmed and named here.',
  },
  {
    id: 'retention',
    title: 'How long we keep it',
    paragraphs: [
      'We keep enquiry correspondence for as long as needed to deal with your enquiry and any resulting relationship, then delete it.',
    ],
    pending:
      'Specific retention periods to be set by Axlo Digital in line with the applicable jurisdiction.',
  },
  {
    id: 'your-rights',
    title: 'Your rights',
    paragraphs: [
      `You can ask us what personal information we hold about you, ask us to correct it, or ask us to delete it. Write to ${site.email} and we will respond.`,
    ],
    pending:
      'The exact rights available depend on the governing data-protection law. To be confirmed on legal review, along with the supervisory authority you may complain to.',
  },
  {
    id: 'security',
    title: 'Security',
    paragraphs: [
      'The site is served over HTTPS. Form submissions are validated on the server as well as in the browser, and are protected against automated abuse.',
      'No system is perfectly secure, and we do not claim otherwise. Please do not send confidential business information, credentials or financial data through the enquiry form.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    paragraphs: [
      'If this policy changes, the revised version will be published on this page with a new review date.',
    ],
  },
];

export const termsSections: LegalSection[] = [
  {
    id: 'about-these-terms',
    title: 'About these terms',
    paragraphs: [
      `These terms govern your use of this website. By using the site you accept them. If you do not accept them, please do not use the site.`,
      'These terms cover the website only. Work carried out by Axlo Digital is governed by the separate agreement signed for that engagement, which takes precedence over anything on this page.',
    ],
    pending:
      'Governing law and jurisdiction clause to be supplied by Axlo Digital and confirmed on legal review.',
  },
  {
    id: 'use-of-the-site',
    title: 'Use of the site',
    bullets: [
      'You may read, share and link to the content on this site.',
      'You may not attempt to gain unauthorised access to the site or any system behind it.',
      'You may not use the site to distribute malware, send unsolicited messages, or interfere with its operation for others.',
      'You may not scrape or reproduce the site in bulk for commercial purposes without written permission.',
    ],
  },
  {
    id: 'product-information',
    title: 'Product and service information',
    paragraphs: [
      'Product descriptions on this site explain what the software is designed to do. They are not a specification, a warranty, or a contractual commitment.',
      'Screens shown on this site are demonstrations built for illustration. The figures in them are demonstration data and do not represent any real business, customer or result.',
      'Availability, features and pricing may change. Anything you rely on commercially should be confirmed with us in writing.',
    ],
  },
  {
    id: 'third-party-platforms',
    title: 'Third-party platforms',
    paragraphs: [
      'Axlo Digital implements, integrates and supports third-party platforms including Odoo and QuickBooks. Those platforms are the property of their respective owners and are not Axlo Digital products. Their names and trademarks are used only to describe the services we provide in relation to them.',
      'Your use of any third-party platform is governed by that vendor’s own terms, not by these.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual property',
    paragraphs: [
      `The content, design, code and branding of this site belong to ${site.legalName} unless stated otherwise. Product names of other companies belong to those companies.`,
    ],
  },
  {
    id: 'external-links',
    title: 'Links to other sites',
    paragraphs: [
      'This site links to sites we do not control. We are not responsible for their content, availability or practices, and a link is not an endorsement.',
    ],
  },
  {
    id: 'liability',
    title: 'Liability',
    paragraphs: [
      'The site is provided as it is. We take care to keep the information accurate and the site available, but we do not guarantee either.',
    ],
    pending:
      'Limitation-of-liability wording must be drafted to the applicable jurisdiction on legal review. Do not publish this page without it.',
  },
  {
    id: 'contact-terms',
    title: 'Contact',
    paragraphs: [`Questions about these terms can be sent to ${site.email}.`],
  },
];

export const cookieSections: LegalSection[] = [
  {
    id: 'summary',
    title: 'The short version',
    paragraphs: [
      'This site does not currently set any tracking cookies, advertising cookies or analytics cookies.',
      'It stores one item in your browser: your reduced-motion preference. That is a local setting, it identifies nobody, and it is never sent to our servers.',
    ],
  },
  {
    id: 'what-is-stored',
    title: 'What is stored on your device',
    bullets: [
      'axlo-motion — records whether you asked this site to reduce animation. Stored in your browser’s local storage. No expiry; clearing your browser data removes it.',
    ],
    paragraphs: [
      'Because this is a preference you set yourself and it carries no identifier, it does not require consent under the cookie rules we are aware of. It is documented here for transparency.',
    ],
  },
  {
    id: 'strictly-necessary',
    title: 'Strictly necessary cookies',
    paragraphs: [
      'Our hosting provider may set short-lived cookies required to serve the site securely — for example load balancing or abuse prevention. These carry no marketing purpose.',
    ],
    pending:
      'Confirm which strictly-necessary cookies the production hosting and CDN actually set, and list them here.',
  },
  {
    id: 'analytics-and-consent',
    title: 'If analytics is added later',
    paragraphs: [
      'The site is built so an analytics or tag-management platform can be connected without rewriting the pages. None is connected today.',
      'If one is added, this page will be updated before it goes live, the cookies it sets will be listed here, and a consent mechanism will be presented where the applicable law requires one. Analytics will not run before consent is given in jurisdictions that require it.',
    ],
  },
  {
    id: 'managing-cookies',
    title: 'Managing storage in your browser',
    paragraphs: [
      'Every major browser lets you view and clear cookies and site data from its settings. Clearing this site’s data resets your motion preference to the default, which follows your operating system setting.',
    ],
  },
  {
    id: 'cookie-contact',
    title: 'Contact',
    paragraphs: [`Questions about this page can be sent to ${site.email}.`],
  },
];
