import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
const TreatsSection = () => {
  const navigate = useNavigate();

  const treats = [
    {
      title: "Wedding",
      image: "/images/w1.png",
      pdf: "/pdfs/wedding.pdf", // ✅ PDF
      whatsapp:
        "https://wa.me/9191111712?text=Hi%20I%20want%20to%20enquire%20about%20wedding%20cakes",
    },

    {
      title: "Gifts",
      image: "/images/gift.png",
      link: "/menu/6979ca82bf183cc4e9a909c0",
    },

    {
      title: "Birthday",
      image:
        "https://pub-092239935ed64b7a853c7059e639a201.r2.dev/menu/03645a17219bb167bf48ab7d9376b35c.jpg",
      link: "/menu/69775854468616460bc2ef57",
    },

    {
      title: "Parties",
      image:
        "https://pub-092239935ed64b7a853c7059e639a201.r2.dev/menu/a485276907bc66749dcd42d00a784382.jpg",
      link: "/menu/69eb1eaf68a7dc668cf5f0ca",
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
              onClick={() => {
                if (item.pdf) {
                  window.open(item.pdf, "_blank");
                } else {
                  navigate(item.link || "/menu");
                }
              }}
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

              {/* ✅ WhatsApp Button INSIDE card */}

              {item.whatsapp && (
  <button
    onClick={(e) => {
      e.stopPropagation(); // 🔥 VERY IMPORTANT
      window.open(item.whatsapp, "_blank");
    }}
    className="mt-2 text-sm text-white/80 hover:text-green-400 transition flex items-center justify-center gap-1.5 cursor-pointer px-3 py-1.5 w-fit mx-auto"
  >
    <FaWhatsapp className="w-4 h-4" />
    <span>For enquiry</span>
  </button>
)}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatsSection;
