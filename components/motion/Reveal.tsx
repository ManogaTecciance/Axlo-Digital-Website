'use client';

import { Children, cloneElement, isValidElement, useLayoutEffect, useRef } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from '@/lib/hooks';

/* --------------------------------------------------------------------------
   Scroll reveals — progressive enhancement, not a Motion `initial` state.

   The important property: **the server never sends hidden content.** An
   `initial="hidden"` variant would serialise `opacity: 0` into the HTML, and
   anyone whose JavaScript fails, is blocked, or simply has not arrived yet
   would be looking at empty sections. Instead:

     1. The element is rendered plainly and is visible immediately.
     2. After hydration we check whether it is already on screen. If it is,
        it stays visible — nothing is hidden and nothing flashes.
     3. Only elements still below the fold are put into the pending state and
        revealed by an IntersectionObserver as they arrive.

   Under reduced motion, and where IntersectionObserver is unavailable, step 2
   is the only step that runs.

   The animation itself lives in CSS (`[data-reveal]` in globals.css), so this
   costs no animation library on the page.
   -------------------------------------------------------------------------- */

type RevealTag = 'div' | 'section' | 'li' | 'article' | 'header' | 'ol' | 'ul';

function useReveal(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (!enabled || typeof IntersectionObserver === 'undefined') {
      node.dataset.reveal = 'shown';
      return;
    }

    const rect = node.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (alreadyVisible) {
      node.dataset.reveal = 'shown';
      return;
    }

    node.dataset.reveal = 'pending';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        node.dataset.reveal = 'shown';
        observer.disconnect();
      },
      { rootMargin: '-8% 0px -8% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled]);
}

export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
}: {
  children: ReactNode;
  /** Seconds, matching the previous Motion API. Kept small — reveals must
   *  never gate reading. */
  delay?: number;
  as?: RevealTag;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useReveal(ref, !reduced);

  const style = delay ? ({ ['--reveal-delay' as string]: `${delay}s` } as CSSProperties) : undefined;

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}

/**
 * Staggered container. Each child is revealed on its own as it enters, and
 * carries an index so the CSS can offset its transition slightly.
 */
export function RevealGroup({
  children,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: RevealTag;
}) {
  // Hand each child its position so the stagger reads left-to-right / top-down
  // without every caller having to thread an index through its map.
  const staggered = Children.map(children, (child, index) =>
    isValidElement<{ index?: number }>(child) && child.type === RevealItem
      ? cloneElement(child, { index })
      : child,
  );

  return <Tag className={className}>{staggered}</Tag>;
}

export function RevealItem({
  children,
  className,
  index = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Position in its group — used only to offset the transition. */
  index?: number;
  as?: RevealTag;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useReveal(ref, !reduced);

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{ ['--reveal-delay' as string]: `${Math.min(index, 6) * 0.06}s` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
