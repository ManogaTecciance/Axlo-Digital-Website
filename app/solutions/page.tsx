import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/layout/Layout';
import { LinkCardGrid, type LinkCardItem } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { engineeringSolutions, partnerSolutions } from '@/content/solutions';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Solutions', href: '/solutions' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Solutions',
  description:
    'Odoo ERP and QuickBooks implementation, ERP and business systems, AI and automation, system integration and custom software engineering from Axlo Digital.',
  path: '/solutions',
});

/**
 * Solutions index (brief §13, §14).
 *
 * Split into two clearly separated groups, which is the whole design of this
 * page. Partner platforms come first with an explicit vendor marker on every
 * card; Axlo's own engineering disciplines follow under their own heading.
 * Brief §13 and §26 both require that Odoo and QuickBooks never read as
 * Axlo-owned products, and a visitor who only scans headings still gets that
 * from this layout.
 */
export default function SolutionsPage() {
  const partnerCards: LinkCardItem[] = partnerSolutions.map((solution) => ({
    id: solution.id,
    title: solution.name,
    href: `/solutions/${solution.slug}`,
    summary: solution.positioning,
    detail: solution.description,
    marker: `Partner platform · ${solution.vendor}`,
    tags: solution.capabilities.slice(0, 4),
  }));

  const engineeringCards: LinkCardItem[] = engineeringSolutions.map((solution) => ({
    id: solution.id,
    index: solution.index,
    title: solution.name,
    href: `/solutions/${solution.slug}`,
    summary: solution.positioning,
    detail: solution.description,
    tags: solution.capabilities.slice(0, 4),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow="Solutions"
        title={'Leading business platforms,\nimplemented around your business.'}
        lead="Two kinds of work sit here: implementing the third-party platforms your business runs on, and building the engineering that connects everything together."
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink href={primaryCta.href} withArrow placement="solutions-hero">
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      <Section theme="dark" size="large" labelledBy="partner-heading">
        <Container>
          <Reveal>
            <h2 className={styles.groupHeading} id="partner-heading">
              Partner platforms
            </h2>
            <p className={styles.groupLead}>
              These are established platforms owned by their vendors. Axlo provides the consulting,
              implementation, integration, training and support around them — we are not the
              publisher of this software.
            </p>
          </Reveal>

          <LinkCardGrid items={partnerCards} columns={2} label="Partner platform services" />
        </Container>
      </Section>

      <Section theme="dark" tone="subtle" size="large" labelledBy="engineering-heading">
        <Container>
          <Reveal>
            <h2 className={styles.groupHeading} id="engineering-heading">
              Axlo engineering
            </h2>
            <p className={styles.groupLead}>
              Our own disciplines: choosing and shaping business systems, applying AI where it pays
              for itself, connecting what you already run, and building what no platform covers.
            </p>
          </Reveal>

          <LinkCardGrid items={engineeringCards} columns={2} label="Axlo engineering services" />

          <Reveal>
            <p className={styles.note}>
              Software Axlo builds and owns — Comply360, Axlo Payroll, Axlo Budget and AxloPOS — is
              listed separately under{' '}
              <Link className={styles.noteLink} href="/products">
                Products
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
