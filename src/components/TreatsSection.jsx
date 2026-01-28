import { useNavigate } from "react-router-dom";

const TreatsSection = () => {
  const navigate = useNavigate();

  const treats = [
    {
      title: "Presents",
      image: "/images/button.jpg",
    },
    {
      title: "Birthday",
      image: "https://pub-092239935ed64b7a853c7059e639a201.r2.dev/menu/03645a17219bb167bf48ab7d9376b35c.jpg",
    },
    {
      title: "Wedding",
      image: "https://i.pinimg.com/1200x/82/59/f0/8259f05c19992e4c30d0240fa51dd10e.jpg",
    },
    {
      title: "Parties",
      image: "https://i.pinimg.com/1200x/61/03/6f/61036fb62c1f669ea75159294268f9b5.jpg",
    },
  ];

  return (
    <section className="bg-[#1E3A8A] py-20 mt-10">
      <div className="max-w-7xl mx-auto px-4 text-center text-white">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-serif mb-4">
          Treats for any Occasion
        </h2>

        {/* Subheading */}
        <p className="max-w-2xl mx-auto text-white/80 mb-8">
          We’ve got you covered for any holiday, special occasion, or reason to
          celebrate.
        </p>

        {/* View More */}
        <button
          onClick={() => navigate("/menu")}
          className="mb-14 inline-block text-sm font-semibold tracking-wide border-b border-white hover:opacity-80 transition"
        >
          VIEW MORE
        </button>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {treats.map((item, index) => (
            <div
              key={index}
              className="group cursor-pointer"
              onClick={() => navigate("/menu")}
            >
              <div className="overflow-hidden rounded-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <h3 className="mt-4 text-lg font-serif text-white">
                {item.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatsSection;
