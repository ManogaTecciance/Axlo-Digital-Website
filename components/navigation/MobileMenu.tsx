'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useRef, useState } from 'react';
import { Logo } from '@/components/foundations/Logo';
import { MotionToggle } from '@/components/layout/MotionToggle';
import { scrollToSection } from '@/lib/scroll';
import { contactMailto, primaryCta, primaryNav, site } from '@/lib/site';
import styles from './MobileMenu.module.css';

/**
 * Mobile navigation.
 *
 * Radix Dialog supplies the accessibility contract: focus is trapped inside
 * the panel, `Escape` closes it, and the rest of the page is inert to assistive
 * technology while it is open. Every destination is a real in-page anchor, so
 * navigation still works without JavaScript.
 *
 * Selecting a section closes the panel and, rather than returning focus to the
 * trigger, hands focus to the destination section — so keyboard and
 * screen-reader users land where they navigated. This is done through Radix's
 * `onCloseAutoFocus`, which is the moment focus would otherwise snap back.
 */
export function MobileMenu({ activeSection }: { activeSection: string }) {
  const [open, setOpen] = useState(false);
  // The section to focus after the panel closes, set by the tapped link.
  const pending = useRef<string | null>(null);

  const select = (event: React.MouseEvent, id: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    pending.current = id;
    // Push the hash now so back / forward returns here; the scroll + focus
    // happen once the dialog has finished closing.
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    setOpen(false);
  };

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
        <Dialog.Content
          className={styles.content}
          aria-label="Site navigation"
          onCloseAutoFocus={(event) => {
            if (pending.current) {
              // Send focus to the destination section instead of the trigger.
              event.preventDefault();
              const id = pending.current;
              pending.current = null;
              scrollToSection(id);
            }
          }}
        >
          <Dialog.Title className="visually-hidden">Site navigation</Dialog.Title>
          <Dialog.Description className="visually-hidden">
            Jump to any section of the Axlo Digital homepage.
          </Dialog.Description>

          <div className={styles.head}>
            <Logo size="1.75rem" as="static" />
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
                  <a
                    className={styles.link}
                    href={item.href}
                    aria-current={activeSection === item.sectionId ? 'true' : undefined}
                    onClick={(event) => select(event, item.sectionId)}
                  >
                    <span className={styles.linkLabel}>{item.label}</span>
                    {item.description ? (
                      <span className={styles.linkDescription}>{item.description}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            className={styles.cta}
            href={primaryCta.href}
            onClick={(event) => select(event, primaryCta.sectionId)}
          >
            {primaryCta.label}
            <svg className={styles.ctaArrow} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2.5 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

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
