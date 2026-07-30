import { ImageResponse } from 'next/og';

/**
 * Apple touch icon.
 *
 * Generated rather than checked in as a binary: iOS needs a 180×180 raster with
 * no transparency and no rounding of its own (the OS applies the mask), which
 * is exactly the kind of thing that rots when the brand mark changes and the
 * PNG does not. This renders from the same geometry as `app/icon.svg`.
 */
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // Solid, not transparent — iOS composites the icon onto the home
          // screen without a backdrop of its own.
          background: '#0B1220',
        }}
      >
        <svg width="132" height="132" viewBox="0 0 64 64">
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
      </div>
    ),
    size,
  );
}
