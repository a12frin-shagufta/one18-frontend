import React from "react";
import {
  FiCoffee,
  FiUsers,
  FiAward,
  FiSmile,
} from "react-icons/fi";

const highlights = [
  {
    icon: FiCoffee,
    title: "Fresh Ingredients",
  },
  {
    icon: FiUsers,
    title: "Expert Bakers",
  },
  {
    icon: FiAward,
    title: "Years of Experience",
  },
  {
    icon: FiSmile,
    title: "Delicious Food",
  },
];

const Highlights = () => {
  return (
    <section className="w-full bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {highlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex flex-col items-center gap-4">
                <Icon className="text-[#E06B3C]" size={40} />
                <h3 className="text-[#1E2A5A] font-serif text-xl md:text-2xl tracking-wide uppercase">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Highlights;
