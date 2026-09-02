// src/utils/googleTagManager.js
//
// Google Tag Manager container.
//
// This exists so the client can add lead-gen tools, popups and tracking herself
// from the GTM dashboard, without needing a code change and deploy each time.
//
// Setup: put the container ID in .env as
//   VITE_GTM_ID=GTM-XXXXXXX
// and add the same variable in Vercel, then redeploy — Vite bakes env vars in
// at build time, so adding the variable alone does nothing.
//
// With no ID set every function here is a no-op, so local dev and previews
// don't fire tags into the live container.
//
// Note: GTM can also host the Meta Pixel and Google Analytics. We're not
// migrating those — they work, and moving them risks breaking tracking for no
// immediate gain. If anything is ever added twice (once in code, once in GTM),
// events will double-count.

const GTM_ID = import.meta.env.VITE_GTM_ID;

let loaded = false;

/** Inject the GTM container once. Safe to call repeatedly. */
export const initGTM = () => {
  if (!GTM_ID || loaded || typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
    GTM_ID,
  )}`;
  document.head.appendChild(script);

  loaded = true;
};

/**
 * Tell GTM the route changed.
 *
 * A single-page app never reloads, so GTM's built-in Page View trigger only
 * ever fires once per visit. Tags that should run on specific pages need this
 * event and a "Custom Event: route_change" trigger in GTM.
 */
export const gtmPageView = (path) => {
  if (!GTM_ID || typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({
    event: "route_change",
    page_path: path,
  });
};

/**
 * Push a custom event, e.g. gtmEvent("lead_form_submitted", { source: "hero" }).
 * Wrapped so a bad tag can never break a page.
 */
export const gtmEvent = (event, data = {}) => {
  if (!GTM_ID || typeof window === "undefined" || !window.dataLayer) return;
  try {
    window.dataLayer.push({ event, ...data });
  } catch (err) {
    console.warn("GTM event failed:", event, err);
  }
};

export const isGTMEnabled = () => !!GTM_ID;