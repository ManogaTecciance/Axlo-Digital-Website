'use client';

import { AxloPosInterface } from '@/components/product-demo/AxloPosInterface';
import { Comply360Interface } from '@/components/product-demo/Comply360Interface';
import { ProductMediaCarousel } from '@/components/product-demo/ProductMediaCarousel';
import { ProductModuleMap } from '@/components/product-demo/ProductModuleMap';
import type { Product, ProductState } from '@/content/products';

/**
 * The visual column for a product, wherever it appears.
 *
 * This exists because the carousel takes a `render` callback, and a function
 * cannot cross a server/client boundary. The product page is a server
 * component, so passing `render` from there fails at prerender time with
 * "Functions cannot be passed directly to Client Components". Keeping the
 * callback on this side of the boundary means the server pages hand over plain
 * data — a `Product` — and this decides how to draw it.
 *
 * It also puts the carousel-or-module-map decision in one place, so the
 * homepage band and the product page cannot diverge on what a product without
 * composed screens looks like.
 */
function renderState(productId: string, state: ProductState) {
  return productId === 'comply360' ? (
    <Comply360Interface state={state.id} />
  ) : (
    <AxloPosInterface state={state.id} />
  );
}

export function ProductVisual({ product }: { product: Product }) {
  if (!product.states?.length) {
    return <ProductModuleMap product={product} />;
  }

  return (
    <ProductMediaCarousel
      states={product.states}
      label={product.name}
      analyticsProduct={product.id}
      render={(state) => renderState(product.id, state)}
    />
  );
}
