import type { Transition, Variants } from 'motion/react';

/**
 * Motion tokens for the component tier.
 *
 * Scroll reveals deliberately do **not** live here — they are CSS-driven and
 * progressively enhanced (see components/motion/Reveal.tsx), because a Motion
 * `initial` variant would serialise `opacity: 0` into the server HTML and hide
 * content from anyone whose JavaScript does not run.
 *
 * Mirrors the timing tokens in styles/tokens.css.
 */
export const duration = {
  micro: 0.15,
  component: 0.22,
  reveal: 0.56,
  hero: 1.2,
} as const;

export const easeFlow = [0.22, 1, 0.36, 1] as const;

export const transitions = {
  micro: { duration: duration.micro, ease: easeFlow } satisfies Transition,
  component: { duration: duration.component, ease: easeFlow } satisfies Transition,
  reveal: { duration: duration.reveal, ease: easeFlow } satisfies Transition,
};

/** Content swap inside the service index, capability map and POS demo. */
export const panelVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: transitions.component },
  exit: { opacity: 0, y: -8, transition: { duration: duration.micro, ease: easeFlow } },
};

/**
 * Reduced-motion equivalents. Same states, opacity only, no travel — consumers
 * swap these in when the user prefers reduced motion so that transitions stay
 * meaningful without movement.
 */
export const reducedVariants: Variants = {
  hidden: { opacity: 0 },
  shown: { opacity: 1, transition: { duration: 0.12 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};
