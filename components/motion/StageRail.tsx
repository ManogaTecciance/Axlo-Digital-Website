'use client';

import { useRef } from 'react';
import { useInViewport, useReducedMotion } from '@/lib/hooks';
import styles from './FlowLine.module.css';

/**
 * A horizontal flow rail that draws across a row of stages when the row enters
 * the viewport. Decorative — the stage list itself carries all meaning, and
 * the rail is hidden below the breakpoint where the stages stack.
 */
export function StageRail({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  const reduced = useReducedMotion();

  return (
    <div className={className} ref={ref} aria-hidden="true" data-decorative>
      <svg
        width="100%"
        height="2"
        viewBox="0 0 1000 2"
        preserveAspectRatio="none"
        className={styles.flowLine}
        focusable="false"
      >
        <defs>
          <linearGradient id="axlo-stage-rail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gradient-flow-stop-1)" />
            <stop offset="55%" stopColor="var(--gradient-flow-stop-2)" />
            <stop offset="100%" stopColor="var(--gradient-flow-stop-3)" />
          </linearGradient>
        </defs>
        <line x1="0" y1="1" x2="1000" y2="1" stroke="var(--color-border)" strokeWidth="2" />
        <line
          x1="0"
          y1="1"
          x2="1000"
          y2="1"
          stroke="url(#axlo-stage-rail)"
          strokeWidth="2"
          data-flow-path
          data-drawn={inView && !reduced ? 'true' : undefined}
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: inView || reduced ? 0 : 1000,
            transition: reduced ? 'none' : 'stroke-dashoffset 1.1s var(--ease-flow)',
          }}
        />
      </svg>
    </div>
  );
}
