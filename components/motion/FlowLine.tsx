'use client';

import { useRef } from 'react';
import { useInViewport, useReducedMotion } from '@/lib/hooks';
import styles from './FlowLine.module.css';

/** Reusable gradient defs. Rendered once per SVG that needs them. */
export function FlowGradientDefs({ id = 'axlo-flow-gradient' }: { id?: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--gradient-flow-stop-1)" />
        <stop offset="55%" stopColor="var(--gradient-flow-stop-2)" />
        <stop offset="100%" stopColor="var(--gradient-flow-stop-3)" />
      </linearGradient>
    </defs>
  );
}

type FlowConnectorProps = {
  /** Visual variant of the boundary path. */
  shape?: 'diagonal' | 'step' | 'branch';
  /** Show a single travelling packet to indicate direction. */
  withPacket?: boolean;
  /** Theme of the band the connector belongs to — usually the section below. */
  theme?: 'dark';
};

/**
 * Section-boundary connector.
 *
 * Purely decorative: hidden from assistive technology. It exists to make the
 * alternating dark/light bands read as one continuous flow rather than stacked
 * blocks. The path draws once on entry, then holds.
 */
export function FlowConnector({ shape = 'diagonal', withPacket = false, theme }: FlowConnectorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  const reduced = useReducedMotion();

  const paths = {
    diagonal: 'M0 96 L340 96 L620 8 L1440 8',
    step: 'M0 20 L420 20 L560 88 L1000 88 L1120 20 L1440 20',
    branch: 'M0 88 L380 88 L520 20 L900 20 M520 20 L700 92 L1440 92',
  } as const;

  return (
    <div className={styles.connector} ref={ref} data-theme={theme} aria-hidden="true" data-decorative>
      <svg
        className={styles.connectorSvg}
        viewBox="0 0 1440 104"
        preserveAspectRatio="none"
        focusable="false"
      >
        <FlowGradientDefs />
        <path className={`${styles.path} ${styles.pathTrack}`} d={paths[shape]} />
        <path
          className={`${styles.path} ${styles.pathActive}`}
          d={paths[shape]}
          data-flow-path
          data-drawn={inView && !reduced ? 'true' : undefined}
          style={{ ['--flow-dash-length' as string]: '2200' }}
        />
        {withPacket && !reduced ? (
          <circle
            className={`${styles.packet} axlo-ambient`}
            r="3.5"
            style={{ ['--flow-offset-path' as string]: `path('${paths[shape]}')` }}
          />
        ) : null}
      </svg>
    </div>
  );
}

/**
 * The Axlo slash. Used as the closing gesture of the page: the flow line that
 * has travelled through every section resolves into the mark from the logo.
 */
export function SlashMark({ size = 240 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  const reduced = useReducedMotion();

  return (
    <div ref={ref} aria-hidden="true" data-decorative style={{ width: size }}>
      <svg
        className={`${styles.slash} ${styles.slashDraw}`}
        data-drawn={inView || reduced ? 'true' : undefined}
        viewBox="0 0 120 160"
        focusable="false"
      >
        <defs>
          <linearGradient id="axlo-slash-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gradient-flow-stop-3)" />
            <stop offset="45%" stopColor="var(--gradient-flow-stop-2)" />
            <stop offset="100%" stopColor="var(--gradient-flow-stop-1)" />
          </linearGradient>
        </defs>
        <path className={styles.slashPath} d="M92 0h28L28 160H0L92 0Z" />
      </svg>
    </div>
  );
}
