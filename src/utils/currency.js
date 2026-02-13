// ✅ Singapore currency
export const CURRENCY = "S$";

// ✅ single source of truth
export const DELIVERY_FEE = 5;

/**
 * Smart SGD formatter
 * Always shows 2 decimals (Stripe-safe)
 */
export const formatPrice = (price) => {
  const num = Number(price);

  if (isNaN(num)) return "S$0.00";

  return `${CURRENCY}${num.toFixed(2)}`;
};
