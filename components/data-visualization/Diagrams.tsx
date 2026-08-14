import styles from './Diagrams.module.css';

/* --------------------------------------------------------------------------
   Small system diagrams.

   Each one is a specific statement about the idea it sits beside, not a
   decorative icon. All are marked decorative for assistive technology because
   the adjacent copy already carries the meaning — where a diagram is the only
   carrier of information it is given a role and label instead.
   -------------------------------------------------------------------------- */

type DiagramProps = { title?: string };

function wrapperProps(title?: string) {
  return title
    ? ({ role: 'img', 'aria-label': title } as const)
    : ({ 'aria-hidden': true, 'data-decorative': true } as const);
}

/** Service diagrams — one per capability, keyed by service slug. */
export function ServiceDiagram({ variant, title }: DiagramProps & { variant: string }) {
  const common = { className: styles.diagram, viewBox: '0 0 240 120', ...wrapperProps(title) };

  switch (variant) {
    case 'product-strategy-ux':
      // Divergent inputs converging into one prioritised sequence
      return (
        <svg {...common}>
          {[24, 48, 72].map((y, i) => (
            <circle key={i} className={styles.dotMuted} cx="24" cy={y} r="4" />
          ))}
          <path className={styles.lineDashed} d="M32 24 C 80 24, 80 60, 118 60" />
          <path className={styles.lineDashed} d="M32 48 C 80 48, 84 60, 118 60" />
          <path className={styles.lineDashed} d="M32 72 C 80 72, 84 60, 118 60" />
          <circle className={styles.dot} cx="124" cy="60" r="6" />
          <path className={styles.lineAccent} d="M132 60 H160" />
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              className={i === 0 ? styles.barAccent : styles.bar}
              x={168}
              y={44 + i * 12}
              width={56 - i * 12}
              height="6"
              rx="3"
            />
          ))}
          <text className={styles.label} x="164" y="36">
            SEQUENCE
          </text>
        </svg>
      );

    case 'ui-ux-design-systems':
      // Tokens → components → composed screens
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} className={styles.frame} x="16" y={22 + i * 20} width="34" height="12" rx="3" />
          ))}
          <path className={styles.lineDashed} d="M56 60 H92" />
          {[0, 1].map((i) => (
            <rect key={i} className={styles.frameStrong} x="98" y={30 + i * 34} width="46" height="26" rx="4" />
          ))}
          <rect className={styles.barAccent} x="104" y="36" width="20" height="4" rx="2" />
          <rect className={styles.bar} x="104" y="44" width="32" height="4" rx="2" />
          <rect className={styles.barAccent} x="104" y="70" width="26" height="4" rx="2" />
          <rect className={styles.bar} x="104" y="78" width="30" height="4" rx="2" />
          <path className={styles.lineDashed} d="M150 60 H176" />
          <rect className={styles.frameStrong} x="182" y="22" width="44" height="76" rx="5" />
          <rect className={styles.highlight} x="190" y="30" width="18" height="3" rx="1.5" />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} className={styles.bar} x="190" y={40 + i * 12} width={28 - (i % 2) * 8} height="4" rx="2" />
          ))}
        </svg>
      );

    case 'web-mobile-engineering':
      // Client surfaces over a shared typed API layer
      return (
        <svg {...common}>
          <rect className={styles.frame} x="18" y="16" width="52" height="34" rx="4" />
          <rect className={styles.frame} x="94" y="16" width="34" height="34" rx="4" />
          <rect className={styles.frame} x="152" y="16" width="70" height="34" rx="4" />
          <text className={styles.label} x="18" y="12">
            SURFACES
          </text>
          <path className={styles.lineDashed} d="M44 50 V70" />
          <path className={styles.lineDashed} d="M111 50 V70" />
          <path className={styles.lineDashed} d="M187 50 V70" />
          <rect className={styles.frameStrong} x="18" y="70" width="204" height="18" rx="4" />
          <rect className={styles.barAccent} x="26" y="77" width="40" height="4" rx="2" />
          <text className={styles.label} x="18" y="102">
            TYPED API + TESTS
          </text>
          <path className={styles.lineAccent} d="M18 108 H222" />
        </svg>
      );

    case 'ai-business-automation':
      // Confidence routing: automatic path vs human review path
      return (
        <svg {...common}>
          <rect className={styles.frame} x="14" y="46" width="44" height="28" rx="4" />
          <text className={styles.label} x="14" y="42">
            INPUT
          </text>
          <path className={styles.lineDashed} d="M62 60 H92" />
          <circle className={styles.dot} cx="100" cy="60" r="7" />
          <path className={styles.lineAccent} d="M108 56 C 130 40, 140 30, 164 30" />
          <path className={styles.line} d="M108 64 C 130 80, 140 92, 164 92" />
          <rect className={styles.frameStrong} x="168" y="16" width="58" height="28" rx="4" />
          <rect className={styles.barAccent} x="176" y="26" width="30" height="4" rx="2" />
          <text className={styles.label} x="168" y="12">
            AUTO
          </text>
          <rect className={styles.frame} x="168" y="78" width="58" height="28" rx="4" />
          <rect className={styles.bar} x="176" y="88" width="34" height="4" rx="2" />
          <text className={styles.label} x="168" y="74">
            REVIEW
          </text>
        </svg>
      );

    case 'enterprise-software':
      // Disconnected systems reconciled into one canonical record
      return (
        <svg {...common}>
          {[
            [18, 18],
            [18, 76],
            [88, 18],
            [88, 76],
          ].map(([x, y], i) => (
            <rect key={i} className={styles.frame} x={x} y={y} width="46" height="26" rx="4" />
          ))}
          <path className={styles.lineDashed} d="M64 31 H154" />
          <path className={styles.lineDashed} d="M64 89 C 110 89, 120 60, 154 60" />
          <path className={styles.lineDashed} d="M134 31 C 146 31, 146 54, 154 60" />
          <path className={styles.lineDashed} d="M134 89 C 146 89, 146 66, 154 60" />
          <rect className={styles.frameStrong} x="158" y="38" width="66" height="44" rx="5" />
          <rect className={styles.highlight} x="166" y="46" width="20" height="3" rx="1.5" />
          <rect className={styles.bar} x="166" y="55" width="48" height="4" rx="2" />
          <rect className={styles.bar} x="166" y="64" width="36" height="4" rx="2" />
          <text className={styles.label} x="158" y="96">
            ONE RECORD
          </text>
        </svg>
      );

    default:
      // Continuous improvement loop with a measurement gate
      return (
        <svg {...common}>
          <path
            className={styles.lineDashed}
            d="M60 30 H180 A26 26 0 0 1 180 82 H60 A26 26 0 0 1 60 30 Z"
          />
          {[
            [60, 30],
            [180, 30],
            [180, 82],
            [60, 82],
          ].map(([x, y], i) => (
            <circle key={i} className={i === 1 ? styles.dot : styles.dotMuted} cx={x} cy={y} r="5" />
          ))}
          <rect className={styles.frameStrong} x="94" y="42" width="52" height="28" rx="4" />
          <rect className={styles.barAccent} x="102" y="50" width="22" height="4" rx="2" />
          <rect className={styles.bar} x="102" y="58" width="34" height="4" rx="2" />
          <text className={styles.label} x="94" y="102">
            MEASURE → SHIP
          </text>
        </svg>
      );
  }
}

/** Value-panel diagrams for the "Why Axlo" section. */
export function ValueDiagram({ variant, title }: DiagramProps & { variant: string }) {
  const common = { className: styles.diagram, viewBox: '0 0 160 90', ...wrapperProps(title) };

  switch (variant) {
    case 'acceleration':
      return (
        <svg {...common}>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              className={i === 3 ? styles.highlight : styles.bar}
              x={16 + i * 34}
              y={62 - i * 12}
              width="22"
              height={12 + i * 12}
              rx="3"
            />
          ))}
          <path className={styles.lineAccent} d="M16 70 L138 22" />
        </svg>
      );
    case 'link':
      return (
        <svg {...common}>
          {[
            [26, 24],
            [26, 66],
            [80, 45],
            [134, 24],
            [134, 66],
          ].map(([x, y], i) => (
            <circle key={i} className={i === 2 ? styles.dot : styles.dotMuted} cx={x} cy={y} r={i === 2 ? 7 : 5} />
          ))}
          <path className={styles.lineDashed} d="M31 26 L74 43 M31 64 L74 47 M86 43 L129 26 M86 47 L129 64" />
        </svg>
      );
    case 'human':
      return (
        <svg {...common}>
          <circle className={styles.dot} cx="80" cy="30" r="9" />
          <path className={styles.lineAccent} d="M62 62 C 66 46, 94 46, 98 62" />
          {[
            [24, 30],
            [136, 30],
            [24, 70],
            [136, 70],
          ].map(([x, y], i) => (
            <rect key={i} className={styles.frame} x={x - 14} y={y - 9} width="28" height="18" rx="3" />
          ))}
          <path className={styles.lineDashed} d="M38 30 H68 M92 30 H122 M38 70 H62 M98 70 H122" />
        </svg>
      );
    case 'ownership':
      return (
        <svg {...common}>
          <rect className={styles.frameStrong} x="20" y="18" width="120" height="54" rx="6" />
          <rect className={styles.barAccent} x="32" y="30" width="34" height="4" rx="2" />
          <rect className={styles.bar} x="32" y="42" width="62" height="4" rx="2" />
          <rect className={styles.bar} x="32" y="54" width="48" height="4" rx="2" />
          <circle className={styles.highlight} cx="122" cy="34" r="5" />
          <path className={styles.lineAccent} d="M104 58 H128" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`${row}-${col}`}
                className={row === 0 && col === 3 ? styles.highlight : styles.frame}
                x={20 + col * 32}
                y={16 + row * 24}
                width="24"
                height="16"
                rx="3"
                opacity={row === 2 ? 0.45 : 1}
              />
            )),
          )}
          <path className={styles.lineDashed} d="M32 74 H140" />
        </svg>
      );
  }
}
