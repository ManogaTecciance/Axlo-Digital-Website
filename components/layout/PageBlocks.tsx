import Link from 'next/link';
import type { ReactNode } from 'react';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import styles from './PageBlocks.module.css';

/* --------------------------------------------------------------------------
   Shared blocks for the secondary pages.

   Products, solutions and industries all present the same three shapes: a grid
   of cards that link onward, a list of capability pills, and a workflow spine.
   Building them once here is what keeps the route files thin enough to read in
   one screen, and is why a change to card behaviour lands on every index page
   rather than on whichever one someone remembered to update.
   -------------------------------------------------------------------------- */

/** A list of short labels — modules, capabilities, tags. */
export function PillList({
  items,
  label,
  accent = false,
}: {
  items: readonly string[];
  /** Names the list for assistive technology. */
  label: string;
  accent?: boolean;
}) {
  return (
    <ul className={`${styles.pills} ${accent ? styles.pillsAccent : ''}`} aria-label={label}>
      {items.map((item) => (
        <li key={item} className={styles.pill}>
          {item}
        </li>
      ))}
    </ul>
  );
}

/** A numbered workflow spine: Track → Prepare → Review → … */
export function WorkflowSpine({ steps, label }: { steps: readonly string[]; label: string }) {
  return (
    <ol className={styles.spine} aria-label={label}>
      {steps.map((step, index) => (
        <li key={step} className={styles.spineStep}>
          <span className={styles.spineIndex} aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}

export type LinkCardItem = {
  /** Stable key and, where present, the eyebrow index. */
  id: string;
  index?: string;
  title: string;
  href: string;
  /** The one-line positioning. */
  summary: string;
  /** Optional supporting paragraph. */
  detail?: string;
  /** Small labels along the bottom of the card. */
  tags?: readonly string[];
  /** Rendered above the title — used for the "Partner platform" marker. */
  marker?: string;
};

/**
 * A grid of cards that each link onward.
 *
 * The heading carries the link and stretches over the card, so the whole card
 * is clickable while the accessible name stays the title rather than the
 * card's entire text content.
 */
export function LinkCardGrid({
  items,
  columns = 3,
  label,
}: {
  items: readonly LinkCardItem[];
  columns?: 2 | 3 | 4;
  label?: string;
}) {
  return (
    <RevealGroup
      className={`${styles.cards} ${styles[`cards${columns}`]}`}
      as="ul"
      aria-label={label}
    >
      {items.map((item) => (
        <RevealItem key={item.id} as="li" className={styles.card}>
          {item.marker ? (
            <p className={styles.marker}>
              <span className={styles.markerDot} aria-hidden="true" />
              {item.marker}
            </p>
          ) : item.index ? (
            <p className={styles.cardIndex} aria-hidden="true">
              {item.index}
            </p>
          ) : null}

          <h3 className={styles.cardTitle}>
            <Link className={styles.cardLink} href={item.href}>
              {item.title}
            </Link>
          </h3>

          <p className={styles.cardSummary}>{item.summary}</p>
          {item.detail ? <p className={styles.cardDetail}>{item.detail}</p> : null}

          {item.tags?.length ? (
            <ul className={styles.cardTags} aria-hidden="true">
              {item.tags.map((tag) => (
                <li key={tag} className={styles.cardTag}>
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

/**
 * A block that states what is not here yet, and what has to be supplied.
 *
 * Used wherever the brief asks for content only the client can approve —
 * leadership bios, case studies, articles. The alternative is either an empty
 * page with no explanation or invented filler, and the brief rules the second
 * one out explicitly (§18, §24).
 *
 * `role="note"` and the visible label mean this reads as a declared gap to
 * everybody, including screen-reader users, rather than looking like content.
 */
export function PendingPanel({
  title,
  children,
  requirements,
  label = 'Awaiting approved content',
}: {
  title: string;
  children: ReactNode;
  /** What the client has to supply. */
  requirements?: readonly string[];
  label?: string;
}) {
  return (
    <div className={styles.pending} role="note" data-content-status="placeholder">
      <p className={styles.pendingLabel}>{label}</p>
      <h3 className={styles.pendingTitle}>{title}</h3>
      <div className={styles.pendingBody}>{children}</div>
      {requirements?.length ? (
        <ul className={styles.pendingList}>
          {requirements.map((requirement) => (
            <li key={requirement} className={styles.pendingItem}>
              {requirement}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** A definition-style row: term on the left, description on the right. */
export function DetailList({
  items,
  label,
}: {
  items: ReadonlyArray<{ term: string; description: string }>;
  label: string;
}) {
  return (
    <dl className={styles.details} aria-label={label}>
      {items.map((item) => (
        <div key={item.term} className={styles.detailRow}>
          <dt className={styles.detailTerm}>{item.term}</dt>
          <dd className={styles.detailDescription}>{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
