import React from "react";
import { useNavigate } from "react-router-dom";

const CateringSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-[#1E3A8A] py-8 md:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
          
          {/* LEFT CONTENT */}
          <div className="order-2 lg:order-1">
            <p className="text-[#F4A300] font-serif text-lg sm:text-xl md:text-2xl mb-2 md:mb-3">
              Elevate Your Events
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight text-white mb-4 md:mb-6">
              Unforgettable <br className="hidden sm:block" />
              <span className="text-[#F4A300]">Catering</span>
            </h2>

            <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed mb-6 md:mb-8">
              From intimate boardroom lunches to grand gala dinners, we bring the
              artistry of French pastry to your table. Impress your guests with
              our signature croissants, artisanal bakes, and impeccable service.
            </p>

            <ul className="space-y-2 sm:space-y-3 mb-6 md:mb-8">
              {[
                "Customized Menus",
                "On-site Live Stations",
                "Halal Certified",
                "Professional Setup",
              ].map((item) => (
                <li 
                  key={item} 
                  className="flex items-center gap-2 sm:gap-3 text-white text-sm sm:text-base"
                >
                  <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#F4A300] flex items-center justify-center text-white text-xs sm:text-sm">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate("/order")}
                className="border border-white text-white px-6 sm:px-8 py-3 rounded-full hover:bg-white hover:text-[#1E3A8A] transition-all duration-300 font-medium text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Place An Order
              </button>
              <button 
                onClick={() => navigate("/find-us")}
                className="bg-[#F4A300] text-[#1E3A8A] px-6 sm:px-8 py-3 rounded-full hover:bg-[#ffb733] transition-all duration-300 font-medium text-sm sm:text-base w-full sm:w-auto text-center"
              >
                Contact for Quote
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <div className="relative pb-[100%] sm:pb-[90%] lg:pb-[80%] overflow-hidden rounded-3xl sm:rounded-[40px] shadow-2xl">
                <img
                  src="https://res.cloudinary.com/devf591xt/image/upload/v1767709746/menu/iv9m8tqz0ouin4jkp88v.png"
                  alt="Catering Cake"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Decorative elements for better visual appeal */}
              <div className="hidden sm:block absolute -bottom-4 -right-4 w-24 h-24 bg-[#F4A300]/20 rounded-full -z-10"></div>
              <div className="hidden sm:block absolute -top-4 -left-4 w-16 h-16 bg-white/10 rounded-full -z-10"></div>
            </div>
          </div>
        </div>

        {/* Additional responsive info section for larger screens */}
        <div className="hidden lg:grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/20">
          {[
            { label: "Year Experience", value: "7+" },
            { label: "Branches", value: "3+" },
            { label: "Positive Reviews", value: "100+" },
            { label: "Available Items", value: "50+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[#F4A300] font-serif text-2xl md:text-3xl font-bold">
                {stat.value}
              </p>
              <p className="text-white/80 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CateringSection;