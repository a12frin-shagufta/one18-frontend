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

  const branchId = localStorage.getItem("selectedBranch");

  /* ======================
     FETCH DATA (SAFE)
  ====================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryReq = axios.get(`${BACKEND_URL}/api/categories`);

        const menuReq = axios.get(`${BACKEND_URL}/api/menu`, {
          params: branchId ? { branch: branchId } : {},
        });

        const [catRes, menuRes] = await Promise.all([
          categoryReq,
          menuReq,
        ]);

        setCategories(catRes.data);
        setMenu(menuRes.data);
      } catch (err) {
        console.error("CategoryPage error:", err);
      }
    };

    fetchData();
  }, [branchId]);

  const scrollLeft = () => {
  sliderRef.current?.scrollBy({
    left: -300,
    behavior: "smooth",
  });
};

const scrollRight = () => {
  sliderRef.current?.scrollBy({
    left: 300,
    behavior: "smooth",
  });
};


  /* ======================
     IMAGE LOGIC
  ====================== */
  const getCategoryImage = (category) => {
    if (category.coverImage) return category.coverImage;

    const product = menu.find(
      (item) => item.category?._id === category._id
    );

    return product?.images?.[0] || "/placeholder.jpg";
  };

  /* ======================
     UI
  ====================== */
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">
          Our Products
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600">
          For more than 25 years, Magnolia Bakery has been making America’s
          favorite baked goods the old-fashioned way.
        </p>
      </div>
      {/* ARROWS */}
<div className="mb-10 flex justify-center gap-4">
  <button
    onClick={scrollLeft}
    className="w-8 h-8 rounded-full bg-[#0b2c2a] text-white flex items-center justify-center hover:opacity-90 transition"
  >
    <FiChevronLeft size={22} />
  </button>

  <button
    onClick={scrollRight}
    className="w-8 h-8 rounded-full bg-[#0b2c2a] text-white flex items-center justify-center hover:opacity-90 transition"
  >
    <FiChevronRight size={22} />
  </button>
</div>


      {/* VIEW ALL */}
      
      {/* SLIDER */}
     <div
  ref={sliderRef}
  className="flex gap-10 overflow-x-auto no-scrollbar px-1"
>
  

        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => {
  if (!branchId) return;
  navigate(`/menu/${cat._id}?branch=${branchId}`);
}}




            className="flex-shrink-0 cursor-pointer flex flex-col items-center group"
          >
            <div className="w-56 h-56 rounded-full overflow-hidden border border-gray-200 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img
                src={getCategoryImage(cat)}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="mt-4 text-lg font-medium capitalize text-gray-900">
              {cat.name}
            </h2>
          </div>
        ))}
        
      </div>
    </section>
  );
};

export default CategoryPage;
