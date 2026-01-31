import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFestivals, getMenu } from "../services/festivalApi";
import FestivalCard from "./FestivalCard";

const FestivalSection = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  const branchId = localStorage.getItem("selectedBranch");

useEffect(() => {
  const load = async () => {
    setLoading(true);
    try {
      const allFestivals = await getFestivals();
      const activeFestivals = allFestivals.filter(f => f.isActive);

      const data = await Promise.all(
        activeFestivals.map(async (festival) => {
          const products = await getMenu(festival._id); // ✅ ONLY festival

          return {
            ...festival,
            products: products.slice(0, 4),
          };
        })
      );

      setFestivals(data);
    } catch (err) {
      console.error("Error loading festivals:", err);
    } finally {
      setLoading(false);
    }
  };

  load();
}, []);



  if (loading) {
    return <div className="text-center py-12">Loading festivals...</div>;
  }

  if (!festivals.length) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {festivals.map(festival => (
        <section key={festival._id} className="py-10">

          <div className="text-center mb-10">
  <h2
    className="
      text-3xl md:text-5xl
      font-serif font-light
      text-gray-900
      tracking-wide
      leading-tight
    "
  >
    {festival.name}
  </h2>

  <p
    className="
      mt-3
      text-sm md:text-base
      text-gray-500
      tracking-wider
      uppercase
    "
  >
    Made By Premium Butter
  </p>
</div>


          {festival.products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {festival.products.map(p => (
                  <FestivalCard key={p._id} product={p} />
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Link
                  to={`/festival/${festival.slug}`}
                  className="px-8 py-3 bg-[#1E3A8A] text-white rounded-full"
                >
                  View All
                </Link>
              </div>
            </>
          ) : (
            !branchId && (
              <div className="text-center mt-6">
                <Link
                  to="/order"
                  className="text-sm text-[#1E3A8A] underline"
                >
                  Select a bakery to view products
                </Link>
              </div>
            )
          )}
        </section>
      ))}
    </div>
  );
};

export default FestivalSection;
