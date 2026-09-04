/**
 * Insights.
 *
 * Brief §19 asks for a CMS so articles can be categorised, tagged, searched
 * and shared. Choosing and provisioning a CMS is a client decision (hosting,
 * editorial access, cost), so this ships the *shape* instead: a typed article
 * model, the approved category list, and an empty collection.
 *
 * The index page reads `articles` and renders whatever is there — filtering,
 * tagging and search all work against this array. Wiring a headless CMS later
 * means replacing the body of `getArticles()` with a fetch that returns the
 * same `Article[]`; no page or component changes.
 */

export type InsightCategory =
  | 'AI & Automation'
  | 'Digital Transformation'
  | 'Finance Technology'
  | 'Business Operations'
  | 'ERP & Integration'
  | 'Product Management'
  | 'Sri Lankan Business Technology';

/** The approved categories, in the brief's order. */
export const insightCategories: InsightCategory[] = [
  'AI & Automation',
  'Digital Transformation',
  'Finance Technology',
  'Business Operations',
  'ERP & Integration',
  'Product Management',
  'Sri Lankan Business Technology',
];

export type Article = {
  id: string;
  slug: string;
  title: string;
  /** One-paragraph summary — used on the card and as the meta description. */
  summary: string;
  category: InsightCategory;
  tags: string[];
  /** ISO date. Drives ordering and the Article structured data. */
  publishedAt: string;
  author: string;
  /** Estimated reading time in minutes. */
  readingMinutes: number;
};

/**
 * EMPTY BY POLICY — no articles have been supplied or approved. The index page
 * renders the category framework and a visible pending note rather than
 * placeholder posts.
 */
export const articles: Article[] = [];

/** Newest first. The single read path, so a CMS can replace just this. */
export function getArticles(): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
