import type { Meta, StoryObj } from '@storybook/react';
import {
  BarChart,
  ChartFrame,
  DonutChart,
  KpiCard,
  KpiGrid,
  LineChart,
} from '@/components/data-visualization/Charts';

const meta: Meta = {
  title: 'Data visualization/Charts',
  parameters: {
    docs: {
      description: {
        component: [
          'The Axlo visualization system. Rules enforced by `ChartFrame`:',
          '',
          '- Every chart carries a written summary and the underlying data as a real `<table>`. The SVG itself is `aria-hidden`.',
          '- Series are never distinguished by colour alone — the legend pairs colour with a label, line series differ in dash pattern, and bars are directly labelled.',
          '- Flow Aqua is the primary series, Kinetic Teal the secondary, neutral greys carry context, and Volt Lime marks a single key highlight.',
          '- No 3D, no gradient fills on data marks.',
          '- Charts with illustrative numbers must pass `sample`, which renders a visible "not customer figures" notice.',
        ].join('\n'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const categoryData = [
  { label: 'Tiles', value: 34 },
  { label: 'Adhesive', value: 22 },
  { label: 'Tools', value: 18, highlight: true },
  { label: 'Grout', value: 14 },
  { label: 'Trim', value: 12 },
];

export const Bar: Story = {
  render: () => (
    <ChartFrame
      title="Sales mix by category"
      summary="Tiles hold the largest share of category sales in this example. Tools are highlighted as the fastest-moving category in the period."
      legend={[
        { label: 'Category share', tone: 'primary' },
        { label: 'Fastest moving', tone: 'highlight' },
      ]}
      sample
      table={{
        caption: 'Illustrative category share, percentage of period sales.',
        headers: ['Category', 'Share (%)'],
        rows: categoryData.map((d) => [d.label, d.value]),
      }}
    >
      <BarChart data={categoryData} unit="%" />
    </ChartFrame>
  ),
};

export const Line: Story = {
  render: () => (
    <ChartFrame
      title="Transactions per week"
      summary="Two locations compared over six weeks. The second location is drawn with a dashed line so the series remain distinguishable without colour."
      legend={[
        { label: 'Main branch (solid)', tone: 'primary' },
        { label: 'North branch (dashed)', tone: 'secondary' },
      ]}
      sample
      table={{
        caption: 'Illustrative weekly transaction counts.',
        headers: ['Week', 'Main branch', 'North branch'],
        rows: [
          ['W1', 420, 260],
          ['W2', 468, 288],
          ['W3', 442, 302],
          ['W4', 510, 330],
          ['W5', 560, 318],
          ['W6', 604, 372],
        ],
      }}
    >
      <LineChart
        labels={['W1', 'W2', 'W3', 'W4', 'W5', 'W6']}
        series={[
          { label: 'Main branch', values: [420, 468, 442, 510, 560, 604] },
          { label: 'North branch', values: [260, 288, 302, 330, 318, 372] },
        ]}
      />
    </ChartFrame>
  ),
};

export const Donut: Story = {
  render: () => (
    <ChartFrame
      title="Payment method split"
      summary="Card is the most common tender in this example, followed by cash and account."
      legend={[
        { label: 'Card', tone: 'primary' },
        { label: 'Cash', tone: 'secondary' },
        { label: 'Account', tone: 'context' },
      ]}
      sample
      table={{
        caption: 'Illustrative tender split, count of transactions.',
        headers: ['Method', 'Transactions'],
        rows: [
          ['Card', 612],
          ['Cash', 244],
          ['Account', 118],
        ],
      }}
    >
      <DonutChart
        data={[
          { label: 'Card', value: 612 },
          { label: 'Cash', value: 244 },
          { label: 'Account', value: 118 },
        ]}
      />
    </ChartFrame>
  ),
};

export const Kpis: Story = {
  render: () => (
    <KpiGrid>
      <KpiCard label="Below reorder point" value="18" note="products across 3 locations" />
      <KpiCard label="No incoming cover" value="4" note="products with no open PO" />
      <KpiCard label="Slow moving" value="31" delta={{ direction: 'up', text: 'up 6 on last period' }} />
      <KpiCard label="Stock value" value="312k" note="at cost" />
    </KpiGrid>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'KPI deltas state their direction in words as well as a symbol, so the change is never communicated by colour or arrow alone.',
      },
    },
  },
};
