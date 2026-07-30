'use client';

import { useEffect, useState } from 'react';

/**
 * Single-page navigation helpers.
 *
 * The site is one scrolling document; every "route" is an in-page section.
 * These utilities give the navigation smooth, reduced-motion-aware scrolling,
 * a synced URL hash that keeps back / forward working, and an
 * IntersectionObserver-based active-section indicator — no continuous scroll
 * listeners.
 */

/** True when the visitor has asked for less motion (OS or in-page toggle). */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  const system = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  const manual = document.documentElement.dataset.motion === 'reduced';
  return system || manual;
}

/**
 * Scroll a section into view and hand it keyboard focus.
 *
 * Scrolling is instant under reduced motion and smooth otherwise. The section
 * is focused with `preventScroll` so screen-reader and keyboard users continue
 * from the destination without the focus call fighting the animated scroll.
 * `scroll-margin-top` on the section (see globals.css) keeps the heading clear
 * of the sticky header.
 */
export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const reduced = prefersReducedMotion();
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  // Make the landmark programmatically focusable without leaving a persistent
  // tab stop, then move focus there.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/**
 * Navigate to a section: scroll + focus, and push the hash so browser back /
 * forward returns the visitor to where they were. Called from click handlers,
 * which keep their real `#hash` href as the no-JS fallback.
 */
export function navigateToSection(id: string) {
  scrollToSection(id);
  const hash = `#${id}`;
  if (typeof window !== 'undefined' && window.location.hash !== hash) {
    window.history.pushState(null, '', hash);
  }
}

/**
 * Reports which of `ids` is currently the active section.
 *
 * A single IntersectionObserver watches every section against a band across
 * the middle of the viewport; the topmost section intersecting that band wins.
 * Back / forward navigation (popstate) and an initial load with a hash are both
 * honoured so the indicator and the document agree.
 */
export function useScrollSpy(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.intersectionRatio);
          else visible.delete(entry.target.id);
        }
        // Choose the section highest up the document that is currently in the
        // observation band, so the indicator moves as the reader progresses.
        const current = ids.find((id) => visible.has(id));
        if (current) setActive(current);
      },
      {
        // A band roughly through the upper-middle of the viewport: a section is
        // "active" once its top passes below the header and before it leaves.
        rootMargin: '-45% 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 1],
      },
    );

    sections.forEach((el) => observer.observe(el));

    // Keep the indicator in step with the document on back / forward.
    const syncFromHash = () => {
      const id = window.location.hash.slice(1);
      if (id && ids.includes(id)) setActive(id);
    };
    window.addEventListener('popstate', syncFromHash);

    // Honour a hash present on first load (deep link into a section).
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      if (ids.includes(id)) {
        setActive(id);
        // Defer so layout is settled before the initial jump.
        requestAnimationFrame(() => scrollToSection(id));
      }
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('popstate', syncFromHash);
    };
  }, [ids]);

  return active;
}
