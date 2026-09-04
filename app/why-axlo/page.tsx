import type { Metadata } from 'next';
import { Container, Section } from '@/components/layout/Layout';
import { DetailList } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { brandStages, whyAxloPillars } from '@/content/company';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Why Axlo', href: '/why-axlo' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Why Axlo',
  description:
    'Business first, product thinking, connected by design, AI where it matters, built to scale, long-term partnership — the six positions that shape how Axlo Digital works.',
  path: '/why-axlo',
});

/**
 * Why Axlo (brief §16).
 *
 * Six positions about how the work is done. Deliberately not a proof page:
 * evidence of what has been delivered lives on /case-studies and appears only
 * once a client has approved it. Conflating the two would turn a statement of
 * method into an implied track record.
 */
export default function WhyAxloPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow="Why Axlo"
        title={'We don’t just build software.\nWe understand the business\nbehind the software.'}
        lead="Six positions that shape every engagement — from the first conversation to the work that continues long after launch."
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink href={primaryCta.href} withArrow placement="why-axlo-hero">
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      <Section theme="dark" size="large" labelledBy="pillars-heading">
        <Container>
          <h2 className="visually-hidden" id="pillars-heading">
            How we work
          </h2>

          <RevealGroup className={styles.pillars} as="ul" aria-label="Why Axlo">
            {whyAxloPillars.map((pillar) => (
              <RevealItem key={pillar.id} as="li" className={styles.pillar}>
                <span className={styles.pillarIndex} aria-hidden="true">
                  {pillar.index}
                </span>
                <h3 className={styles.pillarName}>{pillar.name}</h3>
                <p className={styles.pillarSummary}>{pillar.summary}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section theme="dark" tone="subtle" size="large" labelledBy="method-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="method-heading">
              Think → Design → Build → Evolve
            </h2>
            <p className={styles.blockLead}>
              The methodology behind all six. It has not changed since the company started, and the
              last stage is the one most engagements underestimate.
            </p>
          </Reveal>

          <Reveal>
            <DetailList
              label="Delivery stages"
              items={brandStages.map((stage) => ({
                term: `${stage.index} · ${stage.name}`,
                description: stage.detail ?? stage.summary,
              }))}
            />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
