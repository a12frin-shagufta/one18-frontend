export const isOfferValid = (offer) => {
  if (!offer?.isActive) return false;

  const now = new Date();
  const start = new Date(offer.startDate);
  const end = new Date(offer.endDate);

  return now >= start && now <= end;
};

export const calculateDiscountedPrice = (price, offer) => {
  if (!offer) return price;

  const p = Number(price);

  if (offer.type === "percent") {
    const discounted = p - (p * Number(offer.value)) / 100;
    return Math.max(0, Math.round(discounted));
  }

  if (offer.type === "flat") {
    const discounted = p - Number(offer.value);
    return Math.max(0, Math.round(discounted));
  }

  return p;
};

// ✅ choose best offer (priority wise)
export const getBestOfferForItem = (item, offers = []) => {
  const validOffers = offers.filter(isOfferValid);

  // ✅ Priority: festival > category > selected > all
  const festivalOffers = validOffers.filter(
    (o) =>
      o.appliesTo === "festival" &&
      item.festival?._id &&
      (o.festivals || []).some((f) => String(f?._id || f) === String(item.festival._id))
  );

  if (festivalOffers.length > 0) return festivalOffers[0];

  const categoryOffers = validOffers.filter(
    (o) =>
      o.appliesTo === "category" &&
      item.category?._id &&
      (o.categories || []).some((c) => String(c?._id || c) === String(item.category._id))
  );

  if (categoryOffers.length > 0) return categoryOffers[0];

  const selectedOffers = validOffers.filter(
    (o) =>
      o.appliesTo === "selected" &&
      (o.products || []).some((p) => String(p?._id || p) === String(item._id))
  );

  if (selectedOffers.length > 0) return selectedOffers[0];

  const allOffers = validOffers.filter((o) => o.appliesTo === "all");
  if (allOffers.length > 0) return allOffers[0];

  return null;
};
