import React, { useEffect, useState } from "react";

const Hero = () => {
  const images = [
    // "/images/bg.png",
    "/images/2.png",
    // "https://res.cloudinary.com/devf591xt/image/upload/v1767510863/menu/gjfq8buz904gtcdkvxj2.png",
    // "https://res.cloudinary.com/devf591xt/image/upload/v1767539524/menu/fpeqooxzsjjs91mzjzpa.png",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full">
      <div className="relative w-full h-[45vh] md:h-[70vh] overflow-hidden">
        <img
          src={images[current]}
          alt="Bakery banner"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />

        {/* Optional overlay (very light, premium) */}
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </section>
  );
};

export default Hero;
