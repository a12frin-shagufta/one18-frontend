import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BranchSelect = () => {
  const [branches, setBranches] = useState([]);
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl w-full">
        {/* HEADER */}
        <div className="text-center mb-14">
          <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
            Choose Your Nearest Bakery
          </h1>
          <p className="text-gray-600 mt-3">
            Select a location to start your order
          </p>
        </div>

        {/* BRANCH CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {branches.map((branch) => (
            <div
              key={branch._id}
              onClick={() => handleSelectBranch(branch)}
              className="group cursor-pointer bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* IMAGE */}
              <div className="h-64 overflow-hidden">
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
              <div className="p-8 text-center">
                <h2 className="text-2xl font-serif text-[#5c3a21]">
                  {branch.name}
                </h2>

                <p className="text-gray-600 mt-2 text-sm">
                  {branch.address}
                </p>

                <button className="mt-6 px-8 py-3 rounded-full bg-[#1E3A8A] text-white text-base font-medium transition hover:opacity-90">
                  Order from this bakery
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BranchSelect;
