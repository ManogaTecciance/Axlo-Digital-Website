'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { Logo } from '@/components/foundations/Logo';
import { Container } from '@/components/layout/Layout';
import { track } from '@/lib/analytics';
import { useReducedMotion, useScrolled } from '@/lib/hooks';
import { navigateToSection, useScrollSpy } from '@/lib/scroll';
import { primaryCta, primaryNav, sectionIds } from '@/lib/site';
import { MobileMenu } from './MobileMenu';
import styles from './Header.module.css';

/**
 * Sticky single-page header.
 *
 * Every item is an in-page anchor. Clicks are intercepted for smooth,
 * reduced-motion-aware scrolling with focus management and a synced URL hash,
 * but each link keeps its real `#section` href so navigation still works
 * without JavaScript. The active item is driven by an IntersectionObserver
 * (see `useScrollSpy`) rather than a scroll listener.
 */
export function Header() {
  const scrolled = useScrolled(8);
  const reduced = useReducedMotion();
  const active = useScrollSpy(sectionIds);
  const [mounted, setMounted] = useState(false);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => setMounted(true), []);

  // The CTA and the "Contact" nav item share a destination but are different
  // actions, so the caller names the event rather than it being inferred.
  const handleNav = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
    reportAs: 'nav_section_click' | 'cta_start_project' = 'nav_section_click',
  ) => {
    track(reportAs, { id, placement: 'header' });
    // Let modified clicks (open in new tab etc.) behave normally.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateToSection(id);
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <Container>
        <div className={styles.inner}>
          <a
            className={styles.brand}
            href="#home"
            aria-label="Axlo Digital — back to top"
            onClick={(event) => handleNav(event, 'home')}
          >
            <Logo size="2.25rem" as="static" />
          </a>

          <nav className={styles.nav} aria-label="Primary">
            <ul className={styles.navList}>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a
                    className={styles.navLink}
                    href={item.href}
                    aria-current={mounted && active === item.sectionId ? 'true' : undefined}
                    onClick={(event) => handleNav(event, item.sectionId)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.actions}>
            <a
              className={styles.cta}
              href={primaryCta.href}
              onClick={(event) => handleNav(event, primaryCta.sectionId, 'cta_start_project')}
            >
              {primaryCta.label}
            </a>
            <MobileMenu activeSection={active} />
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
