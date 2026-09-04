import { Container, Section } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Reveal } from '@/components/motion/Reveal';
import { connectedSignals, disconnectedSignals } from '@/content/company';
import styles from './ProblemSection.module.css';

/**
 * Homepage band 02 — the problem (brief §6.2).
 *
 * "Your business is connected. Your systems should be too." The brief asks for
 * a simple before/after visual, so this is exactly that: two columns, the same
 * number of rows, read left to right.
 *
 * The comparison is built as a two-column layout of paired lists rather than a
 * table, because it is not tabular data — there is no relationship between row
 * three on the left and row three on the right beyond sequence. Each side is
 * its own list with its own heading, so a screen reader announces "Today,
 * list of 5 items" rather than a grid of meaningless cells.
 *
 * The chain line above the columns states the dependency the section argues
 * from — sales → inventory → finance → compliance → decisions — and is the one
 * decorative element here.
 */
export function ProblemSection() {
  return (
    <Section theme="dark" tone="subtle" id="problem" size="large" labelledBy="problem-heading">
      <Container>
        <SectionHeader
          eyebrow="The problem"
          id="problem-heading"
          lead="Sales affects inventory. Inventory affects finance. Finance affects compliance. Data affects decisions. When the systems behind them are separate, the business absorbs the difference by hand."
        >
          Your business is connected. Your systems should be too.
        </SectionHeader>

        <Reveal>
          <ol className={styles.chain} aria-label="How one part of the business affects the next">
            {['Sales', 'Inventory', 'Finance', 'Compliance', 'Decisions'].map((link) => (
              <li key={link} className={styles.chainItem}>
                {link}
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className={styles.compare}>
          <div className={`${styles.side} ${styles.before}`}>
            <h3 className={styles.sideTitle} id="problem-today">
              <span className={styles.sideLabel}>Today</span>
              Work that moves between systems by hand
            </h3>
            <ul className={styles.list} aria-labelledby="problem-today">
              {disconnectedSignals.map((signal) => (
                <li key={signal} className={styles.item}>
                  <span className={styles.markerBefore} aria-hidden="true" />
                  {signal}
                </li>
              ))}
            </ul>
          </div>

          {/* The join between the two states. Decorative: the columns read in
              order without it. */}
          <span className={styles.bridge} aria-hidden="true" data-decorative>
            <span className={styles.bridgePacket} />
          </span>

          <div className={`${styles.side} ${styles.after}`}>
            <h3 className={styles.sideTitle} id="problem-connected">
              <span className={`${styles.sideLabel} ${styles.sideLabelAccent}`}>Connected</span>
              One flow the business can see end to end
            </h3>
            <ul className={styles.list} aria-labelledby="problem-connected">
              {connectedSignals.map((signal) => (
                <li key={signal} className={styles.item}>
                  <span className={styles.markerAfter} aria-hidden="true" />
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
