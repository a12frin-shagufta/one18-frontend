import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";


const MenuCard = ({ item, orders, setOrders, openCart }) => {
  const navigate = useNavigate();
const isOutOfStock = item.stock <= 0 || item.isAvailable === false;

  const hasMultipleVariants = item.variants.length > 1;
  const variant = item.variants[0];
  const key = `${item._id}_${variant.label}`;
  const qty = orders[key]?.qty || 0;

  const addSingleVariantToCart = (e, type) => {
    if (isOutOfStock) return; // ✅ ADD THIS
    e.stopPropagation();
    e.preventDefault();

    setOrders((prev) => {
      const currentQty = prev[key]?.qty || 0;
    let newQty =
  type === "inc" ? currentQty + 1 : Math.max(0, currentQty - 1);

// 🚫 Prevent exceeding stock
if (newQty > item.stock) {
  newQty = item.stock;
}

      if (newQty === 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }

      return {
  ...prev,
  [key]: {
    itemId: item._id,
    name: item.name,
    variant: variant.label,
    qty: newQty,
    price: variant.discountedPrice ?? variant.price,
    image: item.images?.[0],
    category: item.category?.name, // ✅ ADD THIS
  },
};
    });

    if (type === "inc") {
  const fulfillment = localStorage.getItem("fulfillmentData");
  if (!fulfillment) {
    openCart();
  }
}

  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isOutOfStock) return; // ✅ ADD THIS

    if (hasMultipleVariants) {
      navigate(`/product/${item.slug}`);
      return;
    }

    addSingleVariantToCart(e, "inc");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full">
      {/* IMAGE - Optimized for mobile */}
      <Link to={`/product/${item.slug}`} className="block">
        <div className="relative pt-[75%] bg-gray-100 overflow-hidden">
          <img
            src={item.images?.[0]}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {isOutOfStock && (
  <div className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
    Out of Stock
  </div>
)}

          {/* Badges */}
          {item.offer && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {item.offer.type === "percentage"
                ? `-${item.offer.value}%`
                : `Save $${item.offer.value}`}
            </div>
          )}

          {item.isBestSeller && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
              Best Seller
            </div>
          )}
        </div>
      </Link>

      {/* CONTENT - Compact for mobile */}
      <div className="p-3 flex flex-col flex-1">
        {/* NAME - Mobile optimized */}
        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
          {item.name}
        </h3>

        {/* DESCRIPTION - Hidden on mobile, shown on tablet+ */}
        <div className="hidden sm:block mt-1 min-h-[32px]">
          <p className="text-[#1E3A8A] text-xs line-clamp-2">
            {item.description || ""}
          </p>
        </div>

        {/* PRICE - Mobile optimized */}
        <div className="mt-2 mb-3 min-h-[40px]">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-gray-900">
              S${Number(variant.discountedPrice ?? variant.price).toFixed(2)}
            </span>

            {variant.discountedPrice !== null &&
              variant.discountedPrice < variant.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  S${Number(variant.originalPrice).toFixed(2)}
                </span>
              )}
          </div>
        </div>

        {/* ACTION BUTTONS - Mobile optimized */}
        <div className="mt-auto">
         {isOutOfStock ? (
  <button
    disabled
    className="w-full bg-gray-300 text-gray-600 text-sm font-semibold py-2.5 rounded-md cursor-not-allowed"
  >
    Out of Stock
  </button>
) : qty === 0 ? (
  <button
    onClick={handleAddClick}
    className="w-full bg-[#1E3A8A] text-white text-sm font-semibold py-2.5 rounded-md transition-colors duration-200 active:scale-95"
  >
    {hasMultipleVariants ? "View Options" : "Add to Cart"}
  </button>
) : (
  <div className="flex items-center justify-between bg-blue-50 rounded-lg px-3 py-2">
    <button
      onClick={(e) => addSingleVariantToCart(e, "dec")}
      className="w-7 h-7 flex items-center justify-center bg-white border border-gray-300 rounded-full active:bg-gray-100"
    >
      <FiMinus size={14} />
    </button>

    <div className="flex flex-col items-center">
      <span className="font-bold text-gray-900">{qty}</span>
      <span className="text-xs text-gray-500">in cart</span>
    </div>

    <button
  disabled={qty >= item.stock}
  onClick={(e) => addSingleVariantToCart(e, "inc")}
  className={`w-7 h-7 flex items-center justify-center border rounded-full
    ${qty >= item.stock 
      ? "bg-gray-200 cursor-not-allowed"
      : "bg-white border-gray-300 active:bg-gray-100"
    }`}
>
      <FiPlus size={14} />
    </button>
  </div>
)}

        </div>
      </div>
    </div>
  );
};

export default MenuCard;
