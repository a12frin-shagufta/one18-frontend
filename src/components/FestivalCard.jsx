import { Link } from "react-router-dom";
import { formatPrice } from "../utils/currency";

const FestivalCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group bg-white rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition"
    >
      {/* IMAGE */}
      <div className="w-full aspect-[5/5] bg-gray-100 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* INFO */}
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
          {product.name}
        </h3>

        <p className="mt-2 text-base font-bold text-gray-900">
          {product.variants?.[0]?.price != null
            ? formatPrice(product.variants[0].price)
            : "N/A"}
        </p>
      </div>
    </Link>
  );
};

export default FestivalCard;
