import Link from 'next/link';
import styles from './Logo.module.css';

/**
 * Axlo Digital logo.
 *
 * The supplied brand lockup (public/brand/axlo-logo-light.svg) inlined so it
 * inherits the theme and stays crisp at any size. The "AXLO" glyphs and arrow
 * are vector paths; the letters use `currentColor` (near-white on the dark
 * canvas), the diagonal keeps the brand flow gradient, and "DIGITAL" is set in
 * the site font. `size` controls the rendered height — width follows the
 * lockup's 3:1 aspect ratio automatically.
 */
function LogoArt() {
  return (
    <svg
      className={styles.art}
      viewBox="0 0 591.26 196.43"
      role="img"
      aria-label="Axlo Digital"
      focusable="false"
    >
      <defs>
        <linearGradient
          id="axlo-logo-flow"
          x1="217.94"
          y1="188.73"
          x2="217.94"
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
        <path d="M591.25,77.87c.66,26.92-19.28,48.5-45.94,48.54-21.08.03-41.71.73-62.71-.33-25.31-1.28-41.63-23.58-42.13-47.62s16.37-47.01,42.27-47.09l62.58-.2c25.87-.08,45.3,20.63,45.94,46.7ZM543.91,108.08c17.4.01,29.09-14.38,28.55-30.14s-12.66-28.32-29.1-28.21l-57.28.39c-16.08.11-26.93,14.82-26.2,30.12s11.43,27.8,26.77,27.81l57.26.03Z" />
        <path d="M156.85,115.81l-12.99,10.63-75.12-.08,15.7-22.68,34.31-.2-38.68-47.95L25.05,126.41l-25.05-.12L68.24,36.58c3.02-4.01,7.21-6.53,11.63-6.71,4.93-.21,9.53,2.07,12.87,6.22l64.11,79.71Z" />
        <path d="M435.62,108.27l.12,18.23h-58.04c-20.73,0-39.37-12.76-40.05-34.1V31.26s23.17-.03,23.17-.03l.02,58.19c.33,12.08,10.58,18.15,22.8,19.01l51.99-.15Z" />
        <polygon points="230.15 55.76 211.02 71.28 163.61 30.17 200.43 30.22 230.15 55.76" />
        <polygon points="245.64 101.39 264.77 85.87 312.25 127.1 275.31 127.04 245.64 101.39" />
      </g>

      <polygon
        fill="url(#axlo-logo-flow)"
        points="318.23 0 78.05 188.68 115.4 188.73 357.84 .06 318.23 0"
      />

      <text className={styles.sub} transform="translate(239.5 188.82)">
        <tspan letterSpacing="1.12em" x="0" y="0">
          DIGI
        </tspan>
        <tspan letterSpacing="1.03em" x="218.23" y="0">
          T
        </tspan>
        <tspan letterSpacing="1.12em" x="272.39" y="0">
          AL
        </tspan>
      </text>
    </svg>
  );
}

/**
 * Axlo Digital wordmark.
 *
 * Renders as an `<a>` (via next/link) when `as="link"`, or a plain `<span>`
 * when `as="static"` — used inside the header, footer and mobile-menu anchors
 * that carry their own accessible name.
 */
export function Logo({
  size = '1.875rem',
  href = '/',
  as = 'link',
}: {
  size?: string;
  /** Kept for API compatibility; the lockup renders the same either way. */
  compact?: boolean;
  href?: string;
  as?: 'link' | 'static';
}) {
  const className = styles.logo;
  const style = { ['--logo-size' as string]: size };

  if (as === 'static') {
    return (
      <span className={className} style={style}>
        <LogoArt />
      </span>
    );
  }

  return (
    <Link className={className} style={style} href={href} aria-label="Axlo Digital">
      <LogoArt />
    </Link>
  );
}
