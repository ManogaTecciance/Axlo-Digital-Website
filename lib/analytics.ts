'use client';

/**
 * Conversion event bridge.
 *
 * The project has **no analytics platform installed**, and the brief is
 * explicit that one must not be added without checking first. So this adds no
 * dependency, no script tag and no network call. It is a thin, typed seam:
 *
 *  • If a tag manager is ever installed, it will find a `window.dataLayer`
 *    already being populated with correctly-named events and start reporting
 *    from day one — no second pass over the components.
 *  • Until then every call is a silent no-op.
 *
 * Nothing here reads form fields, input values or anything a visitor types.
 * Events carry a stable id and a coarse placement, and nothing else.
 */

/** Every conversion-relevant interaction on the page, named once. */
export type AnalyticsEvent =
  | 'cta_start_project'
  | 'cta_explore_products'
  | 'product_explore'
  | 'email_click'
  | 'nav_section_click'
  | 'product_carousel_interact'
  | 'final_cta_view';

type AnalyticsPayload = {
  /** Which instance of the action fired — e.g. `hero-start-a-project`. */
  id?: string;
  /** Section the interaction happened in. */
  placement?: string;
  /** For product events: which product. */
  product?: string;
  /** For carousel events: how the visitor drove it. */
  method?: 'prev' | 'next' | 'dot' | 'swipe' | 'keyboard' | 'autoplay-toggle';
};

type DataLayerRecord = { event: string } & AnalyticsPayload;

declare global {
  interface Window {
    dataLayer?: DataLayerRecord[];
  }
}

/**
 * Record a conversion event.
 *
 * Safe to call from anywhere, including during SSR and from event handlers on
 * elements that also navigate — it never throws and never blocks.
 */
export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;
  // Only report into a queue something else owns. We never create the array,
  // because creating it would be installing an analytics surface.
  if (!Array.isArray(window.dataLayer)) return;
  try {
    window.dataLayer.push({ event, ...payload });
  } catch {
    // Analytics must never be able to break an interaction.
  }
}
