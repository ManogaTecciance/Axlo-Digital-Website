import type { Metadata } from 'next';
import { Container, Section } from '@/components/layout/Layout';
import { PendingPanel } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { caseStudies, caseStudyStructure, proofRequirements } from '@/content/company';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Case Studies', href: '/case-studies' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Case Studies',
  description:
    'How Axlo Digital documents a project: the business problem, the existing process, what was built, and the measurable result — published only with the client’s approval.',
  path: '/case-studies',
});

/**
 * Case studies (brief §18).
 *
 * The brief calls proof "one of the highest-priority additions" and forbids
 * publishing invented customer numbers, testimonials, logos or performance
 * claims. Both hold, so what ships is the framework: the nine-part structure
 * every study will follow, and a plain statement of what is still outstanding.
 *
 * This is a real page doing real work — a prospect reading it learns exactly
 * what evidence Axlo will produce and how it is verified, which is more
 * credible than three fictional success stories. When `caseStudies` gains
 * entries they render above the framework automatically.
 *
 * FOR THE CLIENT: the items under "What we still need" are launch blockers for
 * the proof layer, not decoration. Supply them and this page becomes the
 * strongest commercial asset on the site.
 */
export default function CaseStudiesPage() {
  const hasStudies = caseStudies.length > 0;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow="Case studies"
        title={'Evidence, not adjectives.'}
        lead="We publish a project only once the client has approved it, and we publish the numbers they verified rather than the numbers that would read best. Here is the structure every case study follows."
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink href={primaryCta.href} withArrow placement="case-studies-hero">
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      {hasStudies ? (
        <Section theme="dark" size="large" labelledBy="studies-heading">
          <Container>
            <h2 className="visually-hidden" id="studies-heading">
              Published case studies
            </h2>

            <RevealGroup className={styles.studies} as="ul" aria-label="Case studies">
              {caseStudies.map((study) => (
                <RevealItem key={study.id} as="li" className={styles.study}>
                  <p className={styles.studyIndustry}>{study.industry}</p>
                  <h3 className={styles.studyTitle}>{study.client}</h3>
                  <p className={styles.studyProblem}>{study.problem}</p>
                  <p className={styles.studyResult}>{study.result}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      ) : null}

      <Section theme="dark" size="large" labelledBy="structure-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="structure-heading">
              How we document a project.
            </h2>
            <p className={styles.blockLead}>
              Nine parts, in this order, every time. The sixth is the one that matters, and it is
              the one we will not estimate.
            </p>
          </Reveal>

          <RevealGroup className={styles.structure} as="ol" aria-label="Case study structure">
            {caseStudyStructure.map((part) => (
              <RevealItem key={part.step} as="li" className={styles.part}>
                <span className={styles.partStep} aria-hidden="true">
                  {part.step}
                </span>
                <h3 className={styles.partName}>{part.name}</h3>
                <p className={styles.partDetail}>{part.detail}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {!hasStudies ? (
        <Section theme="dark" tone="subtle" size="large" labelledBy="pending-heading">
          <Container>
            <h2 className="visually-hidden" id="pending-heading">
              Outstanding proof assets
            </h2>

            <Reveal className={styles.pending}>
              <PendingPanel
                title="No case studies are published yet"
                requirements={proofRequirements}
                label="Awaiting approved content"
              >
                <p>
                  Nothing appears above because no client story has been approved for publication.
                  We would rather show an empty shelf than a fictional one — a customer name,
                  metric or quotation published without permission is a legal and commercial risk
                  long before it is a marketing benefit.
                </p>
                <p>
                  To turn this page into published proof, the following need to be supplied and
                  approved:
                </p>
              </PendingPanel>
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section theme="dark" tone="deep" size="large" labelledBy="case-cta-heading">
        <Container>
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaHeading} id="case-cta-heading">
              Would your project make a good case study?
            </h2>
            <p className={styles.ctaLead}>
              We will tell you what we would measure before the work starts, so the result is real
              rather than reconstructed afterwards.
            </p>
            <div className={styles.heroActions}>
              <CtaLink
                href={primaryCta.href}
                size="lg"
                withArrow
                analyticsId="case-studies-footer"
                placement="case-studies-cta"
              >
                {primaryCta.label}
              </CtaLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
