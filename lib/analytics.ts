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

/** Every conversion-relevant interaction on the site, named once. */
export type AnalyticsEvent =
  | 'cta_talk_to_axlo'
  | 'cta_explore_products'
  | 'product_explore'
  | 'solution_explore'
  | 'industry_explore'
  | 'email_click'
  | 'nav_route_click'
  | 'nav_section_click'
  | 'product_carousel_interact'
  | 'final_cta_view'
  | 'contact_form_start'
  | 'contact_form_submit'
  | 'contact_form_success'
  | 'contact_form_error';

type AnalyticsPayload = {
  /** Which instance of the action fired — e.g. `hero-talk-to-axlo`. */
  id?: string;
  /** Section or page region the interaction happened in. */
  placement?: string;
  /** For product events: which product. */
  product?: string;
  /** For carousel events: how the visitor drove it. */
  method?: 'prev' | 'next' | 'dot' | 'swipe' | 'keyboard' | 'autoplay-toggle';
  /**
   * For form errors: which fields failed, by name only.
   *
   * Never the values — a validation event must not carry what somebody typed.
   */
  fields?: string[];
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
