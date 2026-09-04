'use client';

import { Button } from '@/components/foundations/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Comply360Interface } from '@/components/product-demo/Comply360Interface';
import { ProductMediaCarousel } from '@/components/product-demo/ProductMediaCarousel';
import { ProductScreenshot } from '@/components/product-demo/ProductScreenshot';
import type { Product, ProductState } from '@/content/products';
import { track } from '@/lib/analytics';
import styles from './ProductShowcase.module.css';

/**
 * One product panel: the story on one side, the working interface on the other.
 *
 * The two products render through the same component and the same state
 * carousel, which is the structural guarantee that neither can end up better
 * presented than the other — they differ only in their content and in what
 * their states actually are.
 *
 * The copy answers, in order: what it is (positioning), who it serves
 * (audience), the problem and the value (description), what it does
 * (capabilities). A product with only one approved sentence of copy carries it
 * in the description slot and skips the first two — see `data-lead` below.
 */

/**
 * A state is a real screenshot or a composed interface, decided by the content
 * rather than by the product id. AxloPOS is now the former for both its states;
 * the composed `AxloPosInterface` that stood in for it has been deleted rather
 * than left behind a branch, so there is no path back to publishing a drawn
 * interface for a product whose real one we hold.
 */
function renderState(state: ProductState) {
  if (state.media) return <ProductScreenshot media={state.media} />;
  return <Comply360Interface state={state.id} />;
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

          {product.positioning ? <p className={styles.positioning}>{product.positioning}</p> : null}
          {product.audience ? <p className={styles.audience}>{product.audience}</p> : null}

          {/* When a product has no positioning line, its description *is* the
              opening statement, so it is set at lead weight rather than left as
              quiet body copy under nothing. Typography only — no copy is added
              to fill the gap. */}
          <p
            className={styles.description}
            data-lead={product.positioning ? undefined : 'true'}
          >
            {product.description}
          </p>

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
            ) : null}
            {/* A product with no confirmed public URL renders no action at all.
                This previously showed a disabled button captioned "Link coming
                soon", which is precisely the kind of unfinished placeholder the
                release must not publish — and a disabled control that never
                becomes enabled is worse than an absent one. The product's own
                copy and interface carry the section without it. */}
          </div>
        </Reveal>
      </div>

      <div className={styles.visual}>
        <ProductMediaCarousel
          states={product.states}
          label={product.name}
          analyticsProduct={product.id}
          render={(state) => renderState(state)}
        />
      </div>
    </article>
  );
}
