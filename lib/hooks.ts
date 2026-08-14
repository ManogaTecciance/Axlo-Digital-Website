'use client';

import { useEffect, useState } from 'react';

/** Tracks a media query with an SSR-safe initial value. */
export function useMediaQuery(query: string, defaultValue = false): boolean {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/**
 * True when motion should be suppressed — either the OS preference or the
 * in-page control (data-motion="reduced" on <html>).
 */
export function useReducedMotion(): boolean {
  const systemPreference = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [manual, setManual] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setManual(root.dataset.motion === 'reduced');
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
    return () => observer.disconnect();
  }, []);

  return systemPreference || manual;
}

/** Desktop-class pointer: fine pointer + hover. Gates the custom cursor. */
export function useFinePointer(): boolean {
  return useMediaQuery('(hover: hover) and (pointer: fine)');
}

/** Reports whether an element has entered the viewport (once by default). */
export function useInViewport<T extends Element>(
  ref: React.RefObject<T | null>,
  { once = true, rootMargin = '-10% 0px -10% 0px' } = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, once, rootMargin]);

  return inView;
}

/* `useWebGLSupport` and `useLowPowerDevice` lived here to gate a three.js hero
   that no longer exists. Both were dead API surface once the hero became an
   image composition, and three.js has been dropped from the dependency list. */

/** Scroll position past a threshold — used by the sticky header. */
export function useScrolled(threshold = 8): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

/**
 * True only after the first client render.
 *
 * Used to keep mount animations off the server-rendered output: a component
 * that animates in on state change should render its *final* state on first
 * paint, never an `opacity: 0` start state that a non-JS visitor would be
 * stuck with.
 */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
