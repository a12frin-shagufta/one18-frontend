import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MenuCard from "../components/MenuCard";
import { FiChevronDown, FiChevronUp, FiMenu, FiX, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useParams } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import {
  getBestOfferForItem,
  calculateDiscountedPrice,
} from "../utils/applyOffer";
import FulfillmentModal from "../components/FulfillmentModal";

const Menu = () => {
  const { categoryId } = useParams();
  const [menu, setMenu] = useState([]);
  const { orders, setOrders } = useCart();
  const [activeCategory, setActiveCategory] = useState(categoryId || "all");
  const [activeSubcategory, setActiveSubcategory] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSidebar, setShowSidebar] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [offers, setOffers] = useState([]);
  const [showFulfillment, setShowFulfillment] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isMenuLoading, setIsMenuLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  /* ======================
     FETCH DATA
  ====================== */
  useEffect(() => {
    setIsMenuLoading(true);
    axios
      .get(`${BACKEND_URL}/api/menu`)
      .then((res) => setMenu(res.data))
      .catch(console.error)
      .finally(() => setIsMenuLoading(false));
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
     CALCULATE TOTALS
  ====================== */
  const cartTotalItems = useMemo(() => {
    return Object.values(orders).reduce((sum, item) => sum + item.qty, 0);
  }, [orders]);

  const cartTotalPrice = useMemo(() => {
    return Object.values(orders).reduce((sum, item) => sum + (item.price * item.qty), 0);
  }, [orders]);

  /* ======================
     APPLY OFFERS
  ====================== */
  const menuWithOffers = useMemo(() => {
    return menu.map((item) => {
      const bestOffer = getBestOfferForItem(item, offers);
      const updatedVariants = (item.variants || []).map((v) => {
        const originalPrice = v.price;
        const discountedPrice = bestOffer
  ? calculateDiscountedPrice(originalPrice, bestOffer)
  : null;

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

  /* ======================
     CATEGORY STRUCTURE
  ====================== */
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

    const CATEGORY_ORDER = [
  "bundles",
  "croissants",
  "breads",
  "dessert pastries",
  "slice cakes",
  "whole cakes",
  "festive",
  "festive cookies",
];


    const CROISSANT_SUB_ORDER = ["sweet", "savoury"];

    let categories = Array.from(map.values()).map((c) => {
      let subs = Array.from(c.subcategories, ([id, name]) => ({ id, name }));

      if (c.name.toLowerCase() === "croissants") {
  subs.sort((a, b) => {
    const normalize = (str = "") =>
      str.toLowerCase().replace(/\s+/g, " ").trim();

    const order = ["sweet", "savoury"];

    const aName = normalize(a.name);
    const bName = normalize(b.name);

    const aIndex = order.findIndex(k => aName.includes(k));
    const bIndex = order.findIndex(k => bName.includes(k));

    if (aIndex === -1 && bIndex === -1) return aName.localeCompare(bName);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;

    return aIndex - bIndex;
  });
}

      return {
        ...c,
        subcategories: subs,
      };
    });

    categories.sort((a, b) => {
      const aIndex = CATEGORY_ORDER.indexOf(a.name.toLowerCase());
      const bIndex = CATEGORY_ORDER.indexOf(b.name.toLowerCase());
      if (aIndex === -1 && bIndex === -1) return a.name.localeCompare(b.name);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });

    return [
      { id: "all", name: "All", subcategories: [] },
      ...categories,
    ];
  }, [menuWithOffers]);


  useEffect(() => {
  const open = () => setShowFulfillment(true);
  const edit = () => setShowFulfillment(true);

  window.addEventListener("open-fulfillment", open);
  window.addEventListener("edit-fulfillment", edit);

  return () => {
    window.removeEventListener("open-fulfillment", open);
    window.removeEventListener("edit-fulfillment", edit);
  };
}, []);


  /* ======================
     FILTER MENU
  ====================== */
  const filteredMenu = useMemo(() => {
  const result = menuWithOffers.filter((item) => {
    const catMatch =
      activeCategory === "all" || item.category?._id === activeCategory;

    const subMatch =
      activeSubcategory === "all" ||
      item.subcategory?._id === activeSubcategory;

    return catMatch && subMatch;
  });

  return result.sort((a, b) => {
    // 🥐 CROISSANTS: Sweet → Savoury → Plain
    if (a.category?.name?.toLowerCase() === "croissants") {
      const normalize = (str = "") =>
        str.toLowerCase().replace(/\s+/g, " ").trim();

      const order = ["sweet", "savoury", "plain"];

      const aSub = normalize(a.subcategory?.name || "plain");
      const bSub = normalize(b.subcategory?.name || "plain");

      const aIndex = order.findIndex((k) => aSub.includes(k));
      const bIndex = order.findIndex((k) => bSub.includes(k));

      if (aIndex !== bIndex) {
        return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      }
    }

    // ⭐ Best sellers AFTER croissant grouping
    if (a.isBestSeller !== b.isBestSeller) {
      return a.isBestSeller ? -1 : 1;
    }

    // 🕒 Default: newest first
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
}, [menuWithOffers, activeCategory, activeSubcategory]);



  /* ======================
     HANDLERS
  ====================== */
  const handleCategoryClick = (id) => {
    setIsFiltering(true);
    setActiveCategory(id);
    setActiveSubcategory("all");

    if (id !== "all") {
      setExpandedCategories((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }

    if (window.innerWidth < 768) setShowSidebar(false);
    setTimeout(() => setIsFiltering(false), 200);
  };

  const handleSubcategoryClick = (id) => {
    setIsFiltering(true);
    setActiveSubcategory(id);
    if (window.innerWidth < 768) setShowSidebar(false);
    setTimeout(() => setIsFiltering(false), 200);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* MOBILE TOP BAR */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between md:hidden">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 rounded-lg bg-gray-100 active:bg-gray-200"
        >
          <FiMenu size={20} className="text-gray-700" />
        </button>
        
        <div className="flex-1 text-center">
          <h1 className="font-bold text-gray-900 text-sm">Menu</h1>
          {filteredMenu.length > 0 && (
            <p className="text-xs text-gray-500">{filteredMenu.length} items</p>
          )}
        </div>

        {/* CART BUTTON */}
        <button
          onClick={() => setShowFulfillment(true)}
          className="relative p-2"
          aria-label="View cart"
        >
          <FiShoppingCart size={22} className="text-gray-700" />
          {cartTotalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartTotalItems}
            </span>
          )}
        </button>
      </div>

      {/* SIDEBAR OVERLAY */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      <div className="flex">
        {/* SIDEBAR */}
        <aside
          className={`fixed md:sticky md:top-0 z-40 h-screen md:h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-out
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:block`}
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Menu Categories</h2>
            <button 
              onClick={() => setShowSidebar(false)} 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="p-3 overflow-y-auto h-[calc(100%-80px)]">
            {categoryStructure.map((cat) => (
              <div key={cat.id} className="mb-1">
                <button
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`w-full flex justify-between items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${activeCategory === cat.id
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <span className="truncate capitalize">{cat.name}</span>
                  {cat.subcategories.length > 0 && (
                    expandedCategories[cat.id] ? (
                      <FiChevronUp size={16} className="flex-shrink-0" />
                    ) : (
                      <FiChevronDown size={16} className="flex-shrink-0" />
                    )
                  )}
                </button>

                {cat.id !== "all" &&
                  expandedCategories[cat.id] &&
                  cat.subcategories.length > 0 && (
                    <div className="ml-4 mt-1 space-y-1 border-l border-gray-100 pl-2">
                      {cat.subcategories.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubcategoryClick(sub.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                            ${activeSubcategory === sub.id
                              ? "bg-gray-100 text-gray-900 font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                            }`}
                        >
                         <span className="capitalize">{sub.name}</span>

                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto md:pl-0">
          {/* DESKTOP HEADER */}
          <div className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Our Menu</h1>
              <p className="text-sm text-gray-500">
                {filteredMenu.length} {filteredMenu.length === 1 ? 'item' : 'items'} available
              </p>
            </div>
            
            {/* DESKTOP CART BUTTON */}
            {/* {cartTotalItems > 0 && (
              <button
                onClick={() => setShowFulfillment(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <FiShoppingCart size={18} />
                <span className="font-semibold">View Cart</span>
                <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-sm font-bold">
                  {cartTotalItems}
                </span>
                <span className="font-bold">S${cartTotalPrice.toFixed(2)}</span>
              </button>
            )} */}
          </div>

          {/* MENU GRID */}
          <div className="p-3 md:p-4 lg:p-6">
            {isMenuLoading || isFiltering ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg aspect-[3/4] mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : filteredMenu.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🍰</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                <p className="text-gray-500 text-sm">
                  Try selecting a different category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                {filteredMenu.map((item) => (
                  <MenuCard
                    key={item._id}
                    item={item}
                    orders={orders}
                    setOrders={setOrders}
                    openCart={() => setShowFulfillment(true)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* CART DRAWER */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />

      {/* FULFILLMENT MODAL */}
     <FulfillmentModal
  open={showFulfillment}
  onClose={() => setShowFulfillment(false)}
  redirectToCheckout
/>

    </div>
  );
};

export default Menu;