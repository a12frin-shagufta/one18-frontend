import React from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";
import { formatPrice } from "../utils/currency";

const MenuCard = ({ item, orders, setOrders, openCart }) => {
  const updateQty = (variant, type, e) => {
    e.stopPropagation(); // 🔥 IMPORTANT
    e.preventDefault();  // 🔥 IMPORTANT

    const key = `${item._id}_${variant.label}`;

    setOrders((prev) => {
      const currentQty = prev[key]?.qty || 0;
      const newQty =
        type === "inc" ? currentQty + 1 : Math.max(0, currentQty - 1);

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
    price: variant.price,
     image: item.images?.[0],        // REQUIRED
  categoryId: item.category?._id, // REQUIRED

    // 🔥 ADD THIS
    preorder: {
      enabled: item.preorder?.enabled || false,
      minDays: item.preorder?.minDays || 0,
    },
  },
};

    });

    if (type === "inc") openCart();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition">
      
      {/* IMAGE → PRODUCT DETAIL */}
      <Link to={`/product/${item.slug}`} className="block">
        <div className="aspect-square bg-gray-100 relative">
          <img
            src={item.images?.[0]}
            alt={item.name}
            className="w-full h-full object-cover"
          />

          {/* PREORDER BADGE */}
          {/* {item.preorder?.enabled && (
            <span className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full">
              Preorder
            </span>
          )} */}
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-3">
        {/* NAME → PRODUCT DETAIL */}
        <Link to={`/product/${item.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm mb-1 hover:underline">
            {item.name}
          </h3>
        </Link>

        {item.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* {item.preorder?.enabled && (
          <p className="text-[11px] text-amber-700 mb-2">
            Baked fresh • {item.preorder.minDays} days advance notice
          </p>
        )} */}

        <div className="space-y-2">
          {item.variants.map((variant) => {
            const key = `${item._id}_${variant.label}`;
            const qty = orders[key]?.qty || 0;

            return (
              <div key={variant.label} className="flex justify-between items-center">
                <div>
                  {/* <span className="text-sm text-gray-900">{variant.label}</span> */}
                  <span className="block text-xs text-gray-500">
                    {formatPrice(variant.price)}
                  </span>
                </div>

                {qty === 0 ? (
                  <button
  onClick={(e) => updateQty(variant, "inc", e)}
  className="bg-[#1E3A8A] text-yellow-400 px-3 py-1.5 rounded text-xs font-medium"
>
  ADD
</button>

                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => updateQty(variant, "dec", e)}
                      className="bg-gray-200 w-7 h-7 rounded flex items-center justify-center"
                    >
                      <FiMinus size={12} />
                    </button>

                    <span className="font-bold text-sm w-6 text-center">{qty}</span>

                    <button
                      onClick={(e) => updateQty(variant, "inc", e)}
                      className="bg-gray-200 w-7 h-7 rounded flex items-center justify-center"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
