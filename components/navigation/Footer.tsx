import Link from 'next/link';
import { Logo } from '@/components/foundations/Logo';
import { Container } from '@/components/layout/Layout';
import {
  companyNav,
  contactMailto,
  legalNav,
  productNav,
  site,
  solutionNav,
} from '@/lib/site';
import { FooterControls } from './FooterControls';
import { FooterEmail } from './FooterEmail';
import styles from './Footer.module.css';

/** One footer column, rendered from a label + href list. */
function FooterColumn({
  title,
  id,
  items,
}: {
  title: string;
  id: string;
  items: Array<{ label: string; href: string }>;
}) {
  return (
    <nav className={styles.column} aria-labelledby={id}>
      <h2 className={styles.columnTitle} id={id}>
        {title}
      </h2>
      <ul className={styles.linkList}>
        {items.map((item) => (
          <li key={item.href}>
            <Link className={styles.link} href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Site footer — brand and contact, then Products, Solutions and Company.
 *
 * Deliberately quieter than the Final CTA above it: same dark base, no accent
 * fills, and type that is readable without becoming a second closing
 * statement.
 *
 * The legal row now carries real pages. It previously rendered "Privacy —
 * Coming soon" placeholders, which the brief (§23, §26) requires gone before
 * launch.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer} data-theme="dark">
      {/* Watermark, not content: the wordmark is already read aloud by the
          logo below, so this is hidden from assistive technology. */}
      <span className={styles.wordmark} aria-hidden="true" data-decorative>
        AXLO
      </span>

      <Container>
        <div className={styles.top}>
          <div className={styles.brandBlock}>
            <Link className={styles.brandLink} href="/" aria-label="Axlo Digital — home">
              <Logo size="2.5rem" as="static" />
            </Link>
            <p className={styles.tagline}>{site.tagline}</p>
            <p className={styles.contactLine}>
              <FooterEmail href={contactMailto}>{site.email}</FooterEmail>
            </p>
          </div>

          <FooterColumn title="Products" id="footer-products-heading" items={productNav} />
          <FooterColumn title="Solutions" id="footer-solutions-heading" items={solutionNav} />
          <FooterColumn title="Company" id="footer-company-heading" items={companyNav} />
        </div>

        <div className={styles.bottom}>
          <div className={styles.legal}>
            <span className={styles.copyright}>
              © {year} {site.legalName}. All rights reserved.
            </span>
            {legalNav.map((item) => (
              <Link key={item.href} className={styles.legalLink} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <FooterControls />
        </div>
      </Container>
    </footer>
  );
}
