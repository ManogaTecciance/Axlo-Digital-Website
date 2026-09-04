# Repository cleanup register

Code that is unreferenced but **deliberately retained**, pending a separate cleanup review.

Nothing in this file is broken or blocking. It is recorded so that "unused" is a tracked decision
rather than something rediscovered by the next person to run a dead-code scan.

> **Phase 2 decision (2026-08-28).** `Diagrams.tsx`, `Charts.tsx`, `StageRail.tsx` and
> `lib/motion.ts` are **retained unchanged** — not deleted, refactored, relocated, or included in
> the Phase 2 diff. Their review is a **separate repository-cleanup task**, to be scheduled after
> the approved landing page has completed accessibility, responsive, test and production-build
> verification. **None of them is a landing-page launch blocker**; all four are tree-shaken out of
> every shipped bundle. The only launch blocker is L1 (legal copy) in
> [`LAUNCH-BLOCKERS.md`](LAUNCH-BLOCKERS.md).
>
> One item below did change in Phase 2, and not as cleanup:
> `components/product-demo/AxloPosInterface.tsx` and its stylesheet were **deleted** when the two
> real AxloPOS screenshots replaced the composed interface. That is a content-integrity decision
> under blocker S1, not dead-code removal — the component was live and rendering until it was
> superseded.

---

## Retained — awaiting cleanup review

### `components/data-visualization/Diagrams.tsx` + `Diagrams.module.css`

| | |
| --- | --- |
| **Status** | Unreferenced. No import anywhere in `app/`, `components/`, `lib/`, `content/`, `stories/` or `tests/`. |
| **Origin** | **Pre-existing.** Unreferenced before the `feature/axlo-website-restructure` branch was created — the last commit touching it is the base commit `2b8df1c`. It was not orphaned by the restructure. |
| **Decision** | **Retain unchanged.** Not to be deleted as part of the website restructure. |
| **Why** | It is not a restructure concern. Removing pre-existing dead code inside a content-and-routing change mixes two unrelated decisions in one diff, and makes the restructure harder to review. |
| **Contents** | Per-service and per-value system diagrams, authored as SVG. Sibling of `Charts.tsx`, which is also unreferenced by the application but *is* exercised by `stories/Charts.stories.tsx`. |
| **Cost of keeping** | None at runtime. Next.js tree-shakes unreferenced modules, so it is absent from every bundle. It costs one file in the repository and one entry in a dead-code scan. |
| **Next step** | Assess in a dedicated cleanup review, alongside `Charts.tsx` and the two orphaned assets below. Options: delete; keep and add a Storybook story as `Charts` has; or adopt it in the Insights article template, where system diagrams would earn their place. |

---

## Retained — assets

Both predate this branch. Neither is deleted, per the instruction not to remove existing assets.

| Asset | Status | Note |
| --- | --- | --- |
| `public/hero/hero-operations.jpg` | Unreferenced (1920 × 1080, 45 KB) | Referenced only by `public/hero/README.md`, which describes an earlier two-tile hero composition. The current hero uses `axlo-hero-image.jpg` and `hero-insight.jpg`. |
| `public/og/axlo-default.svg` | Unreferenced (2.8 KB) | Correctly superseded by `app/opengraph-image.tsx`, which generates a raster card. SVG social cards do not render on Facebook, LinkedIn, X or Slack, so this must not be reinstated as the OG image. |

---

## Restored during the scope correction

An earlier pass explored a multi-page architecture and removed several single-page modules as
superseded. That architecture is out of scope, so **every one of them has been restored from the
base commit** and the site is once again a single landing page:

`lib/scroll.ts` · `lib/motion.ts` · `SectionLink.tsx` · `SectionCta.tsx` · `ProductLink.tsx` ·
`ServicesSection.tsx` + CSS · `TrustSection.tsx` + CSS · `StageRail.tsx`

`lib/motion.ts` and `components/motion/StageRail.tsx` are unreferenced — they were unreferenced at
the base commit too. They are retained rather than re-removed, for the same reason as
`Diagrams.tsx`: pre-existing dead code is a cleanup-review decision, not a design-change decision.

---

## Housekeeping — completed

| Item | Resolution |
| --- | --- |
| **Lockfiles** | The project uses **npm**. Evidence: `package-lock.json` is newer (30 Jul vs 22 Jul) and larger (214 KB vs 66 KB); every command in `README.md` is `npm`; there is no CI or deployment config and no `packageManager` field, so nothing else pointed at pnpm. `pnpm-lock.yaml` and `pnpm-workspace.yaml` have been untracked and deleted. **This should be committed on its own**, separately from the design changes. |
| **Stray parent lockfile** | Next was resolving the workspace root to `/Users/<user>` because of a stray `package-lock.json` in the home directory, and warned on every build. That file is outside this repository and has **not** been touched; `outputFileTracingRoot` is now pinned to the project directory in `next.config.mjs`, which is the correct fix. Build warnings: 0. |
| **Test artifacts** | `test-results/.last-run.json` untracked via `git rm --cached`. `test-results/` and `playwright-report/` are in `.gitignore`. No test configuration or snapshot was removed — `playwright.config.ts` and every spec are untouched by this cleanup. |
