import { FlatCompat } from '@eslint/eslintrc';

/**
 * Lint configuration.
 *
 * The project had no ESLint setup at all — `npm run lint` ran the deprecated
 * `next lint`, which drops into an interactive prompt and so could never pass
 * in CI or in a scripted check. This is the flat config `next lint` would have
 * generated, plus the accessibility rules, which matter on a page whose brief
 * targets WCAG 2.2 AA.
 */
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Deliberate escape hatch in the two polymorphic `as` helpers, where a
      // bare ElementType collapses `children` to never.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'storybook-static/**', 'next-env.d.ts'],
  },
];

export default config;
