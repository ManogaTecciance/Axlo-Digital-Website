import { Container, Section } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { products } from '@/content/products';
import { ProductShowcase } from './ProductShowcase';
import styles from './ProductsSection.module.css';

/**
 * Section 03 — Products.
 *
 * One section, two products, one component (`ProductShowcase`) rendering both.
 * Comply360 leads in the DOM so it is first on mobile; AxloPOS follows and the
 * two panels alternate sides on desktop. Both draw their interface states from
 * the same primitive kit, so the section reads as one product family rather
 * than as a strong product beside a weak one.
 */
export function ProductsSection() {
  return (
    <Section theme="dark" tone="subtle" id="products" size="large" labelledBy="products-heading">
      <Container>
        <SectionHeader
          eyebrow="Our products"
          id="products-heading"
          width="wide"
          lead="Axlo Digital creates connected products that simplify complex workflows and give businesses greater clarity and control."
        >
          Focused products for real operations.
        </SectionHeader>

        <div className={styles.products}>
          {products.map((product, index) => (
            <ProductShowcase key={product.id} product={product} flip={index % 2 === 1} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
