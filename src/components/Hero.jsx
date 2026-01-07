import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  // Desktop images
  const desktopImages = [
    "/images/2.png",
  ];

  // Mobile images (portrait – 1080x1920)
  const mobileImages = [
    "/images/mobilebg.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % desktopImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [desktopImages.length]);

  return (
    <section className="w-full">
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">

        {/* Desktop Image */}
        <img
          src={desktopImages[current]}
          alt="Bakery banner desktop"
          className="hidden md:block absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />

        {/* Mobile Image */}
        <img
          src={mobileImages[current]}
          alt="Bakery banner mobile"
          className="block md:hidden absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />

        {/* Light overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Mobile Order Now Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:hidden">
          <button
            onClick={() => navigate("/order")}
            className="px-6 py-3 rounded-full bg-amber-600 text-white font-semibold text-sm shadow-lg active:scale-95 transition"
          >
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
