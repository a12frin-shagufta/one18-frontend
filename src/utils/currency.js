export const CURRENCY = "$";

// ✅ single source of truth
export const DELIVERY_FEE = 5;

/**
 * Smart price formatter
 * - Whole numbers → $2
 * - Decimals → $2.50
 */
export const formatPrice = (price) => {
  if (price === null || price === undefined || isNaN(price)) {
    return `${CURRENCY}0`;
  }

  return `${CURRENCY}${Math.round(Number(price))}`;
};
