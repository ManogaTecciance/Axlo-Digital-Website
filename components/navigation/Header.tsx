'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring } from 'motion/react';
import { Logo } from '@/components/foundations/Logo';
import { Container } from '@/components/layout/Layout';
import { track } from '@/lib/analytics';
import { useReducedMotion, useScrolled } from '@/lib/hooks';
import { primaryCta, primaryNav } from '@/lib/site';
import { MobileMenu } from './MobileMenu';
import styles from './Header.module.css';

/**
 * Sticky site header.
 *
 * The site used to be one scrolling document, so this navigated by hash and
 * marked the active item from an IntersectionObserver scroll spy. It now
 * navigates between real routes, so the active item comes from the pathname —
 * no observer, no hydration-gated `aria-current`, and every item is a plain
 * `next/link` that prefetches and works without JavaScript.
 *
 * `aria-current="page"` marks the active route. A child route marks its parent
 * as `aria-current="true"` instead, so a visitor on /products/comply360 can
 * still see which section of the site they are in without the header claiming
 * to be the page they are on.
 */
export function Header() {
  const scrolled = useScrolled(8);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const currentFor = (href: string): 'page' | 'true' | undefined => {
    if (pathname === href) return 'page';
    // /products/comply360 lights up "Products" without claiming to be it.
    if (href !== '/' && pathname.startsWith(`${href}/`)) return 'true';
    return undefined;
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <Container>
        <div className={styles.inner}>
          <Link className={styles.brand} href="/" aria-label="Axlo Digital — home">
            <Logo size="2.25rem" as="static" />
          </Link>

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    className={styles.navLink}
                    href={item.href}
                    aria-current={currentFor(item.href)}
                    onClick={() => track('nav_route_click', { id: item.href, placement: 'header' })}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <Link
              className={styles.cta}
              href={primaryCta.href}
              onClick={() => track('cta_talk_to_axlo', { id: 'header', placement: 'header' })}
            >
              {primaryCta.label}
            </Link>
            <MobileMenu />
          </div>
        </div>
      </Container>

      {/* Read-position rail. Decorative, and removed under reduced motion. */}
      {reduced ? null : (
        <div className={styles.progressRail} aria-hidden="true" data-decorative>
          <motion.div className={styles.progressFill} style={{ scaleX: progress }} />
        </div>
      )}
    </header>
  );
}
