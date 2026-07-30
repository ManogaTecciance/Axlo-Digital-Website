import type { ElementType, ReactNode } from 'react';
import styles from './Primitives.module.css';

/** Polymorphic `as` prop.
 *
 *  TypeScript intersects the props of every possible element when `as` is a
 *  bare `ElementType`, which collapses `children` to `never`. Widening the
 *  rendered tag at the point of use is the standard escape hatch and keeps the
 *  public prop type honest for callers.
 */
type PolymorphicTag = ElementType;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RenderTag = any;

/* ---- Eyebrow ------------------------------------------------------------ */

export function Eyebrow({ children, withMark = true }: { children: ReactNode; withMark?: boolean }) {
  return (
    <p className={styles.eyebrow}>
      {withMark ? <span className={styles.eyebrowMark} aria-hidden="true" /> : null}
      {children}
    </p>
  );
}

/* ---- Tag ---------------------------------------------------------------- */

export function Tag({
  children,
  accent = false,
  as = 'span',
}: {
  children: ReactNode;
  accent?: boolean;
  as?: PolymorphicTag;
}) {
  const Component: RenderTag = as;
  return (
    <Component className={`${styles.tag} ${accent ? styles.tagAccent : ''}`}>{children}</Component>
  );
}

/* ---- Section heading ---------------------------------------------------- */

export function SectionHeading({
  eyebrow,
  title,
  lead,
  as: Heading = 'h2',
  id,
  wide = false,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  wide?: boolean;
}) {
  return (
    <div className={`${styles.sectionHeading} ${wide ? styles.sectionHeadingWide : ''}`}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading className={styles.sectionTitle} id={id}>
        {title}
      </Heading>
      {lead ? <p className={styles.sectionLead}>{lead}</p> : null}
    </div>
  );
}

/* ---- Placeholder note ---------------------------------------------------- */

/**
 * Marks content that has not yet been supplied or verified.
 * Visible by design and announced to assistive technology — never a silent gap.
 */
export function PlaceholderNote({
  children,
  label = 'Placeholder',
  inline = false,
}: {
  children: ReactNode;
  label?: string;
  inline?: boolean;
}) {
  return (
    <p
      className={`${styles.placeholder} ${inline ? styles.placeholderInline : ''}`}
      role="note"
      data-content-status="placeholder"
    >
      <span className={styles.placeholderLabel}>{label}</span>
      <span>{children}</span>
    </p>
  );
}

/* ---- Divider ------------------------------------------------------------ */

export function Divider({ flow = false }: { flow?: boolean }) {
  return <hr className={`${styles.divider} ${flow ? styles.dividerFlow : ''}`} />;
}

/* ---- Skeleton ----------------------------------------------------------- */

export function Skeleton({
  width = '100%',
  height = '1rem',
  radius,
  label = 'Loading',
}: {
  width?: string;
  height?: string;
  radius?: string;
  label?: string;
}) {
  return (
    <span
      className={styles.skeleton}
      style={{ width, height, display: 'block', borderRadius: radius }}
      role="status"
      aria-label={label}
    />
  );
}

/* ---- Status ------------------------------------------------------------- */

/** Status is always colour + text. Never colour alone. */
export function Status({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'live' | 'pending';
  children: ReactNode;
}) {
  const toneClass = tone === 'live' ? styles.statusLive : tone === 'pending' ? styles.statusPending : '';
  return (
    <span className={`${styles.status} ${toneClass}`}>
      <span className={`${styles.statusDot} axlo-ambient`} aria-hidden="true" />
      {children}
    </span>
  );
}

/* ---- Visually hidden ----------------------------------------------------- */

export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="visually-hidden">{children}</span>;
}
