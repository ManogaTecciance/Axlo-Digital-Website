import type { Metadata } from 'next';
import { BrandProposition } from '@/components/sections/BrandProposition';
import { FinalCta } from '@/components/sections/FinalCta';
import { Hero } from '@/components/sections/Hero';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { FlowConnector } from '@/components/motion/FlowLine';
import { pageMetadata } from '@/lib/seo';
import { productSchemas } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: 'Home',
  description:
    'Axlo Digital designs and builds connected digital products, operational platforms, and intelligent systems for modern businesses.',
  path: '/',
});

/**
 * Axlo Digital — single-page landing.
 *
 * The entire first release lives on this one route. Primary navigation scrolls
 * to sections within this page; there are no secondary routes. The approved
 * order is Hero → Services → Products → How We Work → Final CTA, with the Footer
 * supplied by the root layout. The flow connector stitches the bands so the
 * page reads as one continuous system rather than stacked blocks.
 *
 * The trust strip is not a sixth section: it carries no heading rank and no id,
 * and sits directly under Products as evidence for the two products above it.
 */
export default function HomePage() {
  return (
    <>
      {/* SoftwareApplication entries for the two products. Emitted here rather
          than in the layout because they describe this page's content. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchemas()) }}
      />

      <Hero />
      <ServicesSection />
      <FlowConnector shape="diagonal" theme="dark" withPacket />
      <ProductsSection />
      <TrustSection />
      <BrandProposition />
      <FinalCta />
    </>
  );
}
