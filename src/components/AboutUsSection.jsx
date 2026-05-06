import React from "react";

const outlets = [
  {
    name: "One18 Bakery – North Bridge",
    address: "757 N Bridge Rd, Singapore 198725",
    image: "/images/o1.png",
    maps: "https://maps.google.com/?q=757+North+Bridge+Road+Singapore+198725",
  },
  {
    name: "One18 Bakery – Tampines 81",
    address: "826 Tampines St 81, #01-118, Singapore 520826",
    image: "/images/o2.png",
    maps: "https://maps.google.com/?q=826+Tampines+Street+81+%2301-118+Singapore+520826",
  },
  {
    name: "One18 Bakery – Tampines 23",
    address: "Tampines St 23, #01-64, Singapore 527201",
    image: "/images/o3.png",
    maps: "https://maps.google.com/?q=Tampines+Street+23+%2301-64+Singapore+527201",
  },
];

const AboutUs = () => {
  return (
    <section className="bg-white py-16 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* LEFT IMAGE */}
          <div>
            <img
              src="https://one18bakehouse.oddle.me/_next/image?url=https%3A%2F%2Fucarecdn.com%2F45c01e23-024f-4027-957b-9afa669c5973%2F&w=1200&q=75"
              alt="About One18 Bakery"
              className="w-full h-[260px] md:h-[380px] object-cover rounded-2xl"
            />
          </div>

          {/* RIGHT TEXT */}
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
              About One18 Bakery
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              At One18 Bakehouse, we're all about crafting delicious bakes using
              only the best ingredients. From buttery croissants and flaky
              pastries to custom creations and artisanal bread, there's
              something for every kind of sweet or savoury craving.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our team of passionate bakers and pastry chefs pour love into every
              bake, making sure everything not only looks good but tastes even
              better.
            </p>
            <p className="font-medium italic text-gray-800">
              100% Muslim Owned / Premium Ingredients / No Preservatives
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Visit our outlets today and treat yourself to something fresh from
              the oven — we can't wait to serve you!
            </p>
          </div>
        </div>

        {/* OUTLET CARDS */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
    {outlets.map((outlet, i) => (
  <a
    key={i}
    href={outlet.maps}
    target="_blank"
    rel="noopener noreferrer"
    className={[
      "group relative overflow-hidden rounded-2xl cursor-pointer block",
      i === 2 ? "col-span-2 md:col-span-1 h-[260px]" : "h-[220px]",
      "md:h-[300px]",
    ].join(" ")}
  >
              {/* Image */}
              <img
                src={outlet.image}
                alt={outlet.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Gradient overlay — always visible at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Text — always at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm md:text-base leading-tight">
                  {outlet.name}
                </p>
                <p className="text-white/80 text-xs mt-1 leading-snug">
                  {outlet.address}
                </p>
                {/* Maps CTA on hover */}
                <p className="text-white/0 group-hover:text-white/90 text-xs mt-2 transition-all duration-200 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Open in Google Maps
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutUs;