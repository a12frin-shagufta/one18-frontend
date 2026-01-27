import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const CategoryPage = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [categories, setCategories] = useState([]);
  const [menu, setMenu] = useState([]);

  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // const branchId = localStorage.getItem("selectedBranch");

  /* ======================
     FETCH DATA
  ====================== */
 useEffect(() => {
  const fetchData = async () => {
    try {
      const [catRes, menuRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/categories`),
        axios.get(`${BACKEND_URL}/api/menu`),
      ]);

      setCategories(catRes.data);
      setMenu(menuRes.data);
    } catch (err) {
      console.error("CategoryPage error:", err);
    }
  };

  fetchData();
}, []);


  /* ======================
     SLIDER CONTROLS
  ====================== */
  const scrollLeft = () => {
    sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  /* ======================
     IMAGE LOGIC
  ====================== */
  const getCategoryImage = (category) => {
  if (category.coverImage) return category.coverImage;

  const product = menu.find(
    (item) => item.category?._id === category._id && item.images?.length
  );

  return product?.images?.[0] || "/placeholder.jpg";
};

  /* ======================
     UI
  ====================== */
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* HEADER */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-3">
          Our Products
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-base text-gray-600">
         100% Muslim Owned | Premium Ingredients | No Preservatives  
        </p>
      </div>

      {/* ARROWS (Desktop only) */}
      <div className="hidden md:flex mb-8 justify-center gap-4">
        <button
          onClick={scrollLeft}
          className="w-9 h-9 rounded-full bg-[#0b2c2a] text-white flex items-center justify-center hover:opacity-90 transition"
        >
          <FiChevronLeft size={22} />
        </button>

        <button
          onClick={scrollRight}
          className="w-9 h-9 rounded-full bg-[#0b2c2a] text-white flex items-center justify-center hover:opacity-90 transition"
        >
          <FiChevronRight size={22} />
        </button>
      </div>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        className="
          flex gap-6 md:gap-10 
          overflow-x-auto no-scrollbar 
          px-1 md:px-4
          scroll-smooth
        "
      >
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => {
  navigate(`/menu/${cat._id}`);
}}

            className="
              flex-shrink-0 cursor-pointer 
              flex flex-col items-center 
              group
            "
          >
            {/* IMAGE */}
            <div
              className="
                w-28 h-28 
                sm:w-36 sm:h-36
                md:w-56 md:h-56
                rounded-full overflow-hidden 
                border border-gray-200 
                shadow-sm 
                transition-transform duration-300 
                group-hover:scale-105
              "
            >
              <img
                src={getCategoryImage(cat)}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* NAME */}
            <h2 className="mt-3 md:mt-4 text-sm md:text-lg font-medium capitalize text-gray-900 text-center">
              {cat.name}
            </h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryPage;
