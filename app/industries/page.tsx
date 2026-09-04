import type { Metadata } from 'next';
import { Container, Section } from '@/components/layout/Layout';
import { LinkCardGrid, type LinkCardItem } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { CtaLink } from '@/components/navigation/CtaLink';
import { industries } from '@/content/industries';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Industries', href: '/industries' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Industries',
  description:
    'Retail, manufacturing, distribution, restaurants and hospitality, professional services, and finance and accounting — the operational problems each sector has, and the systems that address them.',
  path: '/industries',
});

/**
 * Industries index (brief §15).
 *
 * Each card leads with the sector's core operational tension rather than with
 * a claim about work Axlo has delivered there. Nothing on this page or its
 * children asserts a client, a project or a sector track record — those are
 * proof, and proof only appears once it has been approved.
 */
export default function IndustriesPage() {
  const cards: LinkCardItem[] = industries.map((industry) => ({
    id: industry.id,
    index: industry.index,
    title: industry.name,
    href: `/industries/${industry.slug}`,
    summary: industry.positioning,
    detail: industry.problems[0],
    tags: industry.integrations,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow="Industries"
        title={'The same problem,\nin different clothes.'}
        lead="Every operation has the same underlying issue: the systems that run it do not agree with each other. What changes by sector is where it hurts first."
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink href={primaryCta.href} withArrow placement="industries-hero">
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      <Section theme="dark" size="large" labelledBy="industries-heading">
        <Container>
          <h2 className="visually-hidden" id="industries-heading">
            Industries we work in
          </h2>
          <LinkCardGrid items={cards} columns={3} label="Industries" />
        </Container>
      </Section>
    </>
  );
}
