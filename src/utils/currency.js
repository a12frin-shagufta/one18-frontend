export const CURRENCY = "$";

// ✅ single source of truth
export const DELIVERY_FEE = 5;

/**
 * Format price with 2 decimals
 * @example formatPrice(5)     => $5.00
 * @example formatPrice(5.2)   => $5.20
 * @example formatPrice(10.99) => $10.99
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return `${CURRENCY}0.00`;
  }

  return `${CURRENCY}${Number(price).toFixed(2)}`;
};
