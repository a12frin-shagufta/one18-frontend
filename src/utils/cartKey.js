// src/utils/cartKey.js
//
// ONE definition of a cart line's identity, used everywhere an item is added.
//
// Previously three places built this key differently, so the drawer computed a
// key that had never been stored and delete/qty silently did nothing.
//
// The drawer no longer recomputes it at all — it uses the real object key from
// the cart. This helper is only for the ADD paths, so that two genuinely
// different lines (different flavours, different cake wording) stay separate
// instead of overwriting each other.

export const getCartKey = (item) => {
  const addOnKey = item.addOns?.length
    ? "_" +
      item.addOns
        .map(
          (a) =>
            `${a.groupName || ""}:${a.label}x${a.quantity ?? 1}`,
        )
        .sort() // selection order shouldn't create a separate line
        .join("_")
    : "";

  // different wording = different cake, so it must be its own line
  const msg = item.cakeMessage?.trim() ? `_msg:${item.cakeMessage.trim()}` : "";

  return `${item.itemId}_${item.variant}${addOnKey}${msg}`;
};