'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Section } from '@/components/layout/Layout';
import { brandStages } from '@/content/company';
import { isCaptureMode } from '@/components/motion/Reveal';
import { useReducedMotion } from '@/lib/hooks';
import { StageDiagram } from './ProcessDiagrams';
import type { StageVisual } from './ProcessDiagrams';
import styles from './BrandProposition.module.css';

/* --------------------------------------------------------------------------
   Entrance sequence.

   Same contract as `Reveal`: the server never sends hidden content. The
   section renders in its final state, and only after hydration — and only if
   it is still below the fold — is it put into the pending state and released
   by an IntersectionObserver.

   Ordering (heading → ribbon → Think → Design → Build → Evolve) is expressed
   entirely as transition delays in the stylesheet, so the whole sequence
   costs one observer and no animation library.
   -------------------------------------------------------------------------- */
function useEntranceSequence(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  const [state, setState] = useState<'pending' | 'shown'>('shown');

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Two reasons this branch releases the section rather than merely
    // declining to hide it:
    //
    // 1. `enabled` arrives as `true` on the very first layout pass — the
    //    reduced-motion media query is only read in an effect, which runs
    //    after this — so a visitor who asked for reduced motion briefly gets
    //    `enabled: true` and the section is put into the pending state. When
    //    the real preference lands this must release it, or the sequence stays
    //    pending for the rest of the session.
    // 2. This band runs its own observer, so it needs the same
    //    screenshot-capture bypass as `Reveal` (see the note there) or it is
    //    the one blank stripe left in an automated capture.
    if (!enabled || isCaptureMode() || typeof IntersectionObserver === 'undefined') {
      setState('shown');
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return;

    setState('pending');

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState('shown');
        observer.disconnect();
      },
      // Fires once a meaningful slice of the section is on screen, so the
      // sequence is not already half over by the time it is read.
      { rootMargin: '-10% 0px -15% 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, enabled]);

  return state;
}

/* --------------------------------------------------------------------------
   The flow ribbon.

   One stroke that climbs a step at each stage: flat across a module, then a
   short rise into the next. The geometry is shared with the layout — a module
   is raised by `(3 − index) × --rise`, and the ribbon's level for that module
   is the same figure in user units — so every module's top-left corner lands
   exactly on the ribbon without either side hard-coding the other's numbers.

   `preserveAspectRatio="none"` lets the ribbon stretch to any width; the
   viewBox height matches the rendered height 1:1, so the steps stay true, and
   `vector-effect` keeps the stroke an even 2px through the distortion.
   -------------------------------------------------------------------------- */
const SPAN = 300; // horizontal user units per stage
const FLAT = 230; // how much of a span is level before the rise begins
const LEVELS = [72, 48, 24, 0]; // y per stage — lower index sits lower

function segmentPath(index: number) {
  const x0 = index * SPAN;
  const y0 = LEVELS[index];
  const end = x0 + SPAN;

  if (index === LEVELS.length - 1) return `M${x0} ${y0} H${end}`;

  const flatEnd = x0 + FLAT;
  const y1 = LEVELS[index + 1];
  const mid = (flatEnd + end) / 2;
  return `M${x0} ${y0} H${flatEnd} C${mid} ${y0} ${mid} ${y1} ${end} ${y1}`;
}

const segments = LEVELS.map((_, index) => segmentPath(index));

function FlowRibbon({ active }: { active: number | null }) {
  return (
    <svg
      className={styles.ribbon}
      viewBox={`0 0 ${SPAN * LEVELS.length} ${LEVELS[0]}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      data-decorative
    >
      <defs>
        <linearGradient id="axlo-flow-ribbon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--gradient-flow-stop-1)" />
          <stop offset="55%" stopColor="var(--gradient-flow-stop-2)" />
          <stop offset="100%" stopColor="var(--gradient-flow-stop-3)" />
        </linearGradient>
      </defs>

      {/* Resting stroke — always present, so the path reads even before the
          draw runs and after it finishes. */}
      <path
        d={segments.join(' ')}
        className={styles.ribbonBase}
        vectorEffect="non-scaling-stroke"
      />

      {/* The signal itself: aqua at the source, lime by the loop. */}
      <path
        d={segments.join(' ')}
        className={styles.ribbonFlow}
        pathLength={1}
        vectorEffect="non-scaling-stroke"
      />

      {segments.map((d, index) => (
        <path
          key={d}
          d={d}
          className={styles.ribbonSegment}
          data-lit={active === index ? 'true' : undefined}
          vectorEffect="non-scaling-stroke"
        />
      ))}

      <circle cx="0" cy={LEVELS[0]} r="5" className={styles.ribbonSource} />
    </svg>
  );
}

/* --------------------------------------------------------------------------
   Section 02 — how we work.

   A compact editorial band over a connected flow system: four stages stepping
   upward left to right, each with its own geometric figure, threaded by a
   single ribbon that starts as an aqua signal and closes as a feedback loop.
   Sized to sit inside a 1440 × 900 viewport — a statement of method, not a
   scroll experience, so it is never pinned and never takes the scroll.
   -------------------------------------------------------------------------- */
const visuals: StageVisual[] = ['think', 'design', 'build', 'evolve'];

export function BrandProposition() {
  const innerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const sequence = useEntranceSequence(innerRef, !reduced);
  const [active, setActive] = useState<number | null>(null);

  return (
    <Section theme="dark" size="flush" id="how-we-work" labelledBy="proposition-heading">
      <div className={styles.inner} ref={innerRef} data-sequence={sequence}>
        <div className={styles.intro}>
          <div className={styles.introLead}>
            <p className={styles.eyebrow}>
              <span className={styles.eyebrowRule} aria-hidden="true" />
              How we work
            </p>

            <h2 className={styles.statement} id="proposition-heading">
              From one idea
              <br />
              to one{' '}
              <span className={styles.statementMark}>
                connected
                <br />
                ecosystem
              </span>
              .
            </h2>
          </div>

          <div className={styles.introAside}>
            <p className={styles.supporting}>
              We connect strategy, people, technology, and operations to create products that are
              easier to use, faster to manage, and ready to scale.
            </p>

            <p className={styles.flowLabel}>
              {brandStages.map((stage, index) => (
                <span key={stage.id} className={styles.flowLabelItem}>
                  {index > 0 ? (
                    <span className={styles.flowLabelArrow} aria-hidden="true">
                      →
                    </span>
                  ) : null}
                  {stage.name}
                </span>
              ))}
            </p>
          </div>
        </div>

        {/* The ribbon is a sibling of the list, not a child: `ol` may only
            contain `li`, and the connector carries nothing to parse. */}
        <div className={styles.flow} data-engaged={active === null ? undefined : 'true'}>
          <FlowRibbon active={active} />

          <ol className={styles.modules}>
            {brandStages.map((stage, index) => (
              <li
                key={stage.id}
                className={styles.module}
                style={{ ['--stage-index' as string]: String(index) } as CSSProperties}
                data-active={active === index ? 'true' : undefined}
                onPointerEnter={() => setActive(index)}
                onPointerLeave={() => setActive((current) => (current === index ? null : current))}
                onFocus={() => setActive(index)}
                onBlur={() => setActive((current) => (current === index ? null : current))}
              >
                <span className={styles.node} aria-hidden="true" />

                <div className={styles.moduleHead}>
                  {/* Exposed, not decorative: the stage order must not rest
                      on colour or on list markers that `list-style: none`
                      removes. */}
                  <span className={styles.moduleIndex}>{stage.index}</span>
                  <h3 className={styles.moduleName}>{stage.name}</h3>
                </div>

                <p className={styles.moduleLead}>{stage.summary}</p>

                <StageDiagram visual={visuals[index]} />

                {stage.detail ? <p className={styles.moduleDetail}>{stage.detail}</p> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
