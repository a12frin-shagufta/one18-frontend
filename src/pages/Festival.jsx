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
      const f = festivals.find(x => x.slug === slug);

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
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <img
          src={festival.bannerImage}
          alt={festival.name}
          className="w-full h-[350px] md:h-[400px] object-cover"
        />
      </div>

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

        {/* Products */}
        {products.length ? (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
    {products.map(p => (
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
