'use client';

import { Button } from '@/components/foundations/Button';
import { Reveal } from '@/components/motion/Reveal';
import { AxloPosInterface } from '@/components/product-demo/AxloPosInterface';
import { Comply360Interface } from '@/components/product-demo/Comply360Interface';
import { ProductMediaCarousel } from '@/components/product-demo/ProductMediaCarousel';
import type { Product, ProductState } from '@/content/products';
import { track } from '@/lib/analytics';
import styles from './ProductShowcase.module.css';

/**
 * One product panel: the story on one side, the working interface on the other.
 *
 * The two products render through the same component and the same state
 * carousel, which is the structural guarantee that neither can end up better
 * presented than the other — they differ only in their content and in which
 * interface kit draws their states.
 *
 * The copy answers, in order: what it is (positioning), who it serves
 * (audience), the problem and the value (description), what it does
 * (capabilities). The interface carries the rest.
 */
function renderState(productId: string, state: ProductState) {
  return productId === 'comply360' ? (
    <Comply360Interface state={state.id} />
  ) : (
    <AxloPosInterface state={state.id} />
  );
}

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
            {product.cta.href ? (
              <Button
                href={product.cta.href}
                aria-label={product.cta.ariaLabel}
                target={product.cta.external ? '_blank' : undefined}
                rel={product.cta.external ? 'noopener noreferrer' : undefined}
                onClick={() => track('product_explore', { product: product.id, placement: 'products' })}
                withArrow
              >
                {product.cta.label}
              </Button>
            ) : (
              // No confirmed URL yet — a clearly-labelled placeholder, never a
              // dead link. Announced to assistive technology, not silent.
              <span className={styles.placeholderCta}>
                <span className={styles.placeholderButton} aria-disabled="true">
                  {product.cta.label}
                </span>
                <span className={styles.placeholderNote} role="note">
                  Link coming soon
                </span>
              </span>
            )}
          </div>
        </Reveal>
      </div>

      <div className={styles.visual}>
        <ProductMediaCarousel
          states={product.states}
          label={product.name}
          analyticsProduct={product.id}
          render={(state) => renderState(product.id, state)}
        />
      </div>
    </article>
  );
}
