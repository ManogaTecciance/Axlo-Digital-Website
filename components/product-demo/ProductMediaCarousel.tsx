'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import type { ProductState } from '@/content/products';
import { track } from '@/lib/analytics';
import { useInViewport, useReducedMotion } from '@/lib/hooks';
import styles from './ProductMediaCarousel.module.css';

/** Slow by design: a product state has to be readable before it moves on. */
const AUTOPLAY_MS = 7000;

function PrevIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function NextIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M5.5 3.5v9M10.5 3.5v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M5 3.5 12.5 8 5 12.5Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Product state carousel.
 *
 * Drives a set of *rendered* interface states rather than image files, which is
 * what makes it shared between both products. Every state is in the DOM from
 * first paint and laid out in one grid cell, so the frame is as tall as its
 * tallest state and nothing shifts as the carousel moves — there is no reserved
 * box to get wrong and no image to lazy-load.
 *
 * Manual controls are always present: previous, next, one dot per state, the
 * position, and a pause / play toggle. The active state is announced politely
 * and **focus is never moved** when it changes.
 *
 * Autoplay is suspended whenever the visitor is likely engaged or not looking:
 * pointer over the carousel, keyboard focus inside it, the browser tab hidden,
 * or the section scrolled out of view. Under reduced motion it never runs, the
 * toggle is not rendered, and transitions collapse to a short crossfade.
 */
export function ProductMediaCarousel({
  states,
  label,
  render,
  analyticsProduct,
}: {
  states: ProductState[];
  /** Names the carousel for assistive technology, e.g. "AxloPOS". */
  label: string;
  /** Renders one state. */
  render: (state: ProductState) => ReactNode;
  analyticsProduct: string;
}) {
  const reduced = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(regionRef, { once: false });
  const groupId = useId();

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [wantsPlay, setWantsPlay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);

  const count = states.length;
  const active = states[index];

  const go = useCallback(
    (next: number, dir: number, method?: 'prev' | 'next' | 'dot' | 'swipe' | 'keyboard') => {
      setDirection(dir);
      setIndex(((next % count) + count) % count);
      if (method) track('product_carousel_interact', { product: analyticsProduct, method });
    },
    [count, analyticsProduct],
  );

  const prev = useCallback(
    (method?: 'prev' | 'swipe' | 'keyboard') => go(index - 1, -1, method),
    [go, index],
  );
  const next = useCallback(
    (method?: 'next' | 'swipe' | 'keyboard') => go(index + 1, 1, method),
    [go, index],
  );

  // Autoplay runs only when nothing suggests the visitor is engaged or away.
  const playing = wantsPlay && !reduced && !hovered && !focusWithin && !tabHidden && inView;

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    onVisibility();
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => go(index + 1, 1), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [playing, index, go]);

  // Arrow keys operate the carousel when focus is inside the region.
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev('keyboard');
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next('keyboard');
    }
  };

  // Touch / pointer swipe on the viewport.
  const pointerStart = useRef<number | null>(null);
  const onPointerDown = (event: ReactPointerEvent) => {
    if (event.pointerType === 'mouse') return;
    pointerStart.current = event.clientX;
  };
  const onPointerUp = (event: ReactPointerEvent) => {
    if (pointerStart.current === null) return;
    const dx = event.clientX - pointerStart.current;
    pointerStart.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) next('swipe');
    else prev('swipe');
  };

  return (
    // A group, not a section: the parent product article is the landmark; this
    // only needs the carousel role so assistive tech announces it as one.
    <div
      className={styles.carousel}
      ref={regionRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={`${label} product views`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocusWithin(false);
      }}
      onKeyDown={onKeyDown}
    >
      <div className={styles.viewport} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        {states.map((state, i) => {
          const isActive = i === index;
          return (
            <div
              key={state.id}
              className={styles.slide}
              data-active={isActive ? 'true' : 'false'}
              // Direction is only used for the entering transform, so a state
              // arriving from the left reads as coming from the left.
              data-direction={direction > 0 ? 'forward' : 'back'}
              // Inactive states leave the reading order and the a11y tree.
              aria-hidden={isActive ? undefined : 'true'}
              inert={isActive ? undefined : true}
            >
              {render(state)}
            </div>
          );
        })}
      </div>

      {/* Politely announces the active state. Never moves focus. */}
      <p className={styles.live} aria-live="polite">
        View {index + 1} of {count}: {active.label}
      </p>

      <p className={styles.caption} key={active.id}>
        {active.caption}
      </p>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <button
            type="button"
            className={styles.control}
            onClick={() => prev('prev')}
            aria-label={`Previous ${label} view`}
          >
            <PrevIcon />
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={() => next('next')}
            aria-label={`Next ${label} view`}
          >
            <NextIcon />
          </button>
        </div>

        <div className={styles.dots} role="group" aria-label={`Choose a ${label} view`}>
          {states.map((state, i) => (
            <button
              key={state.id}
              type="button"
              className={styles.dot}
              data-active={i === index ? 'true' : undefined}
              aria-current={i === index ? 'true' : undefined}
              aria-label={`Show view ${i + 1} of ${count}: ${state.label}`}
              onClick={() => go(i, i > index ? 1 : -1, 'dot')}
            />
          ))}
        </div>

        <div className={styles.controlGroup}>
          {/* Position and name, so state is legible without decoding the dots.
              Announced through the live region above, not twice. */}
          <span className={styles.position} aria-hidden="true">
            <span className={styles.counter}>
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <span className={styles.stateLabel} id={`${groupId}-label`}>
              {active.label}
            </span>
          </span>

          {!reduced ? (
            <button
              type="button"
              className={styles.control}
              onClick={() => {
                setWantsPlay((value) => !value);
                track('product_carousel_interact', {
                  product: analyticsProduct,
                  method: 'autoplay-toggle',
                });
              }}
              aria-pressed={wantsPlay}
              aria-label={
                wantsPlay
                  ? `Pause the automatic ${label} slideshow`
                  : `Play the automatic ${label} slideshow`
              }
            >
              {wantsPlay ? <PauseIcon /> : <PlayIcon />}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
