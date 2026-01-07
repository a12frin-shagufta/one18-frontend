import React, { useState } from "react";

const locations = [
  {
    id: 1,
    title: "Tampines St 81",
    tag: "THE ORIGINAL",
    address: [
      "Blk 826 Tampines Street 81",
      "#01-118",
      "Singapore 520826",
    ],
    phone: "+65 1234 5678",
    image: "/images/tampines.png",
    map: "https://www.google.com/maps?q=Blk+826+Tampines+Street+81+Singapore&output=embed",
  },
  {
    id: 2,
    title: "North Bridge Rd",
    tag: "BUFFET & CAFE",
    address: ["757 North Bridge Rd", "Singapore 198725"],
    phone: "+65 9876 5432",
    image: "/images/north.png",
    map: "https://www.google.com/maps?q=757+North+Bridge+Rd+Singapore&output=embed",
  },
];

const LocationPage = () => {
  const [activeId, setActiveId] = useState(locations[0].id);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-5xl font-serif text-gray-900 mb-3">
          Our Locations
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Visit one of our bakery locations and enjoy freshly baked goodness.
        </p>
      </div>

      {/* LOCATION CARDS */}
      <div
        className="
          flex md:grid
          md:grid-cols-2
          gap-6 md:gap-8
          overflow-x-auto md:overflow-visible
          snap-x snap-mandatory
          no-scrollbar
          px-1
        "
      >
        {locations.map((loc) => {
          const isActive = loc.id === activeId;

          return (
            <div
              key={loc.id}
              onClick={() => setActiveId(loc.id)}
              className={`
                snap-center
                min-w-[85%] md:min-w-0
                cursor-pointer
                rounded-2xl overflow-hidden
                border transition-all duration-300
                ${
                  isActive
                    ? "border-blue-700 shadow-lg"
                    : "border-gray-300"
                }
              `}
            >
              {/* IMAGE */}
              <img
                src={loc.image}
                alt={loc.title}
                className={`
                  w-full h-56 md:h-72 object-cover
                  transition duration-300
                  ${isActive ? "grayscale-0" : "grayscale"}
                `}
              />

              {/* INFO */}
              <div className="p-5 md:p-6 bg-white">
                <h3
                  className={`text-xl md:text-2xl font-serif mb-1 ${
                    isActive ? "text-blue-800" : "text-gray-500"
                  }`}
                >
                  {loc.title}
                </h3>

                <p className="text-xs md:text-sm font-semibold text-orange-500 tracking-wide mb-3">
                  {loc.tag}
                </p>

                <div className="text-gray-600 text-sm space-y-1">
                  {loc.address.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                  <p className="mt-2 font-medium">{loc.phone}</p>
                </div>

                <p className="mt-4 text-sm font-semibold underline">
                  View on Map →
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* MOBILE HINT */}
      <p className="md:hidden text-center text-xs text-gray-400 mt-4">
        ← Swipe to see more locations →
      </p>

      {/* MAP */}
      <div className="mt-10">
        {locations.map(
          (loc) =>
            loc.id === activeId && (
              <div
                key={loc.id}
                className="w-full h-[360px] md:h-[420px] rounded-2xl overflow-hidden border"
              >
                <iframe
                  src={loc.map}
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            )
        )}
      </div>
    </section>
  );
};

export default LocationPage;
