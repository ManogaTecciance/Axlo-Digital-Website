import type { ReactNode } from 'react';
import styles from './Charts.module.css';

/* --------------------------------------------------------------------------
   Axlo data-visualization components.

   Rules enforced here:
   • Every chart is wrapped in <ChartFrame>, which supplies a title, a written
     summary, and the underlying data as a real table. The graphic itself is
     `aria-hidden` — assistive technology reads the summary and table.
   • Series are never distinguished by colour alone: the legend pairs colour
     with a label, line series differ in dash pattern, and bar values are
     directly labelled.
   • No 3D, no gradient fills on data marks.
   • No company performance data is fabricated. Callers must pass real data or
     mark the frame `sample`, which renders a visible "illustrative sample"
     notice.
   -------------------------------------------------------------------------- */

export type Series = { label: string; tone?: 'primary' | 'secondary' | 'context' | 'highlight' };
export type Datum = { label: string; value: number; highlight?: boolean };

function toneClass(tone: Series['tone']) {
  switch (tone) {
    case 'secondary':
      return styles.series2;
    case 'context':
      return styles.series3;
    case 'highlight':
      return styles.highlight;
    default:
      return styles.series1;
  }
}

function toneVar(tone: Series['tone']) {
  switch (tone) {
    case 'secondary':
      return 'var(--viz-series-2)';
    case 'context':
      return 'var(--viz-series-3)';
    case 'highlight':
      return 'var(--viz-highlight)';
    default:
      return 'var(--viz-series-1)';
  }
}

export function ChartFrame({
  title,
  summary,
  legend,
  table,
  sample = false,
  children,
}: {
  title: string;
  /** Plain-language description of what the chart shows and what it means. */
  summary: string;
  legend?: Series[];
  table: { caption: string; headers: string[]; rows: Array<Array<string | number>> };
  sample?: boolean;
  children: ReactNode;
}) {
  return (
    <figure className={styles.frame}>
      <figcaption className={styles.frameHead}>
        <h3 className={styles.frameTitle}>{title}</h3>
        <p className={styles.frameSummary}>{summary}</p>
        {sample ? (
          <p className={styles.sampleNote}>Illustrative sample data — not customer figures</p>
        ) : null}
      </figcaption>

      {legend ? (
        <ul className={styles.legend}>
          {legend.map((series) => (
            <li key={series.label} className={styles.legendItem}>
              <span
                className={styles.swatch}
                style={{ backgroundColor: toneVar(series.tone) }}
                aria-hidden="true"
              />
              {series.label}
            </li>
          ))}
        </ul>
      ) : null}

      <div aria-hidden="true">{children}</div>

      <details>
        <summary className={styles.tableToggle}>View the data as a table</summary>
        <div className={styles.tableScroll}>
          <table className={styles.table}>
          <caption>{table.caption}</caption>
          <thead>
            <tr>
              {table.headers.map((header) => (
                <th key={header} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={String(row[0])}>
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th key={index} scope="row">
                      {cell}
                    </th>
                  ) : (
                    <td key={index}>{cell}</td>
                  ),
                )}
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

export function BarChart({ data, unit = '' }: { data: Datum[]; unit?: string }) {
  const width = 480;
  const height = 220;
  const padding = { top: 16, right: 8, bottom: 34, left: 8 };
  const max = Math.max(...data.map((d) => d.value), 1);
  const plotHeight = height - padding.top - padding.bottom;
  const slot = (width - padding.left - padding.right) / data.length;
  const barWidth = Math.min(slot * 0.58, 48);

  return (
    <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} focusable="false">
      <line
        className={styles.axis}
        x1={padding.left}
        y1={height - padding.bottom}
        x2={width - padding.right}
        y2={height - padding.bottom}
      />
      {data.map((datum, index) => {
        const barHeight = (datum.value / max) * plotHeight;
        const x = padding.left + slot * index + (slot - barWidth) / 2;
        const y = height - padding.bottom - barHeight;
        return (
          <g key={datum.label}>
            <rect
              className={datum.highlight ? styles.highlight : styles.series1}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx="3"
            />
            {/* Direct labelling — no reliance on reading values off an axis */}
            <text className={styles.valueLabel} x={x + barWidth / 2} y={y - 6} textAnchor="middle">
              {datum.value}
              {unit}
            </text>
            <text
              className={styles.axisLabel}
              x={x + barWidth / 2}
              y={height - padding.bottom + 18}
              textAnchor="middle"
            >
              {datum.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function LineChart({
  series,
  labels,
}: {
  series: Array<{ label: string; values: number[]; tone?: Series['tone'] }>;
  labels: string[];
}) {
  const width = 480;
  const height = 220;
  const padding = { top: 16, right: 12, bottom: 34, left: 12 };
  const max = Math.max(...series.flatMap((s) => s.values), 1);
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const step = plotWidth / Math.max(labels.length - 1, 1);

  return (
    <svg className={styles.chart} viewBox={`0 0 ${width} ${height}`} focusable="false">
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <line
          key={ratio}
          className={styles.axis}
          x1={padding.left}
          y1={padding.top + plotHeight * (1 - ratio)}
          x2={width - padding.right}
          y2={padding.top + plotHeight * (1 - ratio)}
        />
      ))}

      {series.map((line, seriesIndex) => {
        const points = line.values
          .map((value, index) => {
            const x = padding.left + step * index;
            const y = padding.top + plotHeight - (value / max) * plotHeight;
            return `${x},${y}`;
          })
          .join(' L ');
        return (
          <g key={line.label}>
            <path
              className={`${styles.lineSeries} ${
                seriesIndex === 0 ? styles.lineSeries1 : styles.lineSeries2
              }`}
              d={`M ${points}`}
            />
            {line.values.map((value, index) => (
              <circle
                key={index}
                className={toneClass(line.tone ?? (seriesIndex === 0 ? 'primary' : 'secondary'))}
                cx={padding.left + step * index}
                cy={padding.top + plotHeight - (value / max) * plotHeight}
                r="3"
              />
            ))}
          </g>
        );
      })}

      {labels.map((label, index) => (
        <text
          key={label}
          className={styles.axisLabel}
          x={padding.left + step * index}
          y={height - padding.bottom + 18}
          textAnchor="middle"
        >
          {label}
        </text>
      ))}
    </svg>
  );
}

export function DonutChart({ data }: { data: Datum[] }) {
  const size = 220;
  const radius = 84;
  const thickness = 26;
  const total = data.reduce((sum, datum) => sum + datum.value, 0) || 1;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  const tones: Array<Series['tone']> = ['primary', 'secondary', 'context', 'highlight'];

  return (
    <svg className={styles.chart} viewBox={`0 0 ${size} ${size}`} focusable="false">
      <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
        {data.map((datum, index) => {
          const fraction = datum.value / total;
          const dash = fraction * circumference;
          const element = (
            <circle
              key={datum.label}
              r={radius}
              fill="none"
              stroke={toneVar(tones[index % tones.length])}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
            />
          );
          offset += dash;
          return element;
        })}
      </g>
      <text
        className={styles.axisLabel}
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        {total}
      </text>
    </svg>
  );
}

export function KpiCard({
  label,
  value,
  note,
  delta,
}: {
  label: string;
  value: string;
  note?: string;
  /** Direction is stated in words as well as symbol — never colour alone. */
  delta?: { direction: 'up' | 'down' | 'flat'; text: string };
}) {
  const mark = delta?.direction === 'up' ? '▲' : delta?.direction === 'down' ? '▼' : '■';

  return (
    <div className={styles.kpi}>
      <span className={styles.kpiLabel}>{label}</span>
      <span className={styles.kpiValue}>{value}</span>
      {delta ? (
        <span className={styles.kpiDelta}>
          <span className={styles.kpiDeltaMark} aria-hidden="true">
            {mark}
          </span>
          {delta.text}
        </span>
      ) : null}
      {note ? <span className={styles.kpiNote}>{note}</span> : null}
    </div>
  );
}

export function KpiGrid({ children }: { children: ReactNode }) {
  return <div className={styles.kpiGrid}>{children}</div>;
}
