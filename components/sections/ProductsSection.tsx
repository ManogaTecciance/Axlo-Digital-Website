import { Container, Section } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { products } from '@/content/products';
import { ProductShowcase } from './ProductShowcase';
import styles from './ProductsSection.module.css';

/**
 * Homepage band 04 — Products (brief §6.4).
 *
 * One section, four products, one component (`ProductShowcase`) rendering all
 * of them. Panels alternate sides on desktop and stack in content order on
 * mobile. Every card carries the same fields and the same CTA shape, so the
 * section reads as one product family rather than as two strong products
 * beside two thin ones.
 */
export function ProductsSection() {
  return (
    <Section theme="dark" tone="subtle" id="products" size="large" labelledBy="products-heading">
      <Container>
        <SectionHeader
          eyebrow="Our products"
          id="products-heading"
          width="wide"
          lead="Axlo builds products that solve real operational problems — compliance, payroll, budgeting and point of sale — and connects them to the systems around them."
        >
          Technology for the way your business works.
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
