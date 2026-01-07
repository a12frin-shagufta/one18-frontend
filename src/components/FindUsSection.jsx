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
   map: "https://www.google.com/maps?q=Blk+826+Tampines+Street+81+Singapore&output=embed"

  },
  {
    id: 2,
    title: "North Bridge Rd",
    tag: "BUFFET & CAFE",
    address: [
      "757 North Bridge Rd",
      "Singapore 198725",
    ],
    phone: "+65 9876 5432",
    image: "/images/north.png",
    map: "https://www.google.com/maps?q=757+North+Bridge+Rd+Singapore&output=embed"

  },
];

const LocationPage = () => {
  const [activeId, setActiveId] = useState(locations[0].id);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">
          Our Locations
        </h1>
        <p className="text-gray-600">
          Visit one of our bakery locations and enjoy freshly baked goodness.
        </p>
      </div>

      {/* TOP ROW – IMAGES + ADDRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {locations.map((loc) => {
          const isActive = loc.id === activeId;

          return (
            <div
              key={loc.id}
              onClick={() => setActiveId(loc.id)}
              className={`cursor-pointer rounded-2xl overflow-hidden border transition-all duration-300 ${
                isActive
                  ? "border-blue-700 shadow-lg"
                  : "border-gray-300"
              }`}
            >
              {/* IMAGE */}
              <img
                src={loc.image}
                alt={loc.title}
                className={`w-full h-72 object-cover transition duration-300 ${
                  isActive ? "grayscale-0" : "grayscale"
                }`}
              />

              {/* INFO */}
              <div className="p-6 bg-white">
                <h3
                  className={`text-2xl font-serif mb-1 ${
                    isActive ? "text-blue-800" : "text-gray-500"
                  }`}
                >
                  {loc.title}
                </h3>

                <p className="text-sm font-semibold text-orange-500 tracking-wide mb-4">
                  {loc.tag}
                </p>

                <div className="text-gray-600 space-y-1">
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

      {/* BOTTOM – MAP */}
      <div className="mt-12">
        {locations.map(
          (loc) =>
            loc.id === activeId && (
              <div
                key={loc.id}
                className="w-full h-[420px] rounded-2xl overflow-hidden border"
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
