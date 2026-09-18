// Meta (Facebook) Pixel helper for client-side event tracking

declare global {
  interface Window {
    fbq?: (
      action: "init" | "track" | "trackCustom",
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq?: unknown;
  }
}

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID ||
  process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID ||
  "";

/**
 * Fires a PageView event on route change
 */
export const pageview = (): void => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "PageView");
  } else if (process.env.NODE_ENV === "development") {
    console.log("[Meta Pixel] Event: PageView");
  }
};

/**
 * Dispatch standard or custom Meta Pixel events
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, unknown>
): void => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", eventName, params);
  } else if (process.env.NODE_ENV === "development") {
    console.log(`[Meta Pixel] Event: ${eventName}`, params || "");
  }
};

/**
 * Triggered when a new restaurant merchant registers or signs up
 */
export const trackCompleteRegistration = (method: string = "Email"): void => {
  trackEvent("CompleteRegistration", {
    content_name: "Merchant Signup",
    status: "success",
    method,
  });
};

/**
 * Triggered when a user clicks to upgrade or start a subscription trial
 */
export const trackInitiateCheckout = (
  planName: string,
  value: number = 0,
  currency: string = "INR"
): void => {
  trackEvent("InitiateCheckout", {
    content_name: planName,
    content_category: "Subscription Plan",
    value,
    currency,
  });
};

/**
 * Triggered when a merchant creates their menu, publishes, or requests demo
 */
export const trackLead = (action: string): void => {
  trackEvent("Lead", {
    content_name: action,
    content_category: "Restaurant Owner",
  });
};

/**
 * Triggered when a customer or owner views a live menu or preview
 */
export const trackViewContent = (
  contentName: string,
  category: string = "Digital Menu"
): void => {
  trackEvent("ViewContent", {
    content_name: contentName,
    content_category: category,
  });
};
