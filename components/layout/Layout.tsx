import type { CSSProperties, ElementType, ReactNode } from 'react';
import styles from './Layout.module.css';

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

export function Container({
  children,
  width = 'default',
  as = 'div',
  className = '',
}: {
  children: ReactNode;
  width?: 'default' | 'wide' | 'text';
  as?: PolymorphicTag;
  className?: string;
}) {
  const Component: RenderTag = as;
  const widthClass =
    width === 'wide' ? styles.containerWide : width === 'text' ? styles.containerText : '';
  return <Component className={`${styles.container} ${widthClass} ${className}`}>{children}</Component>;
}

/**
 * A page section that declares its own theme.
 *
 * `theme` flips the semantic token layer locally, which is how the site
 * alternates dark and light bands while the document keeps the user's global
 * preference for chrome (header, dialogs, toasts).
 *
 * `id` + `aria-labelledby` are expected on every content section so the
 * landmark is named for screen-reader users.
 */
export function Section({
  children,
  theme,
  id,
  labelledBy,
  size = 'default',
  tone = 'default',
  className = '',
  style,
}: {
  children: ReactNode;
  theme?: 'dark';
  id?: string;
  labelledBy?: string;
  size?: 'default' | 'large' | 'flush';
  tone?: 'default' | 'deep' | 'subtle';
  className?: string;
  style?: CSSProperties;
}) {
  const sizeClass =
    size === 'large' ? styles.sectionLarge : size === 'flush' ? styles.sectionFlush : '';
  const toneClass = tone === 'deep' ? styles.sectionDeep : tone === 'subtle' ? styles.sectionSubtle : '';

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-theme={theme}
      data-section-theme={theme}
      className={`${styles.section} ${sizeClass} ${toneClass} ${className}`}
      style={style}
    >
      {children}
    </section>
  );
}

export function Grid({
  children,
  className = '',
  style,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: PolymorphicTag;
}) {
  const Component: RenderTag = as;
  return (
    <Component className={`${styles.grid} ${className}`} style={style}>
      {children}
    </Component>
  );
}

export function Stack({
  children,
  gap = 'var(--space-6)',
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  gap?: string;
  className?: string;
  as?: PolymorphicTag;
}) {
  const Component: RenderTag = as;
  return (
    <Component className={`${styles.stack} ${className}`} style={{ gap }}>
      {children}
    </Component>
  );
}
