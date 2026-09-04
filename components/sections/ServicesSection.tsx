import Link from 'next/link';
import { Container, Section } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { serviceCategories } from '@/content/services';
import styles from './ServicesSection.module.css';

/**
 * Homepage band 03 — Capabilities (brief §6.3).
 *
 * Four capability areas, presented as one clean composition rather than a long
 * accordion. A connecting flow line threads the panels on desktop so they read
 * as one system; each panel lifts on hover as a light affordance, but nothing
 * is hidden behind interaction.
 *
 * Each panel shows three facets, not the full deliverable list — the complete
 * list lives on /what-we-do, and putting it here would turn the homepage into
 * a service catalogue.
 */
export function ServicesSection() {
  return (
    <Section theme="dark" id="capabilities" size="large" labelledBy="capabilities-heading">
      <Container>
        <SectionHeader
          eyebrow="What we do"
          id="capabilities-heading"
          lead="Strategy, experience, technology and operations — four connected disciplines rather than four separate engagements."
        >
          From business problem to digital product.
        </SectionHeader>

        <div className={styles.flow}>
          <span className={styles.flowLine} aria-hidden="true" data-decorative />

          <RevealGroup className={styles.grid} as="ul">
            {serviceCategories.map((service) => (
              <RevealItem key={service.id} as="li" className={styles.panel}>
                <span className={styles.node} aria-hidden="true" />

                <div className={styles.panelHead}>
                  <span className={styles.index}>{service.index}</span>
                  <h3 className={styles.title}>{service.title}</h3>
                </div>

                <p className={styles.promise}>{service.promise}</p>
                <p className={styles.description}>{service.description}</p>

                <ul className={styles.facets}>
                  {service.facets.map((facet) => (
                    <li key={facet} className={styles.facet}>
                      {facet}
                    </li>
                  ))}
                </ul>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        <Reveal>
          <Link className={styles.more} href="/what-we-do">
            See everything we do
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2.5 8h11M9 3.5 13.5 8 9 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </Reveal>
      </Container>
    </Section>
  );
}
