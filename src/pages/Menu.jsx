import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MenuCard from "../components/MenuCard";
import { FiChevronDown, FiChevronUp, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useParams, useSearchParams } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
  import {
  getBestOfferForItem,
  calculateDiscountedPrice,
} from "../utils/applyOffer";


const Menu = () => {
  const { categoryId } = useParams();
  const [menu, setMenu] = useState([]);
  const { orders, setOrders } = useCart();
  const [activeCategory, setActiveCategory] = useState(categoryId || "all");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [branchInfo, setBranchInfo] = useState(null);
  const [offers, setOffers] = useState([]);


  const [searchParams] = useSearchParams();
  const branchId =
    searchParams.get("branch") || localStorage.getItem("selectedBranch");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /* ======================
     FETCH MENU
  ====================== */
  useEffect(() => {
    if (!branchId) return;

    axios
      .get(`${BACKEND_URL}/api/menu`, { params: { branch: branchId } })
      .then((res) => setMenu(res.data))
      .catch(console.error);
  }, [branchId]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedBranchData");
    if (stored) setBranchInfo(JSON.parse(stored));
  }, []);

  useEffect(() => {
  axios
    .get(`${BACKEND_URL}/api/offers`)
    .then((res) => setOffers(res.data || []))
    .catch(console.error);
}, []);


  useEffect(() => {
    if (categoryId) {
      setActiveCategory(categoryId);
      setActiveSubcategory("all");
    }
  }, [categoryId]);

  /* ======================
     CATEGORY STRUCTURE
  ====================== */


const menuWithOffers = useMemo(() => {
  return menu.map((item) => {
    const bestOffer = getBestOfferForItem(item, offers);

    // ✅ your item has variants, so each variant must be discounted
    const updatedVariants = (item.variants || []).map((v) => {
      const originalPrice = v.price;
      const discountedPrice = calculateDiscountedPrice(originalPrice, bestOffer);

      return {
        ...v,
        originalPrice,
        discountedPrice,
      };
    });

    return {
      ...item,
      offer: bestOffer || null,
      variants: updatedVariants,
    };
  });
}, [menu, offers]);

  const categoryStructure = useMemo(() => {
    const map = new Map();

    menuWithOffers.forEach((item) => {
      if (!item.category) return;

      const cid = item.category._id;
      if (!map.has(cid)) {
        map.set(cid, {
          id: cid,
          name: item.category.name,
          subcategories: new Map(),
        });
      }

      if (item.subcategory) {
        map.get(cid).subcategories.set(
          item.subcategory._id,
          item.subcategory.name
        );
      }
    });

    return [
      { id: "all", name: "All", subcategories: [] },
      ...Array.from(map.values()).map((c) => ({
        ...c,
        subcategories: Array.from(c.subcategories, ([id, name]) => ({
          id,
          name,
        })),
      })),
    ];
  }, [menu]);




  


  /* ======================
     FILTER MENU
  ====================== */
 const filteredMenu = useMemo(() => {
  return menuWithOffers.filter((item) => {
    const catMatch =
      activeCategory === "all" || item.category?._id === activeCategory;
    const subMatch =
      activeSubcategory === "all" ||
      item.subcategory?._id === activeSubcategory;
    return catMatch && subMatch;
  });
}, [menuWithOffers, activeCategory, activeSubcategory]);


  /* ======================
     HANDLERS
  ====================== */
  const handleCategoryClick = (id) => {
    setActiveCategory(id);
    setActiveSubcategory("all");

    if (id !== "all") {
      setExpandedCategories((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }

    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const handleSubcategoryClick = (id) => {
    setActiveSubcategory(id);
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed md:relative z-40 h-full w-64 bg-white border-r
        transform transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">one18bakery</h2>
          <button onClick={() => setShowSidebar(false)} className="md:hidden">
            <FiX size={22} />
          </button>
        </div>

        <div className="p-3 overflow-y-auto h-full">
          {categoryStructure.map((cat) => (
            <div key={cat.id} className="mb-1">
              <button
                onClick={() => handleCategoryClick(cat.id)}
                className={`w-full flex justify-between items-center px-3 py-2.5 rounded-md text-sm
                  ${
                    activeCategory === cat.id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {cat.name}
                {cat.subcategories.length > 0 &&
                  (expandedCategories[cat.id] ? (
                    <FiChevronUp size={14} />
                  ) : (
                    <FiChevronDown size={14} />
                  ))}
              </button>

              {cat.id !== "all" &&
                expandedCategories[cat.id] &&
                cat.subcategories.length > 0 && (
                  <div className="ml-3 mt-1 space-y-1">
                    <button
                      onClick={() => handleSubcategoryClick("all")}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm
                        ${
                          activeSubcategory === "all"
                            ? "bg-gray-100 font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                      All {cat.name}
                    </button>

                    {cat.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubcategoryClick(sub.id)}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm
                          ${
                            activeSubcategory === sub.id
                              ? "bg-gray-100 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                      >
                        {sub.name}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* MOBILE TOP BAR */}
        <div className="md:hidden bg-white px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setShowSidebar(true)}
            className="bg-gray-100 p-2 rounded-md"
          >
            <FiMenu size={20} />
          </button>
          <span className="font-semibold text-gray-900 text-sm">Menu</span>
        </div>

        {/* BRANCH INFO */}
        {branchInfo && (
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              {branchInfo.image && (
                <img
                  src={branchInfo.image}
                  alt={branchInfo.name}
                  className="w-10 h-10 rounded-md object-cover"
                />
              )}
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {branchInfo.name}
                </h2>
                <p className="text-xs text-gray-500">{branchInfo.address}</p>
              </div>
            </div>
          </div>
        )}

        {/* MENU GRID */}
        <div className="p-3 md:p-6">
          {filteredMenu.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-sm">
              No items available
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {filteredMenu.map((item) => (
                <MenuCard
                  key={item._id}
                  item={item}
                  orders={orders}
                  setOrders={setOrders}
                  openCart={() => setIsCartOpen(true)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CART */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default Menu;
