// src/utils/metaPixel.js
//
// Meta (Facebook) Pixel for a single-page app.
//
// Setup: put your pixel ID in .env as
//   VITE_META_PIXEL_ID=1234567890
// With no ID set, every function here is a no-op — so local dev and previews
// don't pollute your production pixel data.
//
// Why not just paste Meta's snippet into index.html?
//  - A SPA only loads index.html once, so PageView would fire once per visit
//    instead of once per screen.
//  - Hardcoding the ID means dev and staging report into the same pixel.
//  - Purchase must survive the Stripe redirect and must not double-count on
//    refresh. That needs code, not a snippet.

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

let loaded = false;

/** Inject Meta's base code once. Safe to call repeatedly. */
export const initPixel = () => {
  if (!PIXEL_ID || loaded || typeof window === "undefined") return;

  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );

  window.fbq("init", PIXEL_ID);
  loaded = true;
};

const fire = (type, name, data, options) => {
  if (!PIXEL_ID || typeof window === "undefined" || !window.fbq) return;
  try {
    if (options) window.fbq(type, name, data || {}, options);
    else window.fbq(type, name, data || {});
  } catch (err) {
    // never let analytics break a checkout
    console.warn("Pixel event failed:", name, err);
  }
};

export const trackPageView = () => fire("track", "PageView");

/** Product page view. */
export const trackViewContent = (product, variant) =>
  fire("track", "ViewContent", {
    content_ids: [product?._id],
    content_name: product?.name,
    content_type: "product",
    content_category: product?.category?.name,
    value: Number(variant?.price) || Number(product?.variants?.[0]?.price) || 0,
    currency: "SGD",
  });

/** One cart line was added. `unitPrice` should already include add-ons. */
export const trackAddToCart = ({ product, qty, unitPrice }) =>
  fire("track", "AddToCart", {
    content_ids: [product?._id],
    content_name: product?.name,
    content_type: "product",
    contents: [{ id: product?._id, quantity: Number(qty) || 1 }],
    value: (Number(unitPrice) || 0) * (Number(qty) || 1),
    currency: "SGD",
  });

/** Customer reached the checkout page. */
export const trackInitiateCheckout = ({ items = [], value }) =>
  fire("track", "InitiateCheckout", {
    content_ids: items.map((i) => i.itemId),
    contents: items.map((i) => ({ id: i.itemId, quantity: i.qty })),
    num_items: items.reduce((n, i) => n + (Number(i.qty) || 0), 0),
    value: Number(value) || 0,
    currency: "SGD",
  });

/**
 * Purchase — deduplicated.
 *
 * The Stripe return page can be refreshed or reopened from history, and Meta
 * counts every fire. Passing the order number as eventID lets Meta dedupe
 * server-side, and the localStorage guard stops the request being sent twice
 * from this browser at all.
 */
export const trackPurchase = ({ orderNumber, value, currency = "SGD" }) => {
  if (!PIXEL_ID) return;

  const key = `pixel_purchase_${orderNumber || "unknown"}`;
  try {
    if (orderNumber && localStorage.getItem(key)) return; // already reported
    if (orderNumber) localStorage.setItem(key, "1");
  } catch {
    // private mode / storage disabled — fall through and accept the risk
  }

  fire(
    "track",
    "Purchase",
    { value: Number(value) || 0, currency },
    orderNumber ? { eventID: orderNumber } : undefined,
  );
};

export const isPixelEnabled = () => !!PIXEL_ID;