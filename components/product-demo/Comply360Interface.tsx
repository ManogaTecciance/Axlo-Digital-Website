import type { ProductStateId } from '@/content/products';
import { AppFrame } from './AppFrame';
import ui from './ProductUi.module.css';
import styles from './Comply360Interface.module.css';

/**
 * Comply360 — three composed interface states.
 *
 * Rebuilt on the shared primitive kit (ProductUi.module.css) so this product
 * and AxloPOS read as two applications from one design system. The single
 * dashboard that used to live here is now the first of three states, joined by
 * the filing workflow and the reporting overview.
 *
 * CONTENT POLICY
 * Every figure is neutral sample content inside a frame that says so. The
 * obligation names are Sri Lankan statutory tax types — a description of the
 * product's scope, not a claim about any customer's filing position.
 */

const READINESS = 86;
/** Circumference of the r=42 ring, used to drive the arc length. */
const RING = 2 * Math.PI * 42;

/* --------------------------------------------------------------------------
   01 — Compliance dashboard.
   -------------------------------------------------------------------------- */

const obligations = [
  { name: 'VAT return', period: 'Jun 2026', due: 'In 6 days', status: 'warn' as const, label: 'Due soon' },
  { name: 'PAYE / APIT remittance', period: 'Jun 2026', due: 'In 13 days', status: 'default' as const, label: 'In review' },
  { name: 'Corporate income tax — instalment', period: 'Q1 2026/27', due: 'In 28 days', status: 'quiet' as const, label: 'Scheduled' },
];

const documents = [
  { label: 'Supporting documents', value: 82 },
  { label: 'Reconciliations', value: 64 },
];

const activity = [38, 52, 44, 61, 55, 72, 66, 80];

function ComplyDashboard() {
  return (
    <AppFrame
      title="Comply360 — Compliance overview"
      description="Conceptual view of the Comply360 compliance dashboard: an overall readiness score, counts of tracked obligations and filings, upcoming statutory deadlines with their status, progress meters for supporting documents and reconciliations, and filing activity across the year."
    >
      <div className={ui.toolbar}>
        <span className={ui.context}>Financial year 2026 / 27</span>
        <span className={ui.tabs}>
          <span className={ui.tab} data-active="true">
            All entities
          </span>
          <span className={ui.tab}>Filed</span>
          <span className={ui.tab}>Open</span>
        </span>
      </div>

      <div className={ui.grid2}>
        <div className={`${ui.card} ${styles.readiness}`}>
          <svg className={styles.ring} viewBox="0 0 100 100" focusable="false">
            <defs>
              <linearGradient id="comply-ring" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--gradient-flow-stop-1)" />
                <stop offset="100%" stopColor="var(--gradient-flow-stop-3)" />
              </linearGradient>
            </defs>
            <circle className={styles.ringTrack} cx="50" cy="50" r="42" />
            <circle
              className={styles.ringValue}
              cx="50"
              cy="50"
              r="42"
              strokeDasharray={`${(RING * READINESS) / 100} ${RING}`}
            />
          </svg>
          <div className={styles.reading}>
            <span className={styles.readingValue}>{READINESS}%</span>
            <span className={styles.readingLabel}>Compliance readiness</span>
            <span className={styles.readingNote}>4 items need attention</span>
          </div>
        </div>

        <div className={styles.counters}>
          <div className={ui.stat}>
            <span className={ui.statValue}>24</span>
            <span className={ui.statLabel}>Obligations tracked</span>
          </div>
          <div className={ui.stat}>
            <span className={ui.statValue}>18</span>
            <span className={ui.statLabel}>Filed this year</span>
          </div>
          <div className={ui.stat}>
            <span className={ui.statValue}>4</span>
            <span className={ui.statLabel}>Due in 30 days</span>
          </div>
        </div>

        <div className={`${ui.card} ${ui.span2}`}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Upcoming deadlines</span>
            <span className={ui.cardMeta}>Next 30 days</span>
          </div>
          <ul className={ui.rows}>
            {obligations.map((item) => (
              <li key={item.name} className={`${ui.row} ${ui.rowWide}`}>
                <span className={ui.pip} data-tone={item.status === 'default' ? undefined : item.status} />
                <span className={ui.rowMain}>
                  <span className={ui.rowName}>{item.name}</span>
                  <span className={ui.rowSub}>{item.period}</span>
                </span>
                <span className={ui.rowAside}>{item.due}</span>
                <span className={ui.status} data-tone={item.status === 'default' ? undefined : item.status}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={ui.card}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Document progress</span>
          </div>
          {documents.map((doc) => (
            <div key={doc.label} className={ui.meterRow}>
              <span className={ui.meterLabel}>
                {doc.label}
                <span className={ui.meterValue}>{doc.value}%</span>
              </span>
              <span className={ui.meter}>
                <span className={ui.meterFill} style={{ width: `${doc.value}%` }} />
              </span>
            </div>
          ))}
        </div>

        <div className={ui.card}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Filing activity</span>
            <span className={ui.cardMeta}>Year to date</span>
          </div>
          <div className={ui.bars}>
            {activity.map((value, index) => (
              <span
                key={`${value}-${index}`}
                className={ui.bar}
                style={{ height: `${value}%` }}
                data-latest={index === activity.length - 1 ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

/* --------------------------------------------------------------------------
   02 — Filing workflow: one obligation moving through its stages.
   -------------------------------------------------------------------------- */

const workflow = [
  { stage: 'Prepared', owner: 'Finance', state: 'done' as const },
  { stage: 'Reviewed', owner: 'Tax lead', state: 'done' as const },
  { stage: 'Approved', owner: 'Director', state: 'active' as const },
  { stage: 'Submitted', owner: 'IRD portal', state: 'todo' as const },
];

const attachments = [
  { name: 'Output tax schedule.xlsx', meta: 'Attached · 240 KB' },
  { name: 'Input tax register.pdf', meta: 'Attached · 1.1 MB' },
  { name: 'Bank reconciliation.pdf', meta: 'Awaiting upload', pending: true },
];

function ComplyFiling() {
  return (
    <AppFrame
      title="Comply360 — VAT return, June 2026"
      description="Conceptual view of a Comply360 filing workflow: one VAT return moving through prepared, reviewed, approved and submitted stages with the owner of each step, its supporting documents and their upload state, and the return's declared totals."
    >
      <div className={ui.toolbar}>
        <span className={ui.context}>VAT return · June 2026</span>
        <span className={ui.status} data-tone="warn">
          Due in 6 days
        </span>
      </div>

      <ol className={styles.steps}>
        {workflow.map((step) => (
          <li key={step.stage} className={styles.step} data-state={step.state}>
            <span className={styles.stepMark} />
            <span className={styles.stepName}>{step.stage}</span>
            <span className={styles.stepOwner}>{step.owner}</span>
          </li>
        ))}
      </ol>

      <div className={ui.grid2}>
        <div className={ui.card}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Supporting documents</span>
            <span className={ui.cardMeta}>2 of 3</span>
          </div>
          <ul className={ui.rows}>
            {attachments.map((file) => (
              <li key={file.name} className={ui.row}>
                <span className={ui.pip} data-tone={file.pending ? 'quiet' : 'ok'} />
                <span className={ui.rowMain}>
                  <span className={ui.rowName}>{file.name}</span>
                  <span className={ui.rowSub}>{file.meta}</span>
                </span>
                <span className={ui.status} data-tone={file.pending ? 'quiet' : 'ok'}>
                  {file.pending ? 'Pending' : 'Ready'}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className={ui.card}>
          <div className={ui.cardHead}>
            <span className={ui.cardTitle}>Declared totals</span>
          </div>
          <dl className={styles.totals}>
            <div className={styles.totalRow}>
              <dt>Output tax</dt>
              <dd>Rs 2,418,600.00</dd>
            </div>
            <div className={styles.totalRow}>
              <dt>Input tax</dt>
              <dd>Rs 1,802,150.00</dd>
            </div>
            <div className={styles.totalRow} data-total="true">
              <dt>Payable</dt>
              <dd>Rs 616,450.00</dd>
            </div>
          </dl>
          <span className={ui.actionQuiet}>Send for approval</span>
        </div>
      </div>
    </AppFrame>
  );
}

/* --------------------------------------------------------------------------
   03 — Reporting overview.
   -------------------------------------------------------------------------- */

const history = [
  { name: 'VAT return', period: 'May 2026', state: 'Filed on time', tone: 'ok' as const },
  { name: 'PAYE / APIT remittance', period: 'May 2026', state: 'Filed on time', tone: 'ok' as const },
  { name: 'WHT certificate batch', period: 'Q4 2025/26', state: 'Filed late', tone: 'warn' as const },
  { name: 'Corporate income tax', period: 'Q4 2025/26', state: 'Filed on time', tone: 'ok' as const },
];

const completeness = [
  { label: 'Returns filed on time', value: 92 },
  { label: 'Documents complete', value: 78 },
  { label: 'Reconciliations signed off', value: 85 },
];

function ComplyReporting() {
  return (
    <AppFrame
      title="Comply360 — Reporting"
      description="Conceptual view of the Comply360 reporting overview: filing history across recent periods with on-time and late outcomes, completeness measures for filings, documents and reconciliations, and an export action for management and audit review."
    >
      <div className={ui.toolbar}>
        <span className={ui.context}>Compliance summary · 2025/26 – 2026/27</span>
        <span className={ui.tabs}>
          <span className={ui.tab} data-active="true">
            All obligations
          </span>
          <span className={ui.tab}>Late only</span>
        </span>
      </div>

      <div className={ui.card}>
        <div className={ui.cardHead}>
          <span className={ui.cardTitle}>Filing history</span>
          <span className={ui.cardMeta}>Last 4 periods</span>
        </div>
        <ul className={ui.rows}>
          {history.map((item) => (
            <li key={`${item.name}-${item.period}`} className={ui.row}>
              <span className={ui.pip} data-tone={item.tone} />
              <span className={ui.rowMain}>
                <span className={ui.rowName}>{item.name}</span>
                <span className={ui.rowSub}>{item.period}</span>
              </span>
              <span className={ui.status} data-tone={item.tone}>
                {item.state}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className={ui.card}>
        <div className={ui.cardHead}>
          <span className={ui.cardTitle}>Completeness</span>
          <span className={ui.cardMeta}>Year to date</span>
        </div>
        {completeness.map((metric) => (
          <div key={metric.label} className={ui.meterRow}>
            <span className={ui.meterLabel}>
              {metric.label}
              <span className={ui.meterValue}>{metric.value}%</span>
            </span>
            <span className={ui.meter}>
              <span className={ui.meterFill} style={{ width: `${metric.value}%` }} />
            </span>
          </div>
        ))}
        <span className={ui.actionQuiet}>Export summary</span>
      </div>
    </AppFrame>
  );
}

const states: Record<string, () => React.ReactElement> = {
  'comply-dashboard': ComplyDashboard,
  'comply-filing': ComplyFiling,
  'comply-reporting': ComplyReporting,
};

export function Comply360Interface({ state }: { state: ProductStateId }) {
  const State = states[state];
  return State ? <State /> : null;
}
