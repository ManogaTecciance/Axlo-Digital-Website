import { Container, Section } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { whyAxloPillars } from '@/content/company';
import styles from './WhyAxloSection.module.css';

/**
 * Homepage band 06 — Why Axlo (brief §6.6, §16).
 *
 * Six positions, stated plainly. The brief asks for "concise proof-led cards";
 * the honest version of that, before any customer evidence has been approved,
 * is a card that states how Axlo works rather than one that implies a result
 * it cannot show. Verified proof belongs in the Proof band below, and appears
 * there only once the client supplies it.
 */
export function WhyAxloSection() {
  return (
    <Section theme="dark" tone="subtle" id="why-axlo" size="large" labelledBy="why-axlo-heading">
      <Container>
        <SectionHeader
          eyebrow="Why Axlo"
          id="why-axlo-heading"
          lead="Six things that shape every engagement, from the first conversation to the work that continues after launch."
        >
          We don’t just build software. We understand the business behind the software.
        </SectionHeader>

        <RevealGroup className={styles.grid} as="ul">
          {whyAxloPillars.map((pillar) => (
            <RevealItem key={pillar.id} as="li" className={styles.card}>
              <span className={styles.index} aria-hidden="true">
                {pillar.index}
              </span>
              <h3 className={styles.name}>{pillar.name}</h3>
              <p className={styles.summary}>{pillar.summary}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
