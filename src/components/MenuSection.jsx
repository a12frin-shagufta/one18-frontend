import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMenu } from "../services/festivalApi";
import FestivalCard from "./FestivalCard";

const MenuSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const menu = await getMenu();

      // show only few products
      const fewProducts = getRandomItems(menu, 12);

      setProducts(fewProducts);
    };

    load();
  }, []);

  const getRandomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

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