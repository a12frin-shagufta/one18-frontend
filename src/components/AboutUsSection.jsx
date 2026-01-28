import React from "react";

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
              At One18 Bakehouse, we’re all about crafting delicious bakes using
              only the best ingredients. From buttery croissants and flaky
              pastries to custom creations and artisanal bread, there’s
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
              the oven — we can’t wait to serve you!
            </p>
          </div>
        </div>

        {/* BOTTOM IMAGES */}
       {/* BOTTOM IMAGES */}
{/* BOTTOM IMAGES */}
{/* BOTTOM IMAGES */}
<div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">

  {/* Image 1 */}
  <div className="group relative h-[220px] md:h-[300px] overflow-hidden rounded-2xl">
    <img
      src="/images/o1.png"
      alt="North Bridge"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
      <span className="text-white text-lg font-medium">
        One18 Bakery – North Bridge
      </span>
    </div>
  </div>

  {/* Image 2 */}
  <div className="group relative h-[220px] md:h-[300px] overflow-hidden rounded-2xl">
    <img
      src="/images/o2.png"
      alt="Tampines"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
      <span className="text-white text-lg font-medium">
        One18 Bakery – Tampines
      </span>
    </div>
  </div>

  {/* Image 3 */}
  <div className="group relative col-span-2 md:col-span-1 h-[260px] md:h-[300px] overflow-hidden rounded-2xl">
    <img
      src="https://pub-092239935ed64b7a853c7059e639a201.r2.dev/menu/e0c3d0101d44992a9971baa72f6192f2.jpg"
      alt="Pre Orders"
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    />

    {/* Overlay */}
    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
      <span className="text-white text-lg font-medium">
        One18 Bakery – Pre Orders
      </span>
    </div>
  </div>

</div>




      </div>
    </section>
  );
};

export default AboutUs;
