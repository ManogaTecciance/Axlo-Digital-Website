'use client';

import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/foundations/Logo';
import { MotionToggle } from '@/components/layout/MotionToggle';
import { track } from '@/lib/analytics';
import { contactMailto, primaryCta, primaryNav, site } from '@/lib/site';
import styles from './MobileMenu.module.css';

/**
 * Mobile and tablet navigation.
 *
 * Radix Dialog supplies the accessibility contract: focus is trapped inside
 * the panel, `Escape` closes it, and the rest of the page is inert to
 * assistive technology while it is open.
 *
 * Now that destinations are routes rather than in-page anchors, closing is
 * driven by the pathname changing rather than by the link handler — a tap
 * navigates, the route commits, and the effect below closes the panel. That
 * also covers a back-button navigation while the drawer is open, which a
 * click-handler close would miss.
 *
 * Products and Solutions carry their children inline. The brief asks mobile to
 * "preserve the same hierarchy", and a drawer can show the whole tree at once
 * where a desktop bar cannot.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on navigation. Effect rather than onClick so browser-driven route
  // changes close the panel too.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isCurrent = (href: string) => pathname === href;
  const isWithin = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={styles.trigger}>
        <svg className={styles.icon} viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        Menu
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content} aria-label="Site navigation">
          <Dialog.Title className="visually-hidden">Site navigation</Dialog.Title>
          <Dialog.Description className="visually-hidden">
            Browse the Axlo Digital website.
          </Dialog.Description>

          <div className={styles.head}>
            <Link href="/" aria-label="Axlo Digital — home">
              <Logo size="1.75rem" as="static" />
            </Link>
            <Dialog.Close className={styles.close} aria-label="Close navigation">
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" aria-hidden="true">
                <path d="M5 5l10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </Dialog.Close>
          </div>

          <nav aria-label="Primary">
            <ul className={styles.list}>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    className={styles.link}
                    href={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : isWithin(item.href) ? 'true' : undefined}
                    onClick={() => track('nav_route_click', { id: item.href, placement: 'drawer' })}
                  >
                    <span className={styles.linkLabel}>{item.label}</span>
                    {item.description ? (
                      <span className={styles.linkDescription}>{item.description}</span>
                    ) : null}
                  </Link>

                  {item.children ? (
                    <ul className={styles.subList}>
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            className={styles.subLink}
                            href={child.href}
                            aria-current={isCurrent(child.href) ? 'page' : undefined}
                            onClick={() =>
                              track('nav_route_click', { id: child.href, placement: 'drawer' })
                            }
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </nav>

          <Link
            className={styles.cta}
            href={primaryCta.href}
            onClick={() => track('cta_talk_to_axlo', { id: 'drawer', placement: 'drawer' })}
          >
            {primaryCta.label}
            <svg className={styles.ctaArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <div className={styles.footer}>
            <div className={styles.footerRow}>
              <span className={styles.footerLabel}>Motion</span>
              <MotionToggle />
            </div>
            <a className={styles.email} href={contactMailto}>
              {site.email}
            </a>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
