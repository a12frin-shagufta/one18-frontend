import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-gradient-to-r from-white to-amber-50">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT — TEXT CONTENT */}
        <div>

          <span className="inline-block bg-[#1E3A8A] text-white text-xs px-4 py-1 rounded-full mb-6 tracking-wide">
            SINGAPORE'S FINEST · MUSLIM OWNED
          </span>

          <h1 className="text-4xl md:text-6xl font-serif text-blue-900 leading-tight">
            Singapore's <br />
            Finest Artisan <br />
            Bakery
          </h1>

          <p className="mt-6 text-gray-600 max-w-xl text-lg">
            Where <span className="italic text-[#1E3A8A]">European mastery</span>{" "}
            meets <span className="italic text-[#1E3A8A]">Asian flavors</span>.
            Every pastry is a work of art, baked fresh throughout the day
            using only the finest imported ingredients.
          </p>

          {/* Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => navigate("/menu")}
              className="px-7 py-3 bg-[#1E3A8A] text-white rounded-lg font-semibold shadow hover:scale-105 transition"
            >
              Explore Menu
            </button>

            <button
              onClick={() => navigate("/find-us")}
              className="px-7 py-3 border border-blue-800 text-blue-800 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              Find Us
            </button>
          </div>
        </div>

        {/* RIGHT — VIDEO */}
        <div className="relative">

          <div className="rounded-3xl overflow-hidden shadow-2xl bg-white p-3">

            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/images/hero-fallback.jpg"
              className="w-full h-[420px] object-cover rounded-2xl"
            >
              <source
                src="https://res.cloudinary.com/dbbvqqbz1/video/upload/f_auto,q_auto/v1770190891/IMG_6242_1_fb3swp.mp4"
                type="video/mp4"
              />
            </video>

          </div>

        </div>

      </div>

      {/* STATS BAR */}
      <div className="max-w-5xl mx-auto mt-6 bg-white shadow-xl rounded-2xl p-6 grid grid-cols-2 md:grid-cols-4 text-center gap-4">

        <div>
          <p className="text-blue-900 text-xl font-bold">50K+</p>
          <p className="text-gray-500 text-sm">Happy Customers</p>
        </div>

        <div>
          <p className="text-blue-900 text-xl font-bold">100+</p>
          <p className="text-gray-500 text-sm">Daily Items</p>
        </div>

        <div>
          <p className="text-blue-900 text-xl font-bold">4.9★</p>
          <p className="text-gray-500 text-sm">Google Rating</p>
        </div>

        <div>
          <p className="text-blue-900 text-xl font-bold">2</p>
          <p className="text-gray-500 text-sm">Locations</p>
        </div>

      </div>
    </section>
  );
};

export default Hero;
