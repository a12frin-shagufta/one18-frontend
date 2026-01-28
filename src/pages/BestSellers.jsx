import { useEffect, useState } from "react";
import { getMenu } from "../services/festivalApi";
import FestivalCard from "../components/FestivalCard";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ SAME logic as homepage
        const menu = await getMenu(); // NO branch
        const bestSellerProducts = menu.filter(p => p.isBestSeller);
        setProducts(bestSellerProducts);
      } catch (error) {
        console.error("Error loading best sellers:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">
        Loading best sellers…
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* HEADER */}
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
          Best Sellers
        </h1>
        <p className="text-gray-600 text-base md:text-lg">
          Discover our most loved products
        </p>

        <div className="mt-4 inline-block px-4 py-2 bg-gray-100 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            {products.length}{" "}
            {products.length === 1 ? "Product" : "Products"}
          </span>
        </div>
      </div>

      {/* GRID */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => (
            <FestivalCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          No best seller products available.
        </div>
      )}
    </div>
  );
};

export default BestSellers;
