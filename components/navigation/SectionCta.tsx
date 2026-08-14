'use client';

import type { ReactNode } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';
import { navigateToSection } from '@/lib/scroll';
import buttonStyles from '@/components/foundations/Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

/**
 * A styled in-page navigation control.
 *
 * Renders a real `#section` anchor — so it works with JavaScript disabled and
 * is exposed as a link to assistive technology — and, when scripted, upgrades
 * the click to smooth, reduced-motion-aware scrolling with focus management and
 * a synced URL hash. Wears the shared Button styling so calls to action look
 * identical whether they point at a section or a URL.
 */
export function SectionCta({
  sectionId,
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  fullWidth = false,
  analyticsEvent,
  analyticsId,
}: {
  sectionId: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  fullWidth?: boolean;
  /** Defaults from the destination — `#contact` is the project CTA. */
  analyticsEvent?: AnalyticsEvent;
  /** Which instance fired, e.g. `hero-start-a-project`. */
  analyticsId?: string;
}) {
  const className = [
    buttonStyles.button,
    buttonStyles[variant],
    size !== 'md' ? buttonStyles[size] : '',
    fullWidth ? buttonStyles.full : '',
  ]
    .filter(Boolean)
    .join(' ');

  const resolvedEvent: AnalyticsEvent =
    analyticsEvent ?? (sectionId === 'contact' ? 'cta_start_project' : 'cta_explore_products');

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Reported before the modifier check so an open-in-new-tab still counts.
    track(resolvedEvent, { id: analyticsId, placement: sectionId });
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateToSection(sectionId);
  };

  return (
    <a className={className} href={`#${sectionId}`} onClick={handleClick}>
      {children}
      {withArrow ? (
        <svg
          className={buttonStyles.arrow}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <path
            d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </a>
  );
}
