'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/foundations/Button';
import { Eyebrow } from '@/components/foundations/Primitives';
import { Container, Section } from '@/components/layout/Layout';
import { Reveal } from '@/components/motion/Reveal';
import { track } from '@/lib/analytics';
import { useInViewport } from '@/lib/hooks';
import { contactMailto, site } from '@/lib/site';
import { StartHereIcon } from './StartHereIcon';
import styles from './FinalCta.module.css';

/**
 * Section 05 — final CTA / contact.
 *
 * The closing beat of the connected flow: the line that began in the hero
 * resolves into the Axlo slash here. One action, one address, nothing else.
 *
 * The three "I'd like to" interest pills that used to sit under the button were
 * removed: they gave the eye three secondary choices immediately below the one
 * decision this section exists to ask for, and each opened the same mail client
 * the primary action does.
 *
 * TWO ACTIONS, TWO JOBS
 * "Start a project" is the navigational action — it appears in the header and
 * the hero and scrolls here. "Start a conversation" is the action *at* the
 * destination, and it opens mail with the subject already set. Naming them
 * differently is deliberate: a button that scrolls and a button that opens a
 * mail client should not read identically, or the second one surprises people.
 */
export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInViewport(ref);
  const reported = useRef(false);

  useEffect(() => {
    if (!inView || reported.current) return;
    reported.current = true;
    track('final_cta_view', { placement: 'contact' });
  }, [inView]);

  return (
    <Section theme="dark" tone="deep" size="large" id="contact" labelledBy="cta-heading" className={styles.section}>
      <Container>
        <div className={styles.layout} ref={ref}>
          <Reveal>
            <Eyebrow withMark={false}>Start here</Eyebrow>

            <h2 className={styles.headline} id="cta-heading">
              {'Have a complex idea?\nLet’s make it flow.'}
            </h2>

            <p className={styles.supporting}>
              Tell us what you are building, improving, or trying to connect.
            </p>

            <div className={styles.actions}>
              <Button
                href={contactMailto}
                size="lg"
                withArrow
                className={styles.primary}
                onClick={() => track('cta_start_project', { id: 'final-cta', placement: 'contact' })}
              >
                Start a conversation
              </Button>

              <a
                className={styles.email}
                href={contactMailto}
                onClick={() => track('email_click', { placement: 'contact' })}
              >
                {site.email}
              </a>
            </div>
          </Reveal>

          <StartHereIcon />
        </div>
      </Container>
    </Section>
  );
}
