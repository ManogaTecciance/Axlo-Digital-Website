import Image from 'next/image';
import type { ProductScreenshot as Media } from '@/content/products';
import styles from './ProductScreenshot.module.css';

/**
 * A real screenshot of a shipped product, framed.
 *
 * WHY THIS IS NOT `AppFrame`
 * `AppFrame` exists to declare a composition as conceptual: it draws window
 * chrome, stamps a "Sample view" chip, and takes `role="img"` with a single
 * label because its contents are forty pieces of invented text. None of that
 * applies here. A screenshot already carries the product's own chrome, is not
 * sample content, and is a single image with a single alt — so it needs a
 * border and nothing else. Wrapping it in a second fake title bar would put a
 * drawn window around a photograph of a real one.
 *
 * RENDERING
 * The file's intrinsic pixel dimensions are passed through, so the box is
 * reserved at the correct ratio before any bytes arrive and the picture is
 * never scaled to a shape that is not its own. `height: auto` against a fluid
 * width means it can only ever be scaled proportionally: there is no crop, no
 * `object-fit`, and no fixed container ratio it has to fit itself into.
 *
 * The global dark-theme image grade (`--image-filter`, a brightness and
 * saturation trim tuned for the hero photography) is switched off here. It is
 * correct for a photograph and wrong for a screenshot — it would publish the
 * product's interface in colours the product does not actually use.
 */
export function ProductScreenshot({ media }: { media: Media }) {
  return (
    <figure className={styles.frame}>
      <Image
        className={styles.image}
        src={media.src}
        alt={media.alt}
        width={media.width}
        height={media.height}
        /* The visual column is ~62% of the container on desktop, full width
           below it. Stated so the browser picks a candidate that matches the
           box it will actually occupy rather than the viewport. */
        sizes="(min-width: 1024px) 62vw, (min-width: 768px) 90vw, 100vw"
        /* Interface detail — thin rules, small type, tight gradients — is what
           compression damages first, so these are encoded above the default. */
        quality={90}
        /* Stated rather than left to the default: the products section is well
           below the fold, so neither screenshot may compete with the hero for
           bandwidth. Explicit here so that adding `priority` later reads as the
           deliberate reversal it would be. */
        loading="lazy"
      />

      {/* Demo-data disclosure. A caption bar under the picture rather than a
          watermark over it: the requirement is that the figures are not read as
          real customer performance, not that the interface be obscured. It is
          part of the framed object, so it travels with the screenshot at every
          width instead of being a separate line that could wrap away from it,
          and it is real text — announced with the image, not baked into the
          pixels where assistive technology could never reach it. */}
      {media.dataNotice ? (
        <figcaption className={styles.notice}>
          <span className={styles.noticeDot} aria-hidden="true" />
          {media.dataNotice}
        </figcaption>
      ) : null}
    </figure>
  );
}
