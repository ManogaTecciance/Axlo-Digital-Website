import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/foundations/Button';

const meta: Meta<typeof Button> = {
  title: 'Foundations/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: [
          '**Accessibility**',
          '',
          '- Minimum target height is 44px (`sm`) and 48px by default.',
          '- `focus-visible` shows a 2px `--color-focus` ring at 2px offset in both themes.',
          '- The loading state keeps the button focusable, sets `aria-busy`, and shows a text label — never a spinner alone.',
          '- With `href` the component renders a real link, so middle-click and "open in new tab" behave normally.',
          '- Accent variants pair `--color-accent` with `--color-on-accent`, so dark text on bright aqua is enforced by the tokens rather than chosen per-usage.',
        ].join('\n'),
      },
    },
  },
  args: { children: 'Start a project' },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary', withArrow: true } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Accent: Story = { args: { variant: 'accent' } };

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', alignItems: 'center' }}>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button disabled>Disabled</Button>
      <Button loading loadingLabel="Sending…">
        Loading
      </Button>
      <Button size="sm">Small</Button>
      <Button size="lg" withArrow>
        Large
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Default, hover, focus-visible, pressed, disabled and loading. Hover and focus states are CSS-driven; tab through this story to review the focus ring in both themes.',
      },
    },
  },
};

export const AsLink: Story = {
  args: { href: '/contact', withArrow: true, children: 'Start a project' },
};
