'use client';

import type { ReactNode } from 'react';
import { track } from '@/lib/analytics';

/** The footer contact address. A plain mailto link that reports the click. */
export function FooterEmail({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} onClick={() => track('email_click', { placement: 'footer' })}>
      {children}
    </a>
  );
}
