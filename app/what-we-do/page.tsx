import type { Metadata } from 'next';
import { Container, Section } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import { PillList } from '@/components/layout/PageBlocks';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { brandStages } from '@/content/company';
import { serviceCategories } from '@/content/services';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'What We Do', href: '/what-we-do' },
];

export const metadata: Metadata = pageMetadata({
  title: 'What We Do',
  description:
    'Strategy, experience design, technology and AI, and operations — the four disciplines Axlo Digital brings to every engagement, and what each one delivers.',
  path: '/what-we-do',
});

/**
 * What We Do (brief §7).
 *
 * The homepage shows three facets per area; this page shows the full
 * deliverable list, which is the whole reason it exists as a separate route.
 * Both read the same `serviceCategories`, so the two can never disagree.
 */
export default function WhatWeDoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow="What we do"
        title={'From business problem\nto digital product.'}
        lead="Four connected disciplines rather than four separate engagements. Most work draws on all of them, which is why they are described together."
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink href={primaryCta.href} withArrow placement="what-we-do-hero">
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      <Section theme="dark" size="large" labelledBy="capabilities-heading">
        <Container>
          <h2 className="visually-hidden" id="capabilities-heading">
            Capability areas
          </h2>

          <div className={styles.areas}>
            {serviceCategories.map((service) => (
              <Reveal key={service.id} as="article" className={styles.area}>
                <div className={styles.areaHead}>
                  <span className={styles.areaIndex} aria-hidden="true">
                    {service.index}
                  </span>
                  <div>
                    <h3 className={styles.areaTitle}>{service.title}</h3>
                    <p className={styles.areaPromise}>{service.promise}</p>
                  </div>
                </div>

                <div className={styles.areaBody}>
                  <p className={styles.areaDescription}>{service.description}</p>
                  <PillList
                    items={service.deliverables}
                    label={`${service.title} deliverables`}
                    accent
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section theme="dark" tone="subtle" size="large" labelledBy="approach-heading">
        <Container>
          <Reveal>
            <h2 className={styles.approachHeading} id="approach-heading">
              How the four come together.
            </h2>
            <p className={styles.approachLead}>
              Every engagement runs the same four stages. The balance between the disciplines
              changes; the sequence does not.
            </p>
          </Reveal>

          <RevealGroup className={styles.stages} as="ol" aria-label="Delivery stages">
            {brandStages.map((stage) => (
              <RevealItem key={stage.id} as="li" className={styles.stage}>
                <span className={styles.stageIndex} aria-hidden="true">
                  {stage.index}
                </span>
                <h3 className={styles.stageName}>{stage.name}</h3>
                <p className={styles.stageSummary}>{stage.summary}</p>
                {stage.detail ? <p className={styles.stageDetail}>{stage.detail}</p> : null}
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
