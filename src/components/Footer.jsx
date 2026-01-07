import React from "react";
import { ArrowUp, Instagram, Facebook, Mail } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#183A8F] text-white overflow-hidden">
      {/* 🌊 Wave Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-[120px]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C120,80 240,0 360,20 480,40 600,100 720,90 840,80 960,20 1080,10 1200,0 1320,40 1440,30 L1440,0 L0,0 Z"
            fill="#ffffff"
            opacity="0.12"
          />
        </svg>
      </div>

      {/* CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* LEFT */}
        <div>
          {/* LOGO */}
          <img
            src="/images/mobilelogo.png" // 🔥 put your logo in /public/logo.png
            alt="One18 Bakery"
            className="h-14 mb-4"
          />

          <p className="italic text-white/70 mb-4">
            Singapore’s Finest Artisan Bakery
          </p>

          <p className="text-white/80 max-w-md leading-relaxed">
            Crafting premium French pastries with authentic local flavors.
            Home of the viral Supreme Circular Croissants.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex gap-4 mt-6">
            {[Instagram, Facebook, Mail].map((Icon, i) => (
              <button
                key={i}
                className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center hover:bg-white hover:text-[#183A8F] transition"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <h3 className="text-2xl font-semibold mb-2">Stay Updated</h3>
          <p className="text-white/70 mb-5">
            Subscribe for exclusive offers and the latest updates
          </p>

          <div className="flex items-center bg-white/10 rounded-full overflow-hidden max-w-lg">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-transparent px-6 py-4 outline-none placeholder:text-white/60"
            />
            <button className="bg-[#F59E0B] text-white px-8 py-4 font-medium flex items-center gap-2 hover:bg-[#e18c07] transition">
              Subscribe →
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="relative z-10 border-t border-white/10 mt-10 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/60">
        <p>© 2026 One18 Bakery. Crafted with 💛 in Singapore</p>

        {/* BACK TO TOP */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-white font-medium hover:underline"
        >
          Back to Top
          <span className="w-9 h-9 bg-[#F59E0B] rounded-full flex items-center justify-center">
            <ArrowUp size={18} />
          </span>
        </button>
      </div>
    </footer>
  );
};

export default Footer;
