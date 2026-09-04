import Link from 'next/link';
import { Container, Section } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { engineeringSolutions, partnerSolutions } from '@/content/solutions';
import styles from './ErpFinanceSection.module.css';

/**
 * Homepage band 05 — ERP & finance technology (brief §6.5).
 *
 * THE POINT OF THIS SECTION IS THE DISTINCTION IT DRAWS.
 *
 * Brief §13 and §26 both require that Odoo and QuickBooks are never presented
 * as Axlo-owned products. That rule is enforced structurally here, not by
 * careful wording:
 *
 *   • This band sits *after* the products band and reads as a services layer.
 *   • Partner platforms are visually distinct from the product cards above —
 *     outlined rather than filled, with no product-style mockup.
 *   • Every partner card carries an explicit "Partner platform · <vendor>"
 *     label, generated from `solution.vendor` in the content layer. A card
 *     cannot appear here without declaring which side of the line it is on.
 *
 * The engineering disciplines (AI, integration, custom software) follow in a
 * quieter row, because they are Axlo's own work and belong to the same
 * services layer without needing the vendor caveat.
 */
export function ErpFinanceSection() {
  return (
    <Section theme="dark" id="erp-finance" size="large" labelledBy="erp-finance-heading">
      <Container>
        <SectionHeader
          eyebrow="ERP & finance technology"
          id="erp-finance-heading"
          lead="Alongside our own products, Axlo implements, integrates and supports the business platforms companies already run on. These are partner platforms — we deliver the implementation, not the software."
        >
          Leading business platforms, implemented around your business.
        </SectionHeader>

        <RevealGroup className={styles.partners} as="ul">
          {partnerSolutions.map((solution) => (
            <RevealItem key={solution.id} as="li" className={styles.partner}>
              <p className={styles.vendorLabel}>
                <span className={styles.vendorDot} aria-hidden="true" />
                Partner platform · {solution.vendor}
              </p>

              <h3 className={styles.partnerName}>
                <Link className={styles.partnerLink} href={`/solutions/${solution.slug}`}>
                  {solution.name}
                </Link>
              </h3>

              <p className={styles.partnerPositioning}>{solution.positioning}</p>
              <p className={styles.partnerDescription}>{solution.description}</p>

              <ul className={styles.capabilities}>
                {solution.capabilities.slice(0, 6).map((capability) => (
                  <li key={capability} className={styles.capability}>
                    {capability}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>

        <RevealGroup className={styles.engineering} as="ul">
          {engineeringSolutions.map((solution) => (
            <RevealItem key={solution.id} as="li" className={styles.discipline}>
              <Link className={styles.disciplineLink} href={`/solutions/${solution.slug}`}>
                <span className={styles.disciplineName}>{solution.name}</span>
                <span className={styles.disciplinePositioning}>{solution.positioning}</span>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
