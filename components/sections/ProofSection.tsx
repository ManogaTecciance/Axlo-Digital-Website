import Link from 'next/link';
import { Container, Section } from '@/components/layout/Layout';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { caseStudies, workflowDomains } from '@/content/company';
import { products } from '@/content/products';
import { solutions } from '@/content/solutions';
import styles from './ProofSection.module.css';

/**
 * Homepage band 08 — proof (brief §6.8, §18).
 *
 * WHAT THIS SECTION IS ALLOWED TO SAY
 * The brief calls proof "one of the highest-priority additions" and, in the
 * same breath, forbids publishing invented customer numbers, testimonials,
 * logos or performance claims (§18, §24). Both instructions bind. So this band
 * shows two things and nothing else:
 *
 *   1. Case studies, when the client has supplied and approved them. Until
 *      then `caseStudies` is empty and this half renders nothing.
 *   2. What is verifiable from this website alone — the size of the portfolio
 *      and the workflows it covers. Every figure below is counted from the
 *      content files at build time, so it cannot drift from what the site
 *      actually shows, and every workflow named is checkable on a product page.
 *
 * There is deliberately no "trusted by", no logo wall and no metric that
 * depends on a customer. The place where the outstanding proof work is tracked
 * is /case-studies, which states plainly what still has to be supplied.
 */
export function ProofSection() {
  const hasCaseStudies = caseStudies.length > 0;

  /* Counted, not asserted. If a product is added to the content layer these
     move on their own; nobody has to remember to update a number in copy. */
  const facts = [
    { value: String(products.length), label: 'Axlo-owned products' },
    { value: String(solutions.length), label: 'Implementation and engineering services' },
    { value: String(workflowDomains.length), label: 'Business workflows covered' },
  ];

  return (
    <Section theme="dark" id="proof" size="large" labelledBy="proof-heading">
      <Container>
        <SectionHeader
          eyebrow="Proof"
          id="proof-heading"
          lead="What we can show today: the portfolio itself, and the operational workflows it covers. Client stories are published here only once the customer has approved them."
        >
          Built on experience. Focused on outcomes.
        </SectionHeader>

        <RevealGroup className={styles.facts} as="ul">
          {facts.map((fact) => (
            <RevealItem key={fact.label} as="li" className={styles.fact}>
              <span className={styles.factValue}>{fact.value}</span>
              <span className={styles.factLabel}>{fact.label}</span>
            </RevealItem>
          ))}
        </RevealGroup>

        <Reveal className={styles.workflows}>
          <h3 className={styles.workflowsTitle} id="proof-workflows">
            Products built around real business workflows
          </h3>
          <ul className={styles.domains} aria-labelledby="proof-workflows">
            {workflowDomains.map((domain) => (
              <li key={domain} className={styles.domain}>
                {domain}
              </li>
            ))}
          </ul>
        </Reveal>

        {hasCaseStudies ? (
          <RevealGroup className={styles.studies} as="ul">
            {caseStudies.slice(0, 3).map((study) => (
              <RevealItem key={study.id} as="li" className={styles.study}>
                <p className={styles.studyIndustry}>{study.industry}</p>
                <h3 className={styles.studyTitle}>
                  <Link className={styles.studyLink} href={`/case-studies/${study.slug}`}>
                    {study.client}
                  </Link>
                </h3>
                <p className={styles.studyProblem}>{study.problem}</p>
                <p className={styles.studyResult}>{study.result}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        ) : null}

        <Reveal>
          <Link className={styles.more} href="/case-studies">
            {hasCaseStudies ? 'Read the case studies' : 'How we document a project'}
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
