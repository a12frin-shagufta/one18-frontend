import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiPlus, FiMinus } from "react-icons/fi";

const MenuCard = ({ item, orders, setOrders, openCart }) => {
  const navigate = useNavigate();

  const hasMultipleVariants = item.variants.length > 1;
  const variant = item.variants[0]; // first variant for price display
  const key = `${item._id}_${variant.label}`;
  const qty = orders[key]?.qty || 0;

  const addSingleVariantToCart = (e, type) => {
    e.stopPropagation();
    e.preventDefault();

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
          price: variant.discountedPrice ?? variant.price,
          image: item.images?.[0],
        },
      };
    });

    if (type === "inc") openCart();
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    // 🔥 MULTI VARIANT → GO TO PRODUCT PAGE
    if (hasMultipleVariants) {
      navigate(`/product/${item.slug}`);
      return;
    }

    // 🔥 SINGLE VARIANT → DIRECT ADD
    addSingleVariantToCart(e, "inc");
  };

  return (
    <div className="bg-white rounded-xl border shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
      {/* IMAGE */}
      <Link to={`/product/${item.slug}`}>
        <div className="aspect-[4/3] bg-gray-100">
          <img
            src={item.images?.[0]}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* CONTENT */}
      <div className="p-5 flex flex-col flex-1">
        {/* NAME */}
        <h3 className="text-lg font-semibold text-gray-900 leading-snug">
          {item.name}
        </h3>

        {/* DESCRIPTION */}
        {item.description && (
          <p className="text-blue-700 text-sm mt-2 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* PRICE */}
        <div className="mt-4 mb-4">
          <span className="text-xl font-bold text-gray-900">
            S${Number(variant.discountedPrice ?? variant.price).toFixed(2)}
          </span>
        </div>

        {/* ACTION */}
        {qty === 0 ? (
          <button
            onClick={handleAddClick}
            className="mt-auto w-full bg-[#233A95] text-yellow-400 text-lg font-semibold py-3 rounded-md hover:bg-[#1c2f7a] transition"
          >
            Add
          </button>
        ) : (
          <div className="mt-auto flex items-center justify-between border rounded-md px-4 py-2">
            <button
              onClick={(e) => addSingleVariantToCart(e, "dec")}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            >
              <FiMinus />
            </button>

            <span className="font-semibold text-lg">{qty}</span>

            <button
              onClick={(e) => addSingleVariantToCart(e, "inc")}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded"
            >
              <FiPlus />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuCard;
