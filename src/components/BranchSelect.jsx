import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BranchSelect = () => {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/branches`)
      .then((res) => setBranches(res.data))
      .catch(console.error);
  }, []);

  const BRANCH_IMAGES = {
    "North Bridge Rd": "/images/north.png",
    "Tampines St 81": "/images/tampines.png",
  };

  const handleSelectBranch = (branch) => {
    localStorage.setItem("selectedBranch", branch._id);
    localStorage.setItem(
      "selectedBranchData",
      JSON.stringify({
        _id: branch._id,
        name: branch.name,
        address: branch.address,
        image:
          BRANCH_IMAGES[branch.name] ||
          "/images/branches/default.jpg",
      })
    );

    navigate("/menu");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-6xl w-full">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-4xl font-serif text-gray-900">
            Choose Your Nearest Bakery
          </h1>
          <p className="text-gray-600 mt-2 text-sm md:text-base">
            Swipe to select a location and start your order
          </p>
        </div>

        {/* MOBILE: HORIZONTAL SLIDER */}
        <div
          ref={sliderRef}
          className="
            flex md:grid 
            md:grid-cols-2 
            gap-6 md:gap-10
            overflow-x-auto md:overflow-visible
            snap-x snap-mandatory
            no-scrollbar
            px-1
          "
        >
          {branches.map((branch) => (
            <div
              key={branch._id}
              onClick={() => handleSelectBranch(branch)}
              className="
                snap-center
                min-w-[85%] md:min-w-0
                group cursor-pointer 
                bg-white rounded-3xl 
                overflow-hidden 
                transition-all duration-300
                hover:-translate-y-2 hover:shadow-2xl
              "
            >
              {/* IMAGE */}
              <div className="h-56 md:h-64 overflow-hidden">
                <img
                  src={
                    BRANCH_IMAGES[branch.name] ||
                    "/images/branches/default.jpg"
                  }
                  alt={branch.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* CONTENT */}
              <div className="p-6 md:p-8 text-center">
                <h2 className="text-xl md:text-2xl font-serif text-[#5c3a21]">
                  {branch.name}
                </h2>

                <p className="text-gray-600 mt-2 text-sm">
                  {branch.address}
                </p>

                <button className="mt-5 px-6 py-3 rounded-full bg-[#1E3A8A] text-white text-sm md:text-base font-medium transition hover:opacity-90">
                  Order from this bakery
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE HINT */}
        <p className="md:hidden text-center text-xs text-gray-400 mt-4">
          ← Swipe to see more locations →
        </p>
      </div>
    </div>
  );
};

export default BranchSelect;
