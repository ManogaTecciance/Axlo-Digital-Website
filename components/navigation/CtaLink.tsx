'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';
import buttonStyles from '@/components/foundations/Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

/**
 * A call to action that navigates to a route and reports the conversion.
 *
 * This replaces `SectionCta`, which existed because every destination used to
 * be an in-page anchor on a single-page site and needed smooth-scroll and
 * focus handling. Destinations are now real routes, so the whole mechanism
 * collapses to a `next/link` — which prefetches, works without JavaScript, and
 * needs no scroll management — plus the analytics call.
 *
 * It wears the shared Button styling so a CTA looks identical whether it came
 * from here or from `<Button href>`.
 */
export function CtaLink({
  href,
  children,
  variant = 'primary',
  size = 'md',
  withArrow = false,
  fullWidth = false,
  event = 'cta_talk_to_axlo',
  analyticsId,
  placement,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  withArrow?: boolean;
  fullWidth?: boolean;
  /** Which conversion this instance represents. */
  event?: AnalyticsEvent;
  /** Which instance fired, e.g. `hero-talk-to-axlo`. */
  analyticsId?: string;
  /** Section the CTA sits in. */
  placement?: string;
  /** Layout only — never restyling. */
  className?: string;
}) {
  const classes = [
    buttonStyles.button,
    buttonStyles[variant],
    size !== 'md' ? buttonStyles[size] : '',
    fullWidth ? buttonStyles.full : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Link
      className={classes}
      href={href}
      onClick={() => track(event, { id: analyticsId ?? href, placement })}
    >
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
    </Link>
  );
}
