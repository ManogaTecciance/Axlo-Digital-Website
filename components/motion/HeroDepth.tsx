'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { useFinePointer, useReducedMotion } from '@/lib/hooks';

/** Peak travel of the composition, in pixels. Kept inside the 6–10px band —
 *  enough to read as depth from the corner of the eye, never as movement. */
const TRAVEL = 8;

/**
 * The hero composition's pointer response.
 *
 * Publishes two normalised values (`--depth-x` / `--depth-y`, each −1…1) as
 * custom properties on the wrapper; the stylesheet decides what moves and by
 * how much, so the tiles can drift by different amounts and read as layers.
 *
 * Deliberately narrow:
 *  • Nothing runs unless the visitor has a fine pointer (so never on touch,
 *    where a stale hover state would strand the composition off-centre) and
 *    has not asked for reduced motion.
 *  • One passive listener on the element, coalesced into a single rAF, so a
 *    pointer sweep costs one style write per frame rather than one per event.
 *  • The properties are only ever read by `transform`, which is composited —
 *    this never triggers layout.
 *  • On leave it eases back to centre rather than snapping.
 *
 * `children` renders identically with or without any of this; a visitor with
 * JavaScript disabled sees the finished composition at rest.
 */
export function HeroDepth({
  children,
  className,
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const finePointer = useFinePointer();
  const active = finePointer && !reduced;

  useEffect(() => {
    const node = ref.current;
    if (!node || !active) return;

    let frame = 0;
    let pending: { x: number; y: number } | null = null;

    const write = () => {
      frame = 0;
      if (!pending) return;
      node.style.setProperty('--depth-x', pending.x.toFixed(3));
      node.style.setProperty('--depth-y', pending.y.toFixed(3));
    };

    const schedule = (x: number, y: number) => {
      pending = { x, y };
      if (!frame) frame = requestAnimationFrame(write);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const rect = node.getBoundingClientRect();
      // −1 at the left/top edge, +1 at the right/bottom.
      schedule(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        ((event.clientY - rect.top) / rect.height) * 2 - 1,
      );
    };

    const onLeave = () => schedule(0, 0);

    node.addEventListener('pointermove', onMove, { passive: true });
    node.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      node.removeEventListener('pointermove', onMove);
      node.removeEventListener('pointerleave', onLeave);
      node.style.removeProperty('--depth-x');
      node.style.removeProperty('--depth-y');
    };
  }, [active]);

  return (
    <div
      ref={ref}
      className={className}
      data-depth={active ? 'on' : undefined}
      style={{ ['--depth-travel' as string]: `${TRAVEL}px` }}
      {...rest}
    >
      {children}
    </div>
  );
}
