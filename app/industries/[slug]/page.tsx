import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container, Section } from '@/components/layout/Layout';
import { LinkCardGrid, PillList, type LinkCardItem } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { getIndustry, industries } from '@/content/industries';
import { products } from '@/content/products';
import { solutions } from '@/content/solutions';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) return {};

  return pageMetadata({
    title: `${industry.name} technology`,
    description: `${industry.positioning} The operational problems ${industry.name.toLowerCase()} businesses face, and the Axlo products and services that address them.`,
    path: `/industries/${industry.slug}`,
  });
}

/**
 * Industry page (brief §15).
 *
 * The brief sets the order explicitly — common problems → relevant products
 * and solutions → example workflows → integration needs → CTA — and this
 * template follows it exactly, for every sector, with no per-industry special
 * cases.
 *
 * Products and solutions are resolved from ids in content/industries rather
 * than restated here, so a renamed product cannot leave a stale name behind on
 * six industry pages.
 */
export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const industry = getIndustry(slug);
  if (!industry) notFound();

  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Industries', href: '/industries' },
    { label: industry.name, href: `/industries/${industry.slug}` },
  ];

  const relatedProducts: LinkCardItem[] = industry.products
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))
    .map((product) => ({
      id: product.id,
      title: product.name,
      href: `/products/${product.slug}`,
      summary: product.positioning,
      tags: product.capabilities,
    }));

  const relatedSolutions: LinkCardItem[] = industry.solutions
    .map((id) => solutions.find((solution) => solution.id === id))
    .filter((solution): solution is NonNullable<typeof solution> => Boolean(solution))
    .map((solution) => ({
      id: solution.id,
      title: solution.name,
      href: `/solutions/${solution.slug}`,
      summary: solution.positioning,
      ...(solution.vendor ? { marker: `Partner platform · ${solution.vendor}` } : {}),
    }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow={`Industries · ${industry.index}`}
        title={industry.name}
        lead={industry.positioning}
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink
              href={primaryCta.href}
              withArrow
              event="cta_talk_to_axlo"
              analyticsId={`${industry.id}-hero`}
              placement="industry-hero"
            >
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      {/* ---- Problems ----------------------------------------------------- */}
      <Section theme="dark" size="large" labelledBy="industry-problems-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="industry-problems-heading">
              What usually goes wrong.
            </h2>
          </Reveal>

          <RevealGroup
            className={styles.problems}
            as="ul"
            aria-label={`Common problems in ${industry.name}`}
          >
            {industry.problems.map((problem, index) => (
              <RevealItem key={problem} as="li" className={styles.problem}>
                <span className={styles.problemIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {problem}
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Products and solutions --------------------------------------- */}
      <Section theme="dark" tone="subtle" size="large" labelledBy="industry-fit-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="industry-fit-heading">
              What we would put to work.
            </h2>
          </Reveal>

          {relatedProducts.length > 0 ? (
            <div className={styles.fitGroup}>
              <h3 className={styles.fitTitle}>Axlo products</h3>
              <LinkCardGrid items={relatedProducts} columns={3} label="Relevant Axlo products" />
            </div>
          ) : null}

          {relatedSolutions.length > 0 ? (
            <div className={styles.fitGroup}>
              <h3 className={styles.fitTitle}>Services and platforms</h3>
              <LinkCardGrid
                items={relatedSolutions}
                columns={3}
                label="Relevant services and platforms"
              />
            </div>
          ) : null}
        </Container>
      </Section>

      {/* ---- Workflows ---------------------------------------------------- */}
      <Section theme="dark" size="large" labelledBy="industry-workflows-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="industry-workflows-heading">
              How it would run instead.
            </h2>
            <p className={styles.blockLead}>
              Example end-to-end flows once the systems are connected. Each one replaces a handover
              that is done by hand today.
            </p>
          </Reveal>

          <RevealGroup
            className={styles.workflows}
            as="ul"
            aria-label={`Example workflows for ${industry.name}`}
          >
            {industry.workflows.map((workflow) => (
              <RevealItem key={workflow} as="li" className={styles.workflow}>
                <span className={styles.workflowMarker} aria-hidden="true" />
                {workflow}
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      {/* ---- Integrations ------------------------------------------------- */}
      <Section theme="dark" tone="subtle" size="large" labelledBy="industry-integrations-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="industry-integrations-heading">
              What typically has to connect.
            </h2>
          </Reveal>

          <Reveal className={styles.integrations}>
            <PillList
              items={industry.integrations}
              label={`Integration needs for ${industry.name}`}
              accent
            />
          </Reveal>
        </Container>
      </Section>

      {/* ---- CTA ---------------------------------------------------------- */}
      <Section theme="dark" tone="deep" size="large" labelledBy="industry-cta-heading">
        <Container>
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaHeading} id="industry-cta-heading">
              Recognise any of this?
            </h2>
            <p className={styles.ctaLead}>
              Describe how the work moves through your business today and we will map where it
              breaks.
            </p>
            <div className={styles.heroActions}>
              <CtaLink
                href={primaryCta.href}
                size="lg"
                withArrow
                event="cta_talk_to_axlo"
                analyticsId={`${industry.id}-footer`}
                placement="industry-cta"
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
