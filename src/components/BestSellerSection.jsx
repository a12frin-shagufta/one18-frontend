import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMenu } from "../services/festivalApi";
import FestivalCard from "./FestivalCard";
import axios from "axios";

import {
  getBestOfferForItem,
  calculateDiscountedPrice,
} from "../utils/applyOffer";

const BestSellerSection = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [products, setProducts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // const branchId = localStorage.getItem("selectedBranch");

  /* ======================
     FETCH OFFERS
  ====================== */
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/offers`)
      .then((res) => setOffers(res.data || []))
      .catch(console.error);
  }, [BACKEND_URL]);

  /* ======================
     FETCH BEST SELLERS
  ====================== */
  useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const menu = await getMenu(); // ✅ NO branch

      const bestSellers = menu
        .filter((p) => p.isBestSeller)
        .slice(0, 4);

      setProducts(bestSellers);
    } catch (err) {
      console.error("Failed to load best sellers", err);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);

  /* ======================
     APPLY OFFER LOGIC ✅
  ====================== */
  const productsWithOffers = useMemo(() => {
    return products.map((item) => {
      const bestOffer = getBestOfferForItem(item, offers);

      const updatedVariants = (item.variants || []).map((v) => {
        const originalPrice = v.price;
        const discountedPrice = calculateDiscountedPrice(originalPrice, bestOffer);

        return {
          ...v,
          originalPrice,
          discountedPrice,
        };
      });

      return {
        ...item,
        offer: bestOffer || null,
        variants: updatedVariants,
      };
    });
  }, [products, offers]);

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

  if (!productsWithOffers.length) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <section className="py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-light text-3xl md:text-5xl font-serif text-gray-900 mb-2">
            Best Sellers
          </h2>
          <p className="mt-3
      text-sm md:text-base
      text-gray-500
      tracking-wider
      uppercase">
            Our most loved products
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
          {productsWithOffers.map((p) => (
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
