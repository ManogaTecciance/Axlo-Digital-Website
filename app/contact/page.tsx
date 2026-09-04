import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/forms/EnquiryForm';
import { Container, Section } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { brandStages } from '@/content/company';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Contact', href: '/contact' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Contact',
  description:
    'Tell Axlo Digital what you are building, improving or trying to connect. We reply to every enquiry ourselves, normally within one working day.',
  path: '/contact',
});

/**
 * Contact (brief §20).
 *
 * The conversion page. Form on the left, what-happens-next on the right —
 * because the single biggest reason a qualified enquiry does not get sent is
 * not knowing what sending it commits you to.
 *
 * The form is a client component; everything around it is static, so the page
 * still renders and the email address is still reachable if the form's script
 * never loads.
 */
export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow="Start here"
        title={'Have a complex business problem?\nLet’s make it flow.'}
        lead="Tell us what you are building, improving, or trying to connect. The more you can say about how the work runs today, the more useful our first reply will be."
        trail={trail}
      />

      <Section theme="dark" size="large" labelledBy="contact-form-heading">
        <Container>
          <div className={styles.layout}>
            <div className={styles.formColumn}>
              <h2 className={styles.formHeading} id="contact-form-heading">
                Send us an enquiry
              </h2>
              <p className={styles.formLead}>
                Fields marked <span aria-hidden="true">*</span>
                <span className="visually-hidden">with an asterisk</span> are required.
              </p>
              <EnquiryForm />
            </div>

            <aside className={styles.aside} aria-labelledby="contact-next-heading">
              <h2 className={styles.asideHeading} id="contact-next-heading">
                What happens next
              </h2>

              <ol className={styles.steps}>
                <li className={styles.step}>
                  <span className={styles.stepIndex} aria-hidden="true">
                    01
                  </span>
                  <div>
                    <h3 className={styles.stepName}>We read it ourselves</h3>
                    <p className={styles.stepText}>
                      Not a queue and not a chatbot. Normally a reply within one working day.
                    </p>
                  </div>
                </li>
                <li className={styles.step}>
                  <span className={styles.stepIndex} aria-hidden="true">
                    02
                  </span>
                  <div>
                    <h3 className={styles.stepName}>A conversation, not a pitch</h3>
                    <p className={styles.stepText}>
                      Thirty minutes on how the work runs today, where it breaks, and what you have
                      already tried.
                    </p>
                  </div>
                </li>
                <li className={styles.step}>
                  <span className={styles.stepIndex} aria-hidden="true">
                    03
                  </span>
                  <div>
                    <h3 className={styles.stepName}>A written view</h3>
                    <p className={styles.stepText}>
                      What we would do, in what order, and what it would take — including when the
                      answer is that you do not need us.
                    </p>
                  </div>
                </li>
              </ol>

              <div className={styles.direct}>
                <h3 className={styles.directTitle}>Prefer email?</h3>
                <a className={styles.directLink} href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </div>

              <div className={styles.method}>
                <h3 className={styles.directTitle}>How we work</h3>
                <p className={styles.methodText}>
                  Every engagement runs {brandStages.map((stage) => stage.name).join(' → ')}. The
                  first conversation is the start of Think.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
