import type { ReactElement } from 'react';
import styles from './BrandProposition.module.css';

/* --------------------------------------------------------------------------
   Stage diagrams.

   Four geometric figures on one 120 × 72 grid, drawn in strokes rather than
   illustration. Each one states what its stage does to the material handed to
   it: scattered signals resolve into a direction, that direction becomes a
   structure, the structure becomes layered systems, and the systems close
   into a loop that feeds itself.

   All four are decorative — every stage's meaning is carried by its heading
   and copy — so the wrapper marks them `aria-hidden`. Motion lives in the
   stylesheet, keyed off the parent module's hover / focus state.
   -------------------------------------------------------------------------- */

export type StageVisual = 'think' | 'design' | 'build' | 'evolve';

function Think() {
  // Five loose observations, each thrown forward into one resolved direction.
  const points = [
    [16, 12],
    [10, 34],
    [26, 56],
    [32, 22],
    [18, 46],
  ];

  return (
    <>
      <g className={styles.dRays}>
        {points.map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x} ${y} L64 36`} className={styles.dHair} />
        ))}
      </g>

      <g className={styles.dPoints}>
        {points.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" className={styles.dDot} />
        ))}
      </g>

      <circle cx="66" cy="36" r="4.5" className={styles.dNode} />

      <g className={styles.dArrow}>
        <path d="M72 36 H104" className={styles.dStroke} />
        <path d="M99 31 L104 36 L99 41" className={styles.dStroke} fill="none" />
      </g>
    </>
  );
}

function Design() {
  // The resolved direction becomes an interface: frame, chrome, regions.
  return (
    <>
      <rect x="8" y="8" width="104" height="56" rx="1" className={styles.dFrame} />
      <path d="M8 23 H112" className={styles.dHair} />
      <path d="M40 23 V64" className={styles.dHair} />

      <circle cx="15" cy="15.5" r="1.6" className={styles.dDot} />
      <circle cx="21" cy="15.5" r="1.6" className={styles.dHairDot} />
      <circle cx="27" cy="15.5" r="1.6" className={styles.dHairDot} />

      <g className={styles.dCells}>
        <rect x="48" y="31" width="26" height="12" className={styles.dCell} />
        <rect x="80" y="31" width="24" height="12" className={styles.dCell} />
        <rect x="48" y="49" width="56" height="8" className={styles.dCell} />
      </g>

      <path d="M16 31 H32" className={styles.dHair} />
      <path d="M16 39 H32" className={styles.dHair} />
      <path d="M16 47 H26" className={styles.dHair} />
    </>
  );
}

function Build() {
  // The structure becomes layered services, held together by one system line.
  const layers = [
    { x: 38, y: 12 },
    { x: 28, y: 30 },
    { x: 18, y: 48 },
  ];

  return (
    <>
      <path d="M22 54 L42 18" className={styles.dSpine} />

      <g className={styles.dLayers}>
        {layers.map((layer, index) => (
          <g key={layer.y} style={{ ['--layer' as string]: String(index) }} className={styles.dLayer}>
            <rect x={layer.x} y={layer.y} width="62" height="13" rx="1" className={styles.dFrame} />
            <path d={`M${layer.x + 10} ${layer.y + 6.5} H${layer.x + 52}`} className={styles.dHair} />
          </g>
        ))}
      </g>

      <circle cx="42" cy="18.5" r="2.6" className={styles.dDot} />
      <circle cx="32" cy="36.5" r="2.6" className={styles.dDot} />
      <circle cx="22" cy="54.5" r="2.6" className={styles.dNode} />
    </>
  );
}

function Evolve() {
  // The system closes on itself, and the signal it returns trends upward.
  return (
    <>
      <circle cx="40" cy="36" r="21" className={styles.dLoop} />
      <path d="M35 16.5 L40 12 L45 17" className={styles.dStroke} fill="none" />

      <circle cx="40" cy="36" r="9" className={styles.dHairRing} />
      <circle cx="40" cy="36" r="2.6" className={styles.dNode} />

      <g className={styles.dSignal}>
        <path d="M76 56 L86 46 L94 50 L108 28" className={styles.dStroke} fill="none" />
        <circle cx="108" cy="28" r="3" className={styles.dPulse} />
      </g>

      <path d="M76 62 H108" className={styles.dHair} />
    </>
  );
}

const figures: Record<StageVisual, () => ReactElement> = {
  think: Think,
  design: Design,
  build: Build,
  evolve: Evolve,
};

export function StageDiagram({ visual }: { visual: StageVisual }) {
  const Figure = figures[visual];

  return (
    <div className={styles.diagram} aria-hidden="true" data-decorative>
      <svg viewBox="0 0 120 72" className={styles.diagramSvg} focusable="false">
        <Figure />
      </svg>
    </div>
  );
}
