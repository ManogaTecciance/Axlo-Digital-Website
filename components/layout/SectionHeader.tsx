import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/foundations/Primitives';
import { Reveal } from '@/components/motion/Reveal';
import styles from './SectionHeader.module.css';

/**
 * The eyebrow → heading → lead ladder, in one place.
 *
 * Every band used to re-declare this with its own margins, which is how the
 * page ended up with four slightly different gaps between a heading and its
 * lead. The spacing here comes from the `--flow-*` tokens, so the rhythm is one
 * decision rather than one per section.
 */
export function SectionHeader({
  eyebrow,
  id,
  children,
  lead,
  width = 'default',
}: {
  eyebrow: string;
  /** Id for the heading — sections reference it from `aria-labelledby`. */
  id: string;
  /** The heading text. */
  children: ReactNode;
  lead?: ReactNode;
  width?: 'default' | 'wide';
}) {
  return (
    <Reveal className={`${styles.head} ${width === 'wide' ? styles.headWide : ''}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className={styles.heading} id={id}>
        {children}
      </h2>
      {lead ? <p className={styles.lead}>{lead}</p> : null}
    </Reveal>
  );
}
