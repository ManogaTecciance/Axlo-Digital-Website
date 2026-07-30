import Link from 'next/link';
import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/foundations/Primitives';
import { Container, Section } from '@/components/layout/Layout';
import styles from './PageHero.module.css';

export type Crumb = { label: string; href: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      <ol style={{ display: 'contents' }}>
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <li key={crumb.href} style={{ display: 'contents' }}>
              {index > 0 ? (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              ) : null}
              {isLast ? (
                <span className={styles.crumbCurrent} aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <Link className={styles.crumbLink} href={crumb.href}>
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/**
 * Shared hero for every secondary page. Carries the single `h1`, optional
 * breadcrumb trail, and an aside slot for page-level metadata or a CTA.
 */
export function PageHero({
  eyebrow,
  title,
  lead,
  aside,
  meta,
  trail,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  aside?: ReactNode;
  meta?: ReactNode;
  trail?: Crumb[];
}) {
  return (
    <Section theme="dark" tone="deep" size="flush" className={styles.hero} labelledBy="page-title">
      <Container>
        {trail ? <Breadcrumbs trail={trail} /> : null}
        <div className={styles.inner}>
          <div>
            {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
            <h1 className={styles.title} id="page-title">
              {title}
            </h1>
            {meta ? <div className={styles.meta}>{meta}</div> : null}
          </div>
          <div>
            {lead ? <p className={styles.lead}>{lead}</p> : null}
            {aside}
          </div>
        </div>
      </Container>
    </Section>
  );
}
