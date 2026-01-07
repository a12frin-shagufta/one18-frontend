import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMenu } from "../services/festivalApi";
import FestivalCard from "./FestivalCard";

const BestSellerSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const branchId = localStorage.getItem("selectedBranch");

  /* ======================
     FETCH BEST SELLERS
  ====================== */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const menu = await getMenu(branchId); // branch optional
        const bestSellers = menu
          .filter(p => p.isBestSeller)
          .slice(0, 4);

        setProducts(bestSellers);
      } catch (err) {
        console.error("Failed to load best sellers", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [branchId]);

  /* ======================
     UI
  ====================== */
  if (loading) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center">Loading best sellers...</div>
      </div>
    );
  }

  if (!products.length) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <section className="py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className=" font-light text-4xl md:text-5xl font-serif text-gray-900 mb-2">
             Best Sellers
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Our most loved products
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          {products.map(p => (
            <FestivalCard key={p._id} product={p} />
          ))}
        </div>

        {/* View All */}
        <div className="flex justify-center">
          <Link
            to="/best-sellers"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#1E3A8A] text-white text-sm md:text-base font-medium rounded-full"
          >
            View All
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BestSellerSection;
