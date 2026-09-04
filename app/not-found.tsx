import Link from 'next/link';
import { Button } from '@/components/foundations/Button';
import { Eyebrow } from '@/components/foundations/Primitives';
import { Container, Section } from '@/components/layout/Layout';
import { SlashMark } from '@/components/motion/FlowLine';
import { primaryNav } from '@/lib/site';
import styles from './not-found.module.css';

/**
 * Custom 404.
 *
 * Offers the primary routes as the way back — the list is `primaryNav`, so a
 * route added to the site appears here without a second edit.
 */
export default function NotFound() {
  return (
    <Section theme="dark" tone="deep" size="large" labelledBy="not-found-heading" className={styles.section}>
      <Container>
        <div className={styles.layout}>
          <div>
            <Eyebrow>Error 404</Eyebrow>
            <h1 className={styles.headline} id="not-found-heading">
              {'This path\ndoesn’t connect.'}
            </h1>
            <p className={styles.text}>
              The page you were looking for has moved or never existed. Nothing is broken on your
              side — here is the way back.
            </p>

            <div className={styles.actions}>
              <Button href="/" withArrow>
                Back to home
              </Button>
              <Button href="/contact" variant="secondary">
                Tell us what you were looking for
              </Button>
            </div>

            <nav className={styles.nav} aria-label="Main pages">
              <span className={styles.navLabel}>Or go straight to</span>
              <ul className={styles.navList}>
                {primaryNav.map((item) => (
                  <li key={item.href}>
                    <Link className={styles.navLink} href={item.href}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className={styles.mark}>
            <SlashMark size={180} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
