import type { Metadata } from 'next';
import { Container, Section } from '@/components/layout/Layout';
import { LinkCardGrid, PendingPanel, type LinkCardItem } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { getArticles, insightCategories } from '@/content/insights';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { primaryCta } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'Insights', href: '/insights' },
];

export const metadata: Metadata = pageMetadata({
  title: 'Insights',
  description:
    'Writing from Axlo Digital on AI and automation, digital transformation, finance technology, business operations, ERP and integration, and product management.',
  path: '/insights',
});

/**
 * Insights index (brief §19).
 *
 * The brief asks for a CMS so articles can be categorised, tagged, searched and
 * shared. Provisioning one is a client decision — hosting, editorial seats,
 * cost — so what ships is the reading surface and the content model it reads
 * from (see content/insights). Connecting a headless CMS later means replacing
 * the body of `getArticles()`; this page does not change.
 *
 * With no articles supplied, the page publishes the category framework and says
 * so, rather than shipping filler posts under the Axlo byline.
 */
export default function InsightsPage() {
  const articles = getArticles();

  const cards: LinkCardItem[] = articles.map((article) => ({
    id: article.id,
    title: article.title,
    href: `/insights/${article.slug}`,
    summary: article.category,
    detail: article.summary,
    tags: article.tags,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow="Insights"
        title={'Notes on making\noperations work.'}
        lead="Writing on the problems we keep meeting: fragmented systems, manual reconciliation, AI applied where it actually pays, and what connecting a business really involves."
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink href={primaryCta.href} withArrow placement="insights-hero">
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      <Section theme="dark" size="large" labelledBy="insights-heading">
        <Container>
          <h2 className="visually-hidden" id="insights-heading">
            Articles
          </h2>

          {articles.length > 0 ? (
            <LinkCardGrid items={cards} columns={3} label="Articles" />
          ) : (
            <>
              <Reveal>
                <h3 className={styles.categoriesTitle}>The topics we will publish on</h3>
                <ul className={styles.categories} aria-label="Insight categories">
                  {insightCategories.map((category) => (
                    <li key={category} className={styles.category}>
                      {category}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal className={styles.pending}>
                <PendingPanel
                  title="No articles published yet"
                  label="Awaiting content"
                  requirements={[
                    'A content management system chosen and provisioned (hosting, editorial access, cost)',
                    'First articles drafted and approved for publication',
                    'An author byline and, where used, author photograph',
                  ]}
                >
                  <p>
                    The reading surface, category model, tagging and article metadata are built and
                    working — they are driven by <code className={styles.code}>content/insights</code>,
                    and every article rendered here will carry Article structured data, a canonical
                    URL and social metadata automatically.
                  </p>
                  <p>
                    What is missing is the writing and the platform to manage it. To go live:
                  </p>
                </PendingPanel>
              </Reveal>
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
