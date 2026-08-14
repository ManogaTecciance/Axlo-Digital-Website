import { Container, Section } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { serviceCategories } from '@/content/services';
import styles from './ServicesSection.module.css';

/**
 * Section 02 — Services.
 *
 * Three capability areas, presented as one clean composition rather than a
 * long accordion. A connecting flow line threads the three panels on desktop so
 * they read as one system; each panel lifts on hover as a light affordance, but
 * nothing is hidden behind interaction. No per-service pages, no deliverable
 * lists — the section states what Axlo Digital does and moves on.
 */
export function ServicesSection() {
  return (
    <Section theme="dark" id="services" size="large" labelledBy="services-heading">
      <Container>
        <SectionHeader eyebrow="What we do" id="services-heading">
          What we do to move businesses forward.
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
      </Container>
    </Section>
  );
}
