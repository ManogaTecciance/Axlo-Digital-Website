import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

/**
 * Social share card.
 *
 * Replaces `/og/axlo-default.svg`. Facebook, LinkedIn, X and Slack all decline
 * to render SVG open-graph images, so the previous default silently produced a
 * blank card everywhere it mattered. This emits a real 1200×630 PNG at build
 * time, drawn from the brand tokens so it cannot drift from the site.
 *
 * Next serves this for both `og:image` and `twitter:image` automatically, and
 * `app/twitter-image` is not needed — the Twitter card falls back to this file.
 */
export const alt = `${site.name} — Connected Digital Products for Real Operations`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0B1220',
          // The aqua bloom the hero uses, flattened into a static wash.
          backgroundImage:
            'radial-gradient(1100px 600px at 78% -10%, rgba(0,212,199,0.20), rgba(11,18,32,0) 62%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="52" height="52" viewBox="0 0 64 64">
            <defs>
              <linearGradient id="f" x1="32" y1="58" x2="32" y2="6" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#c7ff3d" stopOpacity="0" />
                <stop offset=".3" stopColor="#c7ff3d" />
                <stop offset=".5" stopColor="#00d4c7" />
                <stop offset=".7" stopColor="#00d4c7" />
                <stop offset="1" stopColor="#00d4c7" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g fill="#ffffff">
              <polygon points="34.8 24.6 30.4 28.2 19.6 18.7 28 18.7 34.8 24.6" />
              <polygon points="38.3 35.1 42.7 31.5 53.6 41 45.1 41 38.3 35.1" />
            </g>
            <polygon fill="url(#f)" points="52.9 6 6 42.8 13.4 42.8 60.7 6 52.9 6" />
          </svg>
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#C4CED6',
            }}
          >
            {site.name}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 74,
            lineHeight: 1.06,
            letterSpacing: -2.4,
            fontWeight: 700,
            color: '#FFFFFF',
            maxWidth: 940,
          }}
        >
          Connected digital products for real operations.
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 96, height: 4, background: 'linear-gradient(90deg,#00D4C7,#C7FF3D)' }} />
          <div style={{ fontSize: 26, color: '#C4CED6' }}>{site.tagline}</div>
        </div>
      </div>
    ),
    size,
  );
}
