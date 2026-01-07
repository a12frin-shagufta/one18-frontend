import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import MenuCard from "../components/MenuCard";
import { FiChevronDown, FiChevronUp, FiMenu, FiX } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { DELIVERY_FEE } from "../utils/currency";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";

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

  const [searchParams] = useSearchParams();
  const branchId =
    searchParams.get("branch") || localStorage.getItem("selectedBranch");

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

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
    if (categoryId) {
      setActiveCategory(categoryId);
      setActiveSubcategory("all");
    }
  }, [categoryId]);

  /* ======================
     CATEGORY STRUCTURE
  ====================== */
  const categoryStructure = useMemo(() => {
    const map = new Map();

    menu.forEach((item) => {
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
    return menu.filter((item) => {
      const catMatch =
        activeCategory === "all" || item.category?._id === activeCategory;
      const subMatch =
        activeSubcategory === "all" ||
        item.subcategory?._id === activeSubcategory;
      return catMatch && subMatch;
    });
  }, [menu, activeCategory, activeSubcategory]);


  const hasPreorderItems = useMemo(() => {
  return menu.some(item => item.preorder?.enabled);
}, [menu]);


  /* ======================
     TOTALS
  ====================== */
  const totalItems = useMemo(
    () =>
      Object.values(orders).reduce((sum, item) => sum + item.qty, 0),
    [orders]
  );

  const subtotal = useMemo(
    () =>
      Object.values(orders).reduce(
        (sum, item) => sum + Number(item.price) * Number(item.qty),
        0
      ),
    [orders]
  );

  const shipping = totalItems > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + shipping;

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
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setShowSidebar(true)}
        className="md:hidden fixed top-3 left-3 z-40 bg-white/90 backdrop-blur border p-2 rounded-md"
      >
        <FiMenu size={20} />
      </button>

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
          <button
            onClick={() => setShowSidebar(false)}
            className="md:hidden"
          >
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
      <div className="leading-tight">
        <h2 className="text-sm font-semibold text-gray-900">
          {branchInfo.name}
        </h2>
        <p className="text-xs text-gray-500">
          {branchInfo.address}
        </p>
      </div>
    </div>
  </div>
)}
{/* PREORDER NOTICE */}
{hasPreorderItems && (
  <div className="mx-3 md:mx-6 mb-4">
    <div className=" rounded-lg px-4 py-3 text-center">
      <p className="text-sm md:text-base  text-gray-800">
        Kindly place your orders at least{" "}
        <span className="font-semibold text-amber-700">2 days</span> in advance.🥐
      </p>
    </div>
  </div>
)}



        {/* HEADER */}
        {/* <div className="bg-white border-b px-4 py-3">
          <h1 className="text-lg font-semibold">
            {activeCategory === "all"
              ? "Menu"
              : categoryStructure.find((c) => c.id === activeCategory)?.name}
          </h1>
        </div> */}

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
