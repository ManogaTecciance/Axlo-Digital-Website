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
 * Every frame carries a visible "Sample view" chip. The figures inside are
 * neutral sample content, and the chip means the composition can never be read
 * as a real trading or filing position.
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
    <div className={styles.frame} role="img" aria-label={`${description} Sample content, not customer data.`}>
      <div className={styles.bar}>
        <span className={styles.dots}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.title}>{title}</span>
        <span className={styles.sample}>Sample view</span>
      </div>

      <div className={tone === 'flush' ? styles.bodyFlush : styles.body}>{children}</div>
    </div>
  );
}
