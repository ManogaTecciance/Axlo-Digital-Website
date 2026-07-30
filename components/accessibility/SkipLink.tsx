import styles from './SkipLink.module.css';

/** First focusable element on every page. Visible as soon as it receives focus. */
export function SkipLink() {
  return (
    <a className={styles.skipLink} href="#main-content">
      Skip to content
    </a>
  );
}
