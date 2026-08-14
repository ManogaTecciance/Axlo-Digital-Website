import { Container, Section } from '@/components/layout/Layout';
import { Reveal } from '@/components/motion/Reveal';
import { workflowDomains } from '@/content/company';
import styles from './TrustSection.module.css';

/**
 * The trust layer — Option B from the brief.
 *
 * WHY THIS FORM
 * The brief offers three formats and forbids fabricating client counts,
 * revenue impact, conversion lifts, success percentages, user numbers or years
 * of experience. It also allows client logos "if approved assets exist" — none
 * do; `public/brand` holds only Axlo's own marks. Listing industries Axlo has
 * not shipped into would be a client claim by implication, which is the same
 * problem in a different shape.
 *
 * So this states the one thing that is verifiable from the page itself: the
 * business workflows the two products on this page actually handle. Every entry
 * below maps to a capability visible in Comply360 or AxloPOS. Nothing is
 * asserted that a visitor cannot check by scrolling up.
 *
 * It is deliberately a strip, not a section with its own heading rank — it sits
 * between Products and How We Work as evidence, and must not compete with
 * either. It is inside the products landmark rather than adding a sixth section
 * to the page.
 */
export function TrustSection() {
  return (
    <Section theme="dark" tone="subtle" size="flush" className={styles.section}>
      <Container>
        <Reveal className={styles.inner}>
          <p className={styles.statement}>Products built around real business workflows</p>

          <ul className={styles.domains}>
            {workflowDomains.map((domain) => (
              <li key={domain} className={styles.domain}>
                {domain}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
