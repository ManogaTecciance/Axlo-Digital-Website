import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '@/components/foundations/Button';
import { PlaceholderNote } from '@/components/foundations/Primitives';
import { Container, Section } from '@/components/layout/Layout';
import { DetailList, PillList, WorkflowSpine } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { ProductVisual } from '@/components/product-demo/ProductVisual';
import { getProduct, products } from '@/content/products';
import { industries } from '@/content/industries';
import { breadcrumbSchema, pageMetadata, productSchema } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

/** Static params — the product set is known at build time. */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};

  return pageMetadata({
    title: product.name,
    description: `${product.positioning} ${product.description}`,
    path: `/products/${product.slug}`,
  });
}

/**
 * Product page (brief §9–§12).
 *
 * One template for all four products, driven entirely by the content layer, so
 * no product can be given a better page than another by accident. The shape is
 * the same each time: positioning → the product itself → feature groups →
 * module list → where it applies → CTA.
 *
 * Two things are conditional, and both are conditional on facts rather than on
 * editorial preference:
 *
 *   • The interface band renders only for products with composed screens. The
 *     homepage falls back to a module map there, but this page already lists
 *     the modules in full further down — showing the map as well would be the
 *     same information twice inside one screen of scrolling.
 *   • `complianceNote` renders as a visible note on products that make
 *     statutory claims, because brief §10 requires those to be kept current and
 *     a comment in the source is not where anybody would look.
 */
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const trail = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: product.name, href: `/products/${product.slug}` },
  ];

  // Industries that list this product. Derived rather than duplicated, so the
  // relationship is stated once, in content/industries.
  const relatedIndustries = industries.filter((industry) => industry.products.includes(product.id));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema(product)) }}
      />

      <PageHero
        eyebrow={`Product ${product.index}`}
        title={product.headline}
        lead={product.description}
        trail={trail}
        meta={<p className={styles.audience}>{product.audience}</p>}
        aside={
          <div className={styles.heroActions}>
            <CtaLink
              href={primaryCta.href}
              withArrow
              event="cta_talk_to_axlo"
              analyticsId={`${product.id}-hero`}
              placement="product-hero"
            >
              {primaryCta.label}
            </CtaLink>

            {product.cta.external && product.cta.href ? (
              <Button
                href={product.cta.href}
                variant="secondary"
                aria-label={product.cta.ariaLabel}
                target="_blank"
                rel="noopener noreferrer"
              >
                {product.cta.label}
              </Button>
            ) : null}
          </div>
        }
      />

      {/* ---- The product itself. Only where real screens exist. ---------- */}
      {product.states?.length ? (
        <Section theme="dark" size="large" labelledBy="product-interface-heading">
          <Container>
            <h2 className="visually-hidden" id="product-interface-heading">
              {product.name} interface
            </h2>

            <Reveal className={styles.visual}>
              <ProductVisual product={product} />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ---- How it works, then what it does ----------------------------- */}
      {product.featureGroups?.length ? (
        <Section theme="dark" tone="subtle" size="large" labelledBy="product-features-heading">
          <Container>
            <Reveal>
              <h2 className={styles.blockHeading} id="product-features-heading">
                What {product.name} does.
              </h2>
            </Reveal>

            {product.workflow ? (
              <Reveal className={styles.spineWrap}>
                <WorkflowSpine steps={product.workflow} label={`${product.name} workflow`} />
              </Reveal>
            ) : null}

            <RevealGroup
              className={styles.groups}
              as="ul"
              aria-label={`${product.name} feature groups`}
            >
              {product.featureGroups.map((group) => (
                <RevealItem key={group.name} as="li" className={styles.group}>
                  <h3 className={styles.groupName}>{group.name}</h3>
                  <p className={styles.groupSummary}>{group.summary}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          </Container>
        </Section>
      ) : null}

      {/* ---- Modules ------------------------------------------------------ */}
      <Section theme="dark" size="large" labelledBy="product-modules-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="product-modules-heading">
              Modules and capabilities.
            </h2>
            <p className={styles.blockLead}>
              Everything {product.name} covers, in one list.
            </p>
          </Reveal>

          <Reveal className={styles.modules}>
            <PillList items={product.modules} label={`${product.name} modules`} accent />
          </Reveal>

          {product.complianceNote ? (
            <Reveal className={styles.complianceNote}>
              <PlaceholderNote label="Keep current">{product.complianceNote}</PlaceholderNote>
            </Reveal>
          ) : null}
        </Container>
      </Section>

      {/* ---- Where it applies -------------------------------------------- */}
      {relatedIndustries.length > 0 ? (
        <Section theme="dark" tone="subtle" size="large" labelledBy="product-industries-heading">
          <Container>
            <Reveal>
              <h2 className={styles.blockHeading} id="product-industries-heading">
                Where {product.name} is used.
              </h2>
            </Reveal>

            <Reveal>
              <DetailList
                label={`Industries using ${product.name}`}
                items={relatedIndustries.map((industry) => ({
                  term: industry.name,
                  description: industry.positioning,
                }))}
              />
            </Reveal>
          </Container>
        </Section>
      ) : null}

      {/* ---- CTA ---------------------------------------------------------- */}
      <Section theme="dark" tone="deep" size="large" labelledBy="product-cta-heading">
        <Container>
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaHeading} id="product-cta-heading">
              Want to see {product.name} against your own process?
            </h2>
            <p className={styles.ctaLead}>
              Tell us how the work runs today and we will show you where {product.name} fits.
            </p>
            <div className={styles.heroActions}>
              <CtaLink
                href={primaryCta.href}
                size="lg"
                withArrow
                event="cta_talk_to_axlo"
                analyticsId={`${product.id}-footer`}
                placement="product-cta"
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
