import type { Product } from '@/content/products';
import styles from './ProductModuleMap.module.css';

/**
 * The visual column for a product that has no composed interface yet.
 *
 * Axlo Payroll and Axlo Budget are real products with a defined module scope,
 * but no screens have been supplied for them. The two options were to draw a
 * convincing-looking interface from imagination or to show something true;
 * brief §24 settles it — nothing on this site may imply a capability it cannot
 * support, and a fabricated screenshot is the strongest implication there is.
 *
 * So this renders what is actually known: the workflow spine and the module
 * list from the content layer, in the same frame chrome the real product
 * carousels use, so the section still reads as one product family. When
 * approved screens arrive, add `states` to the product in content/products and
 * the carousel takes over with no change here.
 */
export function ProductModuleMap({ product }: { product: Product }) {
  const headingId = `${product.id}-module-map`;

  return (
    <figure className={styles.frame} aria-labelledby={headingId}>
      <div className={styles.chrome}>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span className={styles.title} id={headingId}>
          {product.name} — module scope
        </span>
      </div>

      <div className={styles.body}>
        {product.workflow ? (
          <ol className={styles.workflow} aria-label={`${product.name} workflow`}>
            {product.workflow.map((step, index) => (
              <li key={step} className={styles.step}>
                <span className={styles.stepIndex} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {step}
              </li>
            ))}
          </ol>
        ) : null}

        <ul className={styles.modules} aria-label={`${product.name} modules`}>
          {product.modules.map((module) => (
            <li key={module} className={styles.module}>
              {module}
            </li>
          ))}
        </ul>
      </div>

      <figcaption className={styles.caption}>
        Module scope for {product.name}. Interface screens are published here once they are
        available.
      </figcaption>
    </figure>
  );
}
