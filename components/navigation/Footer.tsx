import { Logo } from '@/components/foundations/Logo';
import { Container } from '@/components/layout/Layout';
import { contactMailto, legalNav, primaryNav, productNav, site } from '@/lib/site';
import { FooterControls } from './FooterControls';
import { FooterEmail } from './FooterEmail';
import { ProductLink } from './ProductLink';
import { SectionLink } from './SectionLink';
import styles from './Footer.module.css';

/**
 * Site footer — three columns over one bottom row.
 *
 * Brand and contact, then the page's sections, then the products. Deliberately
 * quieter than the Final CTA above it: same dark base, no accent fills, and
 * type that is readable without becoming a second closing statement.
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
            <SectionLink sectionId="home" className={styles.brandLink} aria-label="Axlo Digital — back to top">
              <Logo size="2.5rem" as="static" />
            </SectionLink>
            <p className={styles.tagline}>{site.tagline}</p>
            <p className={styles.contactLine}>
              <FooterEmail href={contactMailto}>{site.email}</FooterEmail>
            </p>
          </div>

          <nav className={styles.column} aria-labelledby="footer-nav-heading">
            <h2 className={styles.columnTitle} id="footer-nav-heading">
              Navigation
            </h2>
            <ul className={styles.linkList}>
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <SectionLink sectionId={item.sectionId} className={styles.link}>
                    {item.label}
                  </SectionLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.column} aria-labelledby="footer-products-heading">
            <h2 className={styles.columnTitle} id="footer-products-heading">
              Products
            </h2>
            <ul className={styles.linkList}>
              {productNav.map((item) => (
                <li key={item.label}>
                  <ProductLink item={item} className={styles.link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <div className={styles.legal}>
            <span className={styles.copyright}>
              © {year} {site.legalName}. All rights reserved.
            </span>
            {/* Empty while the policies are internal drafts — see `legalNav`
                in lib/site.ts. Renders nothing rather than a "coming soon"
                chip. */}
            {legalNav.map((item) => (
              <a key={item.href} className={styles.link} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <FooterControls />
        </div>
      </Container>
    </footer>
  );
}
