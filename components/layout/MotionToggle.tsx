'use client';

import { usePreferences } from './ThemeProvider';
import styles from './MotionToggle.module.css';

/**
 * In-page reduced-motion control. Complements the OS setting for people who
 * want calmer motion on this site specifically, or who are on a device where
 * the OS preference is awkward to reach.
 *
 * This is the only remaining display preference: the site is dark-only, so
 * there is no theme to choose.
 */
export function MotionToggle() {
  const { motionPreference, setMotionPreference } = usePreferences();
  const reduced = motionPreference === 'reduced';

  return (
    <button
      type="button"
      className={styles.motionToggle}
      aria-pressed={reduced}
      onClick={() => setMotionPreference(reduced ? 'system' : 'reduced')}
    >
      <span className={styles.switchTrack} aria-hidden="true">
        <span className={styles.switchThumb} />
      </span>
      Reduce motion
    </button>
  );
}
