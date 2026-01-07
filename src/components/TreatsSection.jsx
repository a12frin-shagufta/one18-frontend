import { useNavigate } from "react-router-dom";

const TreatsSection = () => {
  const navigate = useNavigate();

  const treats = [
    {
      title: "Presents",
      image: "https://i.pinimg.com/736x/fd/91/fc/fd91fc8376b9f51ffae533ee91739e72.jpg",
    },
    {
      title: "Birthday",
      image: "https://i.pinimg.com/736x/4c/88/63/4c886333d1bbbe14e57b7408e657a5fb.jpg",
    },
    {
      title: "Wedding",
      image: "https://i.pinimg.com/736x/8f/af/89/8faf89d5a9f5f1f6bd88e6a4942f2103.jpg",
    },
    {
      title: "Parties",
      image: "https://i.pinimg.com/736x/d7/64/a9/d764a9920fe094fbbd76febbfc9aa9fd.jpg",
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
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
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
