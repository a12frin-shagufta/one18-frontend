import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMenu } from "../services/festivalApi";
import FestivalCard from "./FestivalCard";

const STORAGE_KEY = "menu_section_products";

const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const MenuSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    
const load = async () => {
  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    setProducts(JSON.parse(cached));
    return;
  }

  const menu = await getMenu();

  // SAME LOGIC AS MENU PAGE
  const sorted = menu.sort((a, b) => {
  const CATEGORY_ORDER = [
    // "bundles",
    "croissants",
    "breads",
    "dessert pastries",
    "slice cakes",
    "whole cakes",
  ];

  const aCat = a.category?.name?.toLowerCase() || "";
  const bCat = b.category?.name?.toLowerCase() || "";

  const aIndex = CATEGORY_ORDER.indexOf(aCat);
  const bIndex = CATEGORY_ORDER.indexOf(bCat);

  // ✅ 1. CATEGORY ORDER FIRST (THIS WAS MISSING)
  if (aIndex !== bIndex) {
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  }

  // ✅ 2. CROISSANT INTERNAL ORDER
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

  // ✅ 3. BEST SELLER
  if (a.isBestSeller !== b.isBestSeller) {
    return a.isBestSeller ? -1 : 1;
  }

  // ✅ 4. NEWEST
  return new Date(b.createdAt) - new Date(a.createdAt);
});

  // take first 12
  const fewProducts = sorted.slice(0, 12);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(fewProducts));
  setProducts(fewProducts);
};
    load();
  }, []);

  return (
    <section className="py-8 md:py-12 max-w-7xl mx-auto px-4">
      {/* Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-5xl font-serif">Our Menu</h2>
        <p className="text-sm text-gray-500 uppercase mt-2">
          Explore our delicious menu
        </p>
      </div>

      {/* Products */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        {products.map((p) => (
          <FestivalCard key={p._id} product={p} />
        ))}
      </div>

      {/* View All Button */}
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
