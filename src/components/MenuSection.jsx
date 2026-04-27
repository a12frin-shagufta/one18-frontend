import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMenu } from "../services/festivalApi";
import FestivalCard from "./FestivalCard";

const STORAGE_KEY = "menu_section_products";
const CACHE_TTL_MS = 5 * 60 * 1000; // ✅ 5 minute cache expiry

const MenuSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      // ✅ Check cache with expiry
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL_MS) {
            setProducts(data);
            return; // use cache, skip fetch
          }
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }

      // Fetch fresh data
      const menu = await getMenu();

      const CATEGORY_ORDER = [
        "croissants",
        "breads",
        "dessert pastries",
        "slice cakes",
        "whole cakes",
      ];

      const sorted = menu.sort((a, b) => {
        const aCat = a.category?.name?.toLowerCase() || "";
        const bCat = b.category?.name?.toLowerCase() || "";

        const aIndex = CATEGORY_ORDER.indexOf(aCat);
        const bIndex = CATEGORY_ORDER.indexOf(bCat);

        if (aIndex !== bIndex) {
          return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
        }

        if (aCat === "croissants") {
          const normalize = (str = "") =>
            str.toLowerCase().replace(/\s+/g, " ").trim();
          const order = ["sweet", "savoury", "plain"];
          const aSub = normalize(a.subcategory?.name || "plain");
          const bSub = normalize(b.subcategory?.name || "plain");
          const aSubIndex = order.findIndex((k) => aSub.includes(k));
          const bSubIndex = order.findIndex((k) => bSub.includes(k));
          if (aSubIndex !== bSubIndex) {
            return (aSubIndex === -1 ? 99 : aSubIndex) - (bSubIndex === -1 ? 99 : bSubIndex);
          }
        }

        if (a.isBestSeller !== b.isBestSeller) return a.isBestSeller ? -1 : 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      const fewProducts = sorted.slice(0, 12);

      // ✅ Store with timestamp
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data: fewProducts, timestamp: Date.now() })
      );
      setProducts(fewProducts);
    };

    load();
  }, []);

  return (
    <section className="py-8 md:py-12 max-w-7xl mx-auto px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-serif">Our Menu</h2>
        <p className="text-sm text-gray-500 uppercase mt-2">
          Explore our delicious menu
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {products.map((p) => (
          <FestivalCard key={p._id} product={p} />
        ))}
      </div>

      <div className="flex justify-center">
        <Link
          to="/menu"
          className="px-8 py-3 bg-[#1E3A8A] text-white rounded-full"
        >
          View All
        </Link>
      </div>
    </section>
  );
};

export default MenuSection;