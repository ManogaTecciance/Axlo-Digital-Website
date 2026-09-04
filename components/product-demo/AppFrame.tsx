import type { ReactNode } from 'react';
import styles from './AppFrame.module.css';

/**
 * The window chrome every product state is drawn inside.
 *
 * ACCESSIBILITY
 * The frame is the accessibility boundary for the whole composition: it takes
 * `role="img"` and one `aria-label`, which makes every descendant
 * presentational. That is deliberate. These are conceptual product views built
 * from forty-odd small pieces of text; read out individually they arrive as a
 * stream of disconnected numbers in visual order, which is worse than useless.
 * One accurate sentence describes what is on screen.
 *
 * CONTENT POLICY
 * Every frame carries a visible "Demo data" chip, which brief section 2
 * requires on any mockup figure that is not real, approved data. None of these
 * figures are: they are neutral illustrative content, and the chip means the
 * composition can never be read as a real trading or filing position. The
 * accessible label says the same thing, so the disclosure is not visual-only.
 */
export function AppFrame({
  title,
  description,
  children,
  tone = 'default',
}: {
  /** Shown in the title bar. */
  title: string;
  /** The single accessible description of the whole view. */
  description: string;
  children: ReactNode;
  /** `flush` removes body padding for states that manage their own layout. */
  tone?: 'default' | 'flush';
}) {
  return (
    <div
      className={styles.frame}
      role="img"
      aria-label={`${description} Demo data — illustrative only, not customer data.`}
    >
      <div className={styles.bar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title}>{title}</span>
        <span className={styles.sample}>Demo data</span>
      </div>

      <div className={tone === 'flush' ? styles.bodyFlush : styles.body}>{children}</div>
    </div>
  );
}
