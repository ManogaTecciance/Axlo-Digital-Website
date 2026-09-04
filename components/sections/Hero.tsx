import Image from 'next/image';
import { Eyebrow } from '@/components/foundations/Primitives';
import { CtaLink } from '@/components/navigation/CtaLink';
import { Container, Section } from '@/components/layout/Layout';
import { HeroDepth } from '@/components/motion/HeroDepth';
import { primaryCta, secondaryCta, site } from '@/lib/site';
import styles from './Hero.module.css';

/**
 * Homepage hero — one statement over one connected composition.
 *
 * Deliberately short on secondary messages: eyebrow, headline, one supporting
 * paragraph, two actions, then the proof row. The discipline keyword strip and
 * the Think · Design · Build · Evolve labels that used to sit here were both
 * competing with the headline, and the process is stated in full further down.
 *
 * The proof row is one image tile (~66%) and one quote tile (~34%), matched top
 * and bottom at desktop and joined by a single operational data path that runs
 * from the render into the statement. They are one composition, not two cards.
 *
 * The entrance is pure CSS (see `[data-hero-step]` in the stylesheet). It used
 * to be a GSAP timeline, which meant shipping an animation library for one
 * staggered fade; because the hero is above the fold it needs no observer, so
 * a keyframe with a per-step delay does the same job at no bundle cost and
 * cannot leave content stranded if a script fails.
 *
 * Photography lives in /public/hero and is cropped by the tiles themselves
 * (`object-fit: cover` against a fixed tile height), so replacing a file with a
 * different aspect ratio never breaks the row — see public/hero/README.md.
 */
export function Hero() {
  return (
    <Section theme="dark" tone="deep" size="flush" id="home" className={styles.hero} labelledBy="hero-heading">
      <Container width="wide">
        <div className={styles.copy}>
          <div data-hero-step>
            <Eyebrow>{site.tagline}</Eyebrow>
          </div>

          <h1 className={styles.headline} id="hero-heading" data-hero-step>
            {'We build digital products that make\ncomplex business operations simple.'}
          </h1>

          <p className={styles.supporting} data-hero-step>
            {site.description}
          </p>

          <div className={styles.ctas} data-hero-step>
            <CtaLink
              href={secondaryCta.href}
              size="lg"
              withArrow
              event="cta_explore_products"
              analyticsId="hero-explore-our-products"
            >
              {secondaryCta.label}
            </CtaLink>
            <CtaLink
              href={primaryCta.href}
              size="lg"
              variant="secondary"
              event="cta_talk_to_axlo"
              analyticsId="hero-talk-to-axlo"
            >
              {primaryCta.label}
            </CtaLink>
          </div>
        </div>

        <HeroDepth className={styles.mosaic} data-hero-step>
          {/* One unified image tile: the hero image fills the container, an
              Axlo colour-grading overlay sits over it, and the copy reads on
              top at the upper-left. */}
          <figure className={`${styles.tile} ${styles.tileWide}`}>
            <Image
              className={styles.tileImage}
              src="/hero/axlo-hero-image.jpg"
              alt="Data flowing from a single strand into a sequence of layered, transparent processing panels."
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              priority
              fetchPriority="high"
            />
            <div className={styles.tileOverlay} aria-hidden="true" />
            <div className={styles.tileScrim} aria-hidden="true" />
            <figcaption className={styles.tileCopy}>
              <p className={styles.tileTitle}>Operations, connected end to end.</p>
              <p className={styles.tileLead}>
                Strategy, design and engineering working from one shared view of the business.
              </p>
            </figcaption>
          </figure>

          {/* The operational data path: the render's output travelling into the
              statement. Decorative — the composition reads without it. */}
          <span className={styles.mosaicFlow} aria-hidden="true" data-decorative>
            <span className={styles.mosaicPacket} />
          </span>

          <div className={`${styles.tile} ${styles.quoteTile}`}>
            <Image
              className={`${styles.tileImage} ${styles.quoteImage}`}
              src="/hero/hero-insight.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1024px) 34vw, 100vw"
            />
            <blockquote className={styles.quote}>
              <span className={styles.quoteMark} aria-hidden="true">
                &ldquo;
              </span>
              <p className={styles.quoteText}>{site.secondaryMessage}</p>
              <footer className={styles.quoteFooter}>
                <span className={styles.quoteName}>{site.positioning}</span>
                <span className={styles.quoteRole}>{site.name}</span>
              </footer>
            </blockquote>
          </div>
        </HeroDepth>
      </Container>
    </Section>
  );
}
