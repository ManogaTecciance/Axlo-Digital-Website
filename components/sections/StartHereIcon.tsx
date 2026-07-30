'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';
import styles from './StartHereIcon.module.css';

/**
 * The Axlo brand icon (public/brand/axlo-digital-icon.svg), inlined so it
 * inherits the theme and can be animated. Decorative — hidden from assistive
 * technology.
 *
 * Scroll animation: as the section travels through the viewport the icon drifts
 * vertically (a gentle parallax against the scroll) and rotates a few degrees,
 * easing to full opacity in the middle of its pass. Restrained by design, and
 * held completely still under reduced motion.
 */
export function StartHereIcon() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Hooks run unconditionally; the values are simply not applied when the
  // visitor has asked for reduced motion.
  const y = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);
  const rotate = useTransform(scrollYProgress, [0, 1], [-7, 7]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.35, 1, 1, 0.35]);

  return (
    <div className={styles.host} ref={ref}>
      <motion.svg
        className={styles.icon}
        viewBox="0 0 279.79 188.73"
        aria-hidden="true"
        focusable="false"
        data-decorative
        style={reduced ? undefined : { y, rotate, opacity }}
      >
        <defs>
          <linearGradient
            id="axlo-icon-flow"
            x1="139.9"
            y1="188.73"
            x2="139.9"
            y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0" stopColor="#c7ff3d" stopOpacity="0" />
            <stop offset=".3" stopColor="#c7ff3d" />
            <stop offset=".5" stopColor="#00d4c7" />
            <stop offset=".7" stopColor="#00d4c7" />
            <stop offset="1" stopColor="#00d4c7" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g fill="currentColor">
          <polygon points="152.1 55.76 132.97 71.28 85.56 30.17 122.38 30.22 152.1 55.76" />
          <polygon points="167.6 101.39 186.73 85.87 234.2 127.1 197.26 127.04 167.6 101.39" />
        </g>
        <polygon
          fill="url(#axlo-icon-flow)"
          points="240.19 0 0 188.68 37.36 188.73 279.79 .06 240.19 0"
        />
      </motion.svg>
    </div>
  );
}
