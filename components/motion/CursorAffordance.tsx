'use client';

import { useEffect, useRef, useState } from 'react';
import { useFinePointer, useReducedMotion } from '@/lib/hooks';
import styles from './CursorAffordance.module.css';

/**
 * Cursor affordance.
 *
 * Deliberately *additive*: the system cursor is never hidden, so forms,
 * buttons and text selection behave exactly as the OS intends. This element
 * only appears while the pointer is over something explicitly marked with
 * `data-cursor="<label>"` — a project preview or a draggable surface — and
 * shows what that interaction does.
 *
 * Disabled entirely on touch/coarse pointers and under reduced motion.
 */
export function CursorAffordance() {
  const finePointer = useFinePointer();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!finePointer || reduced) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const render = () => {
      frame = 0;
      const node = ref.current;
      if (node) node.style.translate = `${x}px ${y}px`;
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);

      const target = (event.target as Element | null)?.closest<HTMLElement>('[data-cursor]');
      setLabel(target?.dataset.cursor ?? null);
    };

    const onLeave = () => setLabel(null);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [finePointer, reduced]);

  if (!finePointer || reduced) return null;

  return (
    <div
      ref={ref}
      className={`${styles.cursor} ${label ? styles.visible : ''}`}
      aria-hidden="true"
      data-decorative
    >
      {label}
    </div>
  );
}
