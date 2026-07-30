import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  withArrow?: boolean;
  children: ReactNode;
  /** Composed onto the variant classes — for layout only, never restyling. */
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> & {
    href?: never;
    loading?: boolean;
    /** Announced while `loading` is true. */
    loadingLabel?: string;
  };

type ButtonAsLink = CommonProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className' | 'children' | 'href'> & {
    href: string;
    loading?: never;
    loadingLabel?: never;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function classNames(variant: Variant, size: Size, fullWidth?: boolean, extra?: string) {
  return [
    styles.button,
    styles[variant],
    size !== 'md' ? styles[size] : '',
    fullWidth ? styles.full : '',
    extra ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

function Arrow() {
  return (
    <svg
      className={styles.arrow}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Primary interactive control.
 *
 * States: default, hover, focus-visible, pressed, disabled, loading.
 * Renders as `<a>` (via next/link) when `href` is supplied, otherwise `<button>`.
 * Accessibility: loading state keeps the button focusable, sets `aria-busy`,
 * and announces progress through a polite live region rather than swapping
 * the accessible name silently.
 */
export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    fullWidth,
    withArrow,
    children,
    className: extraClass,
  } = props;
  const className = classNames(variant, size, fullWidth, extraClass);

  if ('href' in props && props.href) {
    const {
      href,
      variant: _v,
      size: _s,
      fullWidth: _f,
      withArrow: _w,
      children: _c,
      className: _cn,
      ...rest
    } = props;
    const isExternal = href.startsWith('http') || href.startsWith('mailto:');

    if (isExternal) {
      return (
        <a className={className} href={href} {...rest}>
          {children}
          {withArrow ? <Arrow /> : null}
        </a>
      );
    }

    return (
      <Link className={className} href={href} {...rest}>
        {children}
        {withArrow ? <Arrow /> : null}
      </Link>
    );
  }

  const {
    variant: _v,
    size: _s,
    fullWidth: _f,
    withArrow: _w,
    children: _c,
    className: _cn,
    loading,
    loadingLabel = 'Working…',
    type = 'button',
    disabled,
    ...rest
  } = props as ButtonAsButton;

  return (
    <button
      className={className}
      type={type}
      aria-busy={loading || undefined}
      disabled={disabled}
      {...rest}
    >
      {loading ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          <span className={styles.loadingLabel}>{loadingLabel}</span>
        </>
      ) : (
        <>
          {children}
          {withArrow ? <Arrow /> : null}
        </>
      )}
    </button>
  );
}
