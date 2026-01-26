import { Link } from "react-router-dom";
import { formatPrice } from "../utils/currency";

const FestivalCard = ({ product }) => {
  const original =
    product?.variants?.[0]?.originalPrice ?? product?.variants?.[0]?.price;

  const discounted =
    product?.variants?.[0]?.discountedPrice ?? product?.variants?.[0]?.price;

  const hasDiscount = discounted < original;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition"
    >
      {/* IMAGE */}
      <div className="w-full aspect-[5/5] bg-gray-100 overflow-hidden relative">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* ✅ OFFER BADGE */}
        {hasDiscount && product.offer && (
          <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded-full bg-red-100 text-red-600 font-semibold">
            {product.offer.type === "percent"
              ? `${product.offer.value}% OFF`
              : `$${product.offer.value} OFF`}
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        {/* ✅ Offer Title */}
        {hasDiscount && product.offer?.title && (
          <p className="text-[11px] text-gray-500 mt-1">
            🎉 {product.offer.title}
          </p>
        )}

        {/* ✅ PRICE */}
        <div className="mt-2">
          {original != null ? (
            hasDiscount ? (
              <div className="flex items-center gap-2">
                <p className="text-base font-bold text-green-700">
                  {formatPrice(discounted)}
                </p>
                <p className="text-sm text-gray-400 line-through">
                  {formatPrice(original)}
                </p>
              </div>
            ) : (
              <p className="text-base font-bold text-gray-900">
                {formatPrice(original)}
              </p>
            )
          ) : (
            "N/A"
          )}
        </div>
      </div>
    </Link>
  );
};

export default FestivalCard;
