import type { Metadata } from 'next';
import Link from 'next/link';
import { Container, Section } from '@/components/layout/Layout';
import { LinkCardGrid, type LinkCardItem } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { products } from '@/content/products';
import { breadcrumbSchema, pageMetadata, productSchemas } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Products',
  description:
    'Comply360, Axlo Payroll, Axlo Budget and AxloPOS — four Axlo-owned products built around real operational workflows in compliance, payroll, budgeting and point of sale.',
  path: '/products',
});

/**
 * Products index (brief §8).
 *
 * These are the products Axlo owns and builds. Third-party platforms Axlo
 * implements live under /solutions and are presented differently — the two
 * layers never share a page, a card treatment or a URL prefix.
 */
export default function ProductsPage() {
  const cards: LinkCardItem[] = products.map((product) => ({
    id: product.id,
    index: product.index,
    title: product.name,
    href: `/products/${product.slug}`,
    summary: product.positioning,
    detail: product.audience,
    tags: product.capabilities,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemas()) }}
      />

      <PageHero
        eyebrow="Our products"
        title={'Technology for the way\nyour business works.'}
        lead="Axlo builds and owns these four products. Each one removes a specific operational problem, and each connects to the systems around it rather than becoming another island."
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink href={primaryCta.href} withArrow placement="products-hero">
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      <Section theme="dark" size="large" labelledBy="portfolio-heading">
        <Container>
          <h2 className="visually-hidden" id="portfolio-heading">
            Product portfolio
          </h2>
          <LinkCardGrid items={cards} columns={2} label="Axlo Digital products" />

          <Reveal>
            <p className={styles.note}>
              Looking for an implementation service rather than a product? Odoo ERP, QuickBooks and
              our engineering services are listed under{' '}
              <Link className={styles.noteLink} href="/solutions">
                Solutions
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
