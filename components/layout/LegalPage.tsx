import { PlaceholderNote } from '@/components/foundations/Primitives';
import { Container, Section } from '@/components/layout/Layout';
import { PageHero } from '@/components/layout/PageHero';
import type { Crumb } from '@/components/layout/PageHero';
import styles from '@/app/legal.module.css';

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Rendered as a visible placeholder — used where legal review is pending. */
  pending?: string;
};

/**
 * Shared layout for policy pages: sticky table of contents beside readable
 * prose, with pending items declared rather than fabricated.
 */
export function LegalPage({
  eyebrow,
  title,
  lead,
  trail,
  sections,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  trail: Crumb[];
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} trail={trail} />

      <Section theme="dark" size="large" labelledBy="legal-heading">
        <Container>
          <h2 className="visually-hidden" id="legal-heading">
            {title}
          </h2>

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
                    <PlaceholderNote label="Pending">{section.pending}</PlaceholderNote>
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
