import type { Metadata } from 'next';
import { BrandProposition } from '@/components/sections/BrandProposition';
import { ErpFinanceSection } from '@/components/sections/ErpFinanceSection';
import { FinalCta } from '@/components/sections/FinalCta';
import { Hero } from '@/components/sections/Hero';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ProofSection } from '@/components/sections/ProofSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { WhyAxloSection } from '@/components/sections/WhyAxloSection';
import { FlowConnector } from '@/components/motion/FlowLine';
import { pageMetadata, productSchemas } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = pageMetadata({
  title: 'Home',
  description: site.description,
  path: '/',
});

/**
 * Axlo Digital — homepage.
 *
 * The page tells one connected story, in the order the brief sets out in §6:
 * business complexity → connected technology → Axlo capabilities →
 * products → partner platforms → why Axlo → how we work → proof → CTA.
 *
 *   01 Hero            what Axlo is, and the two actions
 *   02 Problem         why disconnected systems cost the business
 *   03 Capabilities    the four disciplines that fix it
 *   04 Products        the four Axlo-owned products
 *   05 ERP & Finance   partner platforms, kept visibly separate from 04
 *   06 Why Axlo        how we work, before what we have done
 *   07 How we work     Think → Design → Build → Evolve
 *   08 Proof           what is verifiable today
 *   09 Final CTA       one ask
 *
 * Band 05 following band 04 is load-bearing, not incidental: brief §13 forbids
 * presenting Odoo or QuickBooks as Axlo products, and reading the owned
 * portfolio first, then a separately-styled partner layer, is what makes that
 * distinction obvious to somebody who is scanning rather than reading.
 *
 * The flow connector stitches the bands so the page reads as one system rather
 * than stacked blocks.
 */
export default function HomePage() {
  return (
    <>
      {/* SoftwareApplication entries for the product portfolio. Emitted here
          rather than in the layout because they describe this page's content. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemas()) }}
      />

      <Hero />
      <ProblemSection />
      <ServicesSection />
      <FlowConnector shape="diagonal" theme="dark" withPacket />
      <ProductsSection />
      <ErpFinanceSection />
      <WhyAxloSection />
      <BrandProposition />
      <ProofSection />
      <FinalCta />
    </>
  );
}
