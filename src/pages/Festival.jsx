import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFestivals, getMenu } from "../services/festivalApi";
import FestivalCard from "../components/FestivalCard";

const Festival = () => {
  const { slug } = useParams();

  const [festival, setFestival] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const branchId = localStorage.getItem("selectedBranch");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const festivals = await getFestivals();
        const f = festivals.find((x) => x.slug === slug);

        if (!f) {
          setFestival(null);
          setProducts([]);
          return;
        }

        setFestival(f);

        // ✅ NO branch, same as best seller
        const items = await getMenu(f._id);
        setProducts(items);
      } catch (err) {
        console.error("Error loading festival:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug]);

  if (loading) {
    return <div className="py-20 text-center">Loading festival...</div>;
  }

  if (!festival) {
    return <div className="py-20 text-center">Festival not found</div>;
  }

  return (
    <>
      {/* ✅ FULL WIDTH BANNER */}
      {/* <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <img
          src={festival.bannerImage}
          alt={festival.name}
          className="w-full h-[350px] md:h-[400px] object-cover"
        />
      </div> */}

      {/* ✅ NORMAL PAGE CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Info */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif text-[#1E3A8A] mb-3">
            {festival.name}
          </h1>
          {festival.description && (
            <p className="text-gray-600 max-w-3xl mx-auto">
              {festival.description}
            </p>
          )}
        </div>
        {/* 🎁 Gift Set Highlight */}
{/* 🎁 Upgraded Premium Banner */}
<div className="mt-8 mb-16 px-2">
  <div className="relative max-w-8xl mx-auto overflow-hidden rounded-[2rem] bg-[#1a1a1a] shadow-2xl group">
    
    {/* Subtle Gradient Overlay - darker on the left for text readability */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent z-10" />

    <img
      src="/images/giftset.jpg" 
      alt="Festive Gift Set"
      className="w-full h-[300px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-1000"
    />

    {/* Content Layer */}
    <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16">
      <div className="max-w-md">
        <span className="inline-block px-4 py-1 mb-4 text-[10px] font-bold tracking-[0.2em] text-white uppercase bg-blue-600/80 backdrop-blur-md rounded-full">
          Curated Collection
        </span>
        
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-4 leading-tight">
          The Festive <br /> 
          <span className="italic font-light text-blue-100">Gift Set</span>
        </h2>
        
        <div className="h-1 w-12 bg-blue-500 mb-6"></div> {/* Decorative accent */}

        <p className="text-gray-200 text-sm md:text-lg mb-0 leading-relaxed font-light">
          "Made To Share, Meant To Enjoy"
        </p>
        {/* <p className="text-gray-400 text-xs md:text-sm mt-1 tracking-wide uppercase">
          Handcrafted for all occasions
        </p> */}
      </div>
    </div>

    {/* Floating Badge (Visual Interest) */}
    <div className="absolute bottom-8 right-8 z-20 hidden md:block">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-6 rounded-full w-32 h-32 flex flex-col items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-500">
        <span className="text-white text-[10px] uppercase tracking-widest">Premium</span>
        <span className="text-white font-serif text-xl">Quality</span>
      </div>
    </div>
  </div>
</div>

        {/* Products */}
        {products.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p) => (
              <FestivalCard key={p._id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            No products for this festival
          </div>
        )}
      </div>
    </>
  );
};

export default Festival;
