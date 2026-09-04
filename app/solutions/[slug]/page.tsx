import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/layout/Layout';
import { DetailList, PillList } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { brandStages } from '@/content/company';
import { industries } from '@/content/industries';
import { getSolution, solutions } from '@/content/solutions';
import { breadcrumbSchema, pageMetadata, serviceSchema } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

export function generateStaticParams() {
  return solutions.map((solution) => ({ slug: solution.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};

  return pageMetadata({
    title: solution.vendor ? `${solution.name} — implementation & support` : solution.name,
    description: solution.description,
    path: `/solutions/${solution.slug}`,
  });
}

/**
 * Solution page (brief §13, §14).
 *
 * The `vendor` field decides how the page presents itself. On a partner
 * platform it adds a persistent trademark and ownership statement, and the
 * page title says "implementation & support" rather than naming the platform
 * alone — so neither the page nor its search result can be read as Axlo
 * claiming to publish Odoo or QuickBooks.
 */
export default async function SolutionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Solutions', href: '/solutions' },
    { label: solution.name, href: `/solutions/${solution.slug}` },
  ];

  const relatedIndustries = industries.filter((industry) =>
    industry.solutions.includes(solution.id),
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema(solution)) }}
      />

      <PageHero
        eyebrow={solution.vendor ? `Partner platform · ${solution.vendor}` : 'Axlo engineering'}
        title={solution.positioning}
        lead={solution.description}
        trail={trail}
        meta={<p className={styles.audience}>{solution.audience}</p>}
        aside={
          <div className={styles.heroActions}>
            <CtaLink
              href={primaryCta.href}
              withArrow
              event="cta_talk_to_axlo"
              analyticsId={`${solution.id}-hero`}
              placement="solution-hero"
            >
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      {/* The ownership statement. Rendered high on the page, not in a footnote:
          brief section 13 makes this the one thing a partner-platform page must
          not leave ambiguous. */}
      {solution.vendor ? (
        <Section theme="dark" tone="deep" size="flush" className={styles.vendorBand}>
          <Container>
            <p className={styles.vendorStatement} role="note">
              <span className={styles.vendorLabel}>Partner platform</span>
              {solution.vendor} is a third-party product owned by its respective publisher and is
              not an Axlo Digital product. Axlo Digital provides consulting, implementation,
              integration, training and support services for it.
            </p>
          </Container>
        </Section>
      ) : null}

      <Section theme="dark" size="large" labelledBy="solution-capabilities-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="solution-capabilities-heading">
              What this covers.
            </h2>
          </Reveal>

          <Reveal className={styles.capabilities}>
            <PillList
              items={solution.capabilities}
              label={`${solution.name} capabilities`}
              accent
            />
          </Reveal>
        </Container>
      </Section>

      <Section theme="dark" tone="subtle" size="large" labelledBy="solution-approach-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="solution-approach-heading">
              How the work runs.
            </h2>
            <p className={styles.blockLead}>
              The same four stages as everything else we do — the balance changes, the sequence
              does not.
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

      {relatedIndustries.length > 0 ? (
        <Section theme="dark" size="large" labelledBy="solution-industries-heading">
          <Container>
            <Reveal>
              <h2 className={styles.blockHeading} id="solution-industries-heading">
                Where this applies.
              </h2>
            </Reveal>

            <Reveal>
              <DetailList
                label={`Industries using ${solution.name}`}
                items={relatedIndustries.map((industry) => ({
                  term: industry.name,
                  description: industry.positioning,
                }))}
              />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      <Section theme="dark" tone="deep" size="large" labelledBy="solution-cta-heading">
        <Container>
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaHeading} id="solution-cta-heading">
              Tell us how the work runs today.
            </h2>
            <p className={styles.ctaLead}>
              We will tell you what {solution.name} would change, and what it would not.
            </p>
            <div className={styles.heroActions}>
              <CtaLink
                href={primaryCta.href}
                size="lg"
                withArrow
                event="cta_talk_to_axlo"
                analyticsId={`${solution.id}-footer`}
                placement="solution-cta"
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
