import { useEffect, useState } from "react";
import { getMenu } from "../services/festivalApi";
import FestivalCard from "../components/FestivalCard";
import { useSearchParams, useNavigate } from "react-router-dom";


const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);



  const [searchParams] = useSearchParams();
const navigate = useNavigate();

useEffect(() => {
  const load = async () => {
    try {
      const menu = await getMenu(branchId);
      const bestSellerProducts = menu.filter(p => p.isBestSeller);
      setProducts(bestSellerProducts);
    } catch (error) {
      console.error("Error loading best sellers:", error);
    } finally {
      setLoading(false);
      setReady(true);
    }
  };

  load();
}, []);



const branchId =
  searchParams.get("branch") ||
  localStorage.getItem("selectedBranch");



  useEffect(() => {
  if (!branchId) {
    navigate("/order");
  }
}, [branchId]);


useEffect(() => {
  if (!branchId) return;

  const load = async () => {
    setLoading(true);
    try {
      const menu = await getMenu(branchId);
      const bestSellerProducts = menu.filter(p => p.isBestSeller);
      setProducts(bestSellerProducts);
    } catch (error) {
      console.error("Error loading best sellers:", error);
    } finally {
      setLoading(false);
    }
  };

  load();
}, [branchId]);



  if (!ready) return null;


  if (!ready) return null;

if (loading) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="animate-pulse text-gray-400">
        Loading best sellers…
      </div>
    </div>
  );
}


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
      {/* Header - Matching festival page style */}
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3">
          Best Sellers
        </h1>
        <p className="text-gray-600 text-base md:text-lg max-w-3xl mx-auto">
          Discover our most popular and loved products
        </p>
        
        {/* Products Count */}
        <div className="mt-4 inline-block px-4 py-2 bg-gray-100 rounded-full">
          <span className="text-sm font-medium text-gray-700">
            {products.length} {products.length === 1 ? 'Product' : 'Products'}
          </span>
        </div>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map(p => (
            <FestivalCard key={p._id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No best seller products available.</p>
        </div>
      )}
    </div>
  );
};

export default BestSellers;