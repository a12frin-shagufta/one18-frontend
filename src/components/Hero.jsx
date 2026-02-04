import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full">
      <div className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden">

        {/* Desktop Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Mobile Video */}
        {/* Mobile Video */}
<video
  autoPlay
  loop
  muted
  playsInline
  preload="metadata"
  poster="/images/hero-fallback.jpg"
  className="block md:hidden absolute inset-0 w-full h-full object-cover"
>
  <source src="/videos/hero.mp4" type="video/mp4" />
</video>


        {/* Low light overlay */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Mobile button only */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 md:hidden z-10">
          <button
            onClick={() => navigate("/order")}
            className="px-6 py-3 rounded-sm bg-[#1E3A8A] text-white font-semibold text-sm shadow-lg active:scale-95 transition"
          >
            Order Now
          </button>
        </div>

      </div>
    </section>
  );
};

export default Hero;
