import type { Meta, StoryObj } from '@storybook/react';
import {
  Divider,
  Eyebrow,
  PlaceholderNote,
  SectionHeading,
  Skeleton,
  Status,
  Tag,
} from '@/components/foundations/Primitives';
import { EmptyState, ErrorState, LoadingState } from '@/components/feedback/Feedback';
import { Button } from '@/components/foundations/Button';

const meta: Meta = {
  title: 'Foundations/Primitives',
  parameters: {
    docs: {
      description: {
        component:
          'Small shared primitives. Every one consumes semantic tokens only — no raw brand colours appear in component CSS, which is what lets both themes work without forking a component.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Typography: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <p className="u-eyebrow">Eyebrow · 14px · uppercase</p>
      <h1 className="u-display-xl">Display XL</h1>
      <h2 className="u-display">Display</h2>
      <h3 className="u-h1">Heading 1</h3>
      <h4 className="u-h2">Heading 2</h4>
      <h5 className="u-h3">Heading 3</h5>
      <p className="u-body-lg">Body large — 18px, used for section leads and supporting copy.</p>
      <p className="u-body">Body — 16px, the default reading size across the site.</p>
      <p className="u-body-sm">Body small — 14px, the smallest size any body copy is allowed to be.</p>
    </div>
  ),
};

export const Tags: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
      <Tag>TypeScript</Tag>
      <Tag>React</Tag>
      <Tag accent>Commerce &amp; POS</Tag>
    </div>
  ),
};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
      <Status tone="live">Synchronised</Status>
      <Status tone="pending">Partially received</Status>
      <Status>Account open</Status>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Status is always a dot plus a text label. Colour never carries the meaning on its own.',
      },
    },
  },
};

export const Placeholders: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', maxWidth: '48rem' }}>
      <PlaceholderNote label="Pending">Verified outcome to be added.</PlaceholderNote>
      <PlaceholderNote label="To confirm">
        Integration status is confirmed per deployment and is not claimed here.
      </PlaceholderNote>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Content gaps are declared, not disguised. `PlaceholderNote` renders with `role="note"` and a dashed border so it is obvious in both design review and production.',
      },
    },
  },
};

export const SectionHeadings: Story = {
  render: () => (
    <SectionHeading
      eyebrow="Capabilities"
      title={'Complex problems.\nClear digital outcomes.'}
      lead="Section headings take an optional eyebrow and lead, and render at the heading level the page structure requires."
    />
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <LoadingState label="Loading case studies" />
      <EmptyState
        title="No case studies match those filters"
        description="Try removing a category or broadening the search."
        action={<Button variant="secondary">Clear filters</Button>}
      />
      <ErrorState
        description="We could not load that content. Try again, or email hello@axlodigital.com."
        action={<Button variant="secondary">Try again</Button>}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: '24rem' }}>
        <Skeleton width="60%" height="1.25rem" />
        <Skeleton height="0.875rem" />
        <Skeleton width="80%" height="0.875rem" />
      </div>
      <Divider flow />
      <Eyebrow>End of states</Eyebrow>
    </div>
  ),
};
