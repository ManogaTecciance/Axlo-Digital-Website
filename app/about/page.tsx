import type { Metadata } from 'next';
import Image from 'next/image';
import { Container, Section } from '@/components/layout/Layout';
import { PendingPanel } from '@/components/layout/PageBlocks';
import { PageHero } from '@/components/layout/PageHero';
import { Reveal, RevealGroup, RevealItem } from '@/components/motion/Reveal';
import { CtaLink } from '@/components/navigation/CtaLink';
import { about, leadership, leadershipRequirements } from '@/content/company';
import { breadcrumbSchema, pageMetadata } from '@/lib/seo';
import { primaryCta, site } from '@/lib/site';
import styles from './page.module.css';

const trail = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
];

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: about.description,
  path: '/about',
});

/**
 * About (brief §17).
 *
 * Company description, mission, vision, values, leadership.
 *
 * The leadership section is the one place on this site that renders a declared
 * gap in production. The brief asks for photographs and bios and adds "use only
 * approved company information" — so names and biographies must come from Axlo.
 * Writing plausible ones would be fabricating the identity of real people,
 * which is worse than an obviously unfinished section. The panel below states
 * exactly what is needed; the moment `leadership` has entries, the grid renders
 * instead and the panel disappears with no code change.
 */
export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(trail)) }}
      />

      <PageHero
        eyebrow="About Axlo Digital"
        title={about.headline}
        lead={about.description}
        trail={trail}
        aside={
          <div className={styles.heroActions}>
            <CtaLink href={primaryCta.href} withArrow placement="about-hero">
              {primaryCta.label}
            </CtaLink>
          </div>
        }
      />

      <Section theme="dark" size="large" labelledBy="purpose-heading">
        <Container>
          <h2 className="visually-hidden" id="purpose-heading">
            Mission and vision
          </h2>

          <div className={styles.purpose}>
            <Reveal className={styles.purposeCard}>
              <p className={styles.purposeLabel}>Mission</p>
              <p className={styles.purposeText}>{about.mission}</p>
            </Reveal>
            <Reveal className={styles.purposeCard}>
              <p className={styles.purposeLabel}>Vision</p>
              <p className={styles.purposeText}>{about.vision}</p>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section theme="dark" tone="subtle" size="large" labelledBy="values-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="values-heading">
              What we hold to.
            </h2>
          </Reveal>

          <RevealGroup className={styles.values} as="ul" aria-label="Company values">
            {about.values.map((value) => (
              <RevealItem key={value.name} as="li" className={styles.value}>
                <h3 className={styles.valueName}>{value.name}</h3>
                <p className={styles.valueSummary}>{value.summary}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <Section theme="dark" size="large" labelledBy="leadership-heading">
        <Container>
          <Reveal>
            <h2 className={styles.blockHeading} id="leadership-heading">
              Leadership
            </h2>
          </Reveal>

          {leadership.length > 0 ? (
            <RevealGroup className={styles.leaders} as="ul" aria-label="Leadership team">
              {leadership.map((leader) => (
                <RevealItem key={leader.id} as="li" className={styles.leader}>
                  {leader.photo ? (
                    <Image
                      className={styles.leaderPhoto}
                      src={leader.photo}
                      alt=""
                      width={200}
                      height={200}
                    />
                  ) : null}
                  <h3 className={styles.leaderName}>{leader.name}</h3>
                  <p className={styles.leaderRole}>{leader.role}</p>
                  <p className={styles.leaderBio}>{leader.bio}</p>
                </RevealItem>
              ))}
            </RevealGroup>
          ) : (
            <Reveal className={styles.pending}>
              <PendingPanel
                title="Leadership profiles are not published yet"
                requirements={leadershipRequirements}
                label="Awaiting approved content"
              >
                <p>
                  This section will carry the leadership team once Axlo Digital supplies approved
                  names, roles, biographies and photographs. Nothing is shown here in the meantime,
                  because inventing profiles for real people is not a placeholder — it is a
                  misrepresentation.
                </p>
                <p>
                  For each person, we need:
                </p>
              </PendingPanel>
            </Reveal>
          )}
        </Container>
      </Section>

      <Section theme="dark" tone="deep" size="large" labelledBy="about-cta-heading">
        <Container>
          <Reveal className={styles.cta}>
            <h2 className={styles.ctaHeading} id="about-cta-heading">
              Want to work with us?
            </h2>
            <p className={styles.ctaLead}>
              Tell us what you are building, improving or trying to connect — or write to{' '}
              <a className={styles.ctaEmail} href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
            <div className={styles.heroActions}>
              <CtaLink
                href={primaryCta.href}
                size="lg"
                withArrow
                analyticsId="about-footer"
                placement="about-cta"
              >
                {primaryCta.label}
              </CtaLink>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
