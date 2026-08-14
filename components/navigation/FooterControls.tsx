'use client';

import { MotionToggle } from '@/components/layout/MotionToggle';
import styles from './Footer.module.css';

/** Motion control, duplicated in the footer so it is reachable at the end of a
 *  long page without scrolling back to the header. The site is dark-only, so
 *  there is no theme control to sit beside it. */
export function FooterControls() {
  return (
    <div className={styles.controls}>
      <MotionToggle />
    </div>
  );
}
