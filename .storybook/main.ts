import type { StorybookConfig } from '@storybook/nextjs';

/**
 * Storybook configuration.
 *
 * Storybook packages are intentionally not in package.json dependencies —
 * run `npx storybook@latest init --builder webpack5` once to install them, and
 * this config plus the stories in `stories/` will be picked up as-is.
 */
const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  typescript: { reactDocgen: 'react-docgen-typescript' },
};

export default config;
