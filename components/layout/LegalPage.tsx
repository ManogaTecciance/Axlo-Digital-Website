import { PlaceholderNote } from '@/components/foundations/Primitives';
import { Container, Section } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import type { Crumb } from '@/components/layout/PageHero';
import styles from '@/app/legal.module.css';

/**
 * Shared layout for the policy pages.
 *
 * A LAUNCH DEPENDENCY, STATED IN THE OPEN
 * None of these pages carries final legal copy, and none of it is generated.
 * §17 is explicit: fabricated legal language is not acceptable, and
 * automatically generated text is not professionally approved text. So each
 * page states which sections are drafted, which are pending, and that the
 * document is not in force — visibly, at the top, and announced to assistive
 * technology through `role="note"`.
 *
 * This is the correct behaviour for an unlaunched site. It is also the
 * behaviour that has to change before launch: production release stays blocked
 * until reviewed copy is supplied. See `docs/LAUNCH-BLOCKERS.md`.
 */

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Rendered as a visible placeholder — used where legal review is pending. */
  pending?: string;
};

export function LegalPage({
  eyebrow,
  title,
  lead,
  trail,
  sections,
  status,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  trail?: Crumb[];
  sections: LegalSection[];
  /** The document-level status notice. Always shown. */
  status: string;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} trail={trail} />

      <Section theme="dark" size="large" labelledBy="legal-heading">
        <Container>
          <h2 className="visually-hidden" id="legal-heading">
            {title}
          </h2>

          {/* Document status leads the page. A visitor should not have to read
              to the bottom to discover the policy is not final. */}
          <div className={styles.prose} style={{ marginBottom: 'var(--space-10)' }}>
            <PlaceholderNote label="Not yet in force">{status}</PlaceholderNote>
          </div>

          <div className={styles.layout}>
            <nav className={styles.toc} aria-label="On this page">
              <span className={styles.tocTitle}>On this page</span>
              {sections.map((section) => (
                <a key={section.id} className={styles.tocLink} href={`#${section.id}`}>
                  {section.title}
                </a>
              ))}
            </nav>

            <div className={styles.prose}>
              {sections.map((section) => (
                <div key={section.id} className={styles.section} id={section.id}>
                  <h3 className={styles.sectionTitle}>{section.title}</h3>

                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)} className={styles.text}>
                      {paragraph}
                    </p>
                  ))}

                  {section.bullets ? (
                    <ul className={styles.list}>
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className={styles.listItem}>
                          <span className={styles.marker} aria-hidden="true" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.pending ? (
                    <PlaceholderNote label="Pending legal review">{section.pending}</PlaceholderNote>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
