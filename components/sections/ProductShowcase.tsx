'use client';

import { Reveal } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { ProductVisual } from '@/components/product-demo/ProductVisual';
import type { Product } from '@/content/products';
import styles from './ProductShowcase.module.css';

/**
 * One product panel: the story on one side, the product itself on the other.
 *
 * All four products render through this component, which is the structural
 * guarantee that none can end up better presented than the others — they
 * differ only in their content and in what the visual column can honestly
 * show.
 *
 * That last part is the one asymmetry, and it is deliberate. Comply360 and
 * AxloPOS have composed interfaces built (`states`), so they get the working
 * carousel. Axlo Payroll and Axlo Budget do not, and drawing a plausible-looking
 * fake screen for them would be exactly the fabricated proof the brief rules
 * out — so they get their module map instead, which is true and is still a
 * picture of the product's scope. `ProductVisual` owns that decision, so this
 * band and the product page always agree.
 *
 * The copy answers, in order: what it is (positioning), who it serves
 * (audience), the problem and the value (description), what it does
 * (capabilities). The CTA always goes to the product's own page; any external
 * product site is linked from there, not from here.
 */
export function ProductShowcase({ product, flip }: { product: Product; flip: boolean }) {
  return (
    <article
      className={styles.panel}
      data-flip={flip ? 'true' : undefined}
      aria-labelledby={`${product.id}-heading`}
    >
      <div className={styles.copy}>
        <Reveal>
          <p className={styles.eyebrow}>
            <span className={styles.index}>{product.index}</span>
          </p>

          <h3 className={styles.name} id={`${product.id}-heading`}>
            {product.name}
          </h3>

          <p className={styles.positioning}>{product.positioning}</p>
          <p className={styles.audience}>{product.audience}</p>
          <p className={styles.description}>{product.description}</p>

          <ul className={styles.capabilities}>
            {product.capabilities.map((capability) => (
              <li key={capability} className={styles.capability}>
                {capability}
              </li>
            ))}
          </ul>

          {product.signals ? (
            <ul className={styles.signals}>
              {product.signals.map((signal) => (
                <li key={signal} className={styles.signal}>
                  <span className={styles.signalDot} aria-hidden="true" />
                  {signal}
                </li>
              ))}
            </ul>
          ) : null}

          <div className={styles.cta}>
            <CtaLink
              href={`/products/${product.slug}`}
              event="product_explore"
              analyticsId={product.id}
              placement="products"
              withArrow
            >
              Explore {product.name}
            </CtaLink>
          </div>
        </Reveal>
      </div>

      <div className={styles.visual}>
        <ProductVisual product={product} />
      </div>
    </article>
  );
}
