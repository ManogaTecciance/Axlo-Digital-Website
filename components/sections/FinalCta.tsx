'use client';

import { useEffect, useRef } from 'react';
import { Eyebrow } from '@/components/foundations/Primitives';
import { Container, Section } from '@/components/layout/Layout';
import { Reveal } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { track } from '@/lib/analytics';
import { useInViewport } from '@/lib/hooks';
import { contactMailto, primaryCta, site } from '@/lib/site';
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
 * decision this section exists to ask for. The CTA carries the same wording as
 * every other conversion action on the site — "Talk to Axlo", from
 * `primaryCta` — so the site asks for one thing in one way.
 *
 * The button now goes to /contact rather than opening a mail client. The
 * address stays beside it for anyone who would rather write directly.
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
              {'Have a complex business problem?\nLet’s make it flow.'}
            </h2>

            <p className={styles.supporting}>
              Tell us what you are building, improving, or trying to connect.
            </p>

            <div className={styles.actions}>
              <CtaLink
                href={primaryCta.href}
                size="lg"
                withArrow
                className={styles.primary}
                event="cta_talk_to_axlo"
                analyticsId="final-cta"
                placement="contact"
              >
                {primaryCta.label}
              </CtaLink>

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
