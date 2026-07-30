'use client';

import { track } from '@/lib/analytics';
import { navigateToSection } from '@/lib/scroll';
import type { productNav } from '@/lib/site';

type ProductNavItem = (typeof productNav)[number];

/**
 * A footer product link.
 *
 * Handles both shapes in one place: an external product site (opens in a new
 * tab, carries `rel="noopener noreferrer"` and its own accessible name) and a
 * product that has no public URL yet (scrolls to it on this page). Neither
 * branch can produce a dead link.
 */
export function ProductLink({ item, className }: { item: ProductNavItem; className?: string }) {
  if (item.external) {
    return (
      <a
        className={className}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.ariaLabel}
        onClick={() => track('product_explore', { id: item.label, placement: 'footer' })}
      >
        {item.label}
      </a>
    );
  }

  const sectionId = item.sectionId ?? 'products';

  return (
    <a
      className={className}
      href={item.href}
      onClick={(event) => {
        track('nav_section_click', { id: item.label, placement: 'footer-products' });
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        navigateToSection(sectionId);
      }}
    >
      {item.label}
    </a>
  );
}
