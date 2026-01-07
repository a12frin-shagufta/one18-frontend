import { Link } from "react-router-dom";
import { CURRENCY } from "../utils/currency";
import { formatPrice } from "../utils/currency";
const FestivalCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-gray-100 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container - Larger on mobile */}
      <div className="relative overflow-hidden w-full pt-[120%] sm:pt-[110%] md:pt-[100%]">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1 line-clamp-2 min-h-[2.5rem] leading-tight">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="mt-auto pt-2">
          <p className="text-base sm:text-lg font-bold text-gray-900">
          {product.variants?.[0]?.price != null
  ? formatPrice(product.variants[0].price)
  : "N/A"}

          </p>
        </div>
      </div>
    </Link>
  );
};

export default FestivalCard;