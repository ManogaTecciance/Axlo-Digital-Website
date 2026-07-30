'use client';

import type { ReactNode } from 'react';
import { track } from '@/lib/analytics';
import { navigateToSection } from '@/lib/scroll';

/**
 * An unstyled in-page link.
 *
 * Renders a real `#section` anchor (works without JavaScript) and upgrades the
 * click to smooth, reduced-motion-aware scrolling with focus management and a
 * synced URL hash. Styling is left to the caller via `className`.
 */
export function SectionLink({
  sectionId,
  children,
  className,
  placement,
  'aria-label': ariaLabel,
}: {
  sectionId: string;
  children: ReactNode;
  className?: string;
  /** Where the link lives — reported with the navigation event. */
  placement?: string;
  'aria-label'?: string;
}) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    track('nav_section_click', { id: sectionId, placement: placement ?? 'footer' });
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    navigateToSection(sectionId);
  };

  return (
    <a className={className} href={`#${sectionId}`} aria-label={ariaLabel} onClick={handleClick}>
      {children}
    </a>
  );
}
