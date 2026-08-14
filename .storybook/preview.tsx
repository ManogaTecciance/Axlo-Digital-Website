import type { Preview } from '@storybook/react';
import React from 'react';
import '../styles/globals.css';

/**
 * Every story renders inside a themed wrapper, so light and dark are
 * reviewable side by side and no component can pass review in one theme only.
 * The a11y addon runs against each story.
 */
const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: { disable: true },
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
    controls: { expanded: true },
  },
  globalTypes: {
    theme: {
      description: 'Axlo theme',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
          { value: 'both', title: 'Both' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as 'dark' | 'light' | 'both';

      const Panel = ({ mode }: { mode: 'dark' | 'light' }) => (
        <div
          data-theme={mode}
          style={{
            background: 'var(--color-bg)',
            color: 'var(--color-text)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <Story />
        </div>
      );

      if (theme === 'both') {
        return (
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <Panel mode="light" />
            <Panel mode="dark" />
          </div>
        );
      }

      return <Panel mode={theme} />;
    },
  ],
};

export default preview;
