import { useParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { FiPlus, FiMinus, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { formatPrice } from "../utils/currency";
import FulfillmentModal from "../components/FulfillmentModal";


import {
  getBestOfferForItem,
  calculateDiscountedPrice,
} from "../utils/applyOffer";

const ProductDetail = () => {
  const { slug } = useParams();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { setOrders } = useCart();

  const [product, setProduct] = useState(null);
  const [offers, setOffers] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);
  // const [isCartOpen, setIsCartOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showFulfillment, setShowFulfillment] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState({});
  const [cakeMessage, setCakeMessage] = useState("");

  /* ======================
     FETCH PRODUCT
  ====================== */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKEND_URL}/api/menu/slug/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  /* ======================
     FETCH OFFERS
  ====================== */
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/offers`)
      .then((res) => setOffers(res.data || []))
      .catch(console.error);
  }, []);

  /* ======================
     APPLY OFFERS
  ====================== */
  const productWithOffer = useMemo(() => {
    if (!product) return null;

    const bestOffer = getBestOfferForItem(product, offers);

    const variants = (product.variants || []).map((v) => ({
      ...v,
      originalPrice: v.price,
      discountedPrice: calculateDiscountedPrice(v.price, bestOffer),
    }));

    return {
      ...product,
      variants,
      offer: bestOffer || null,
    };
  }, [product, offers]);

  /* ======================
     DEFAULT VARIANT
  ====================== */
  useEffect(() => {
    if (productWithOffer?.variants?.length) {
      setSelectedVariant(productWithOffer.variants[0]);
    }
  }, [productWithOffer]);

  /* ======================
     BASE PRICE ("From")
  ====================== */
  const basePrice = useMemo(() => {
    if (!productWithOffer?.variants?.length) return 0;
    return Math.min(
      ...productWithOffer.variants.map((v) => v.discountedPrice ?? v.price),
    );
  }, [productWithOffer]);

  // Single-select (radio) — price mode only
  const handleSingleAddOn = (groupName, option) => {
    setSelectedAddOns((prev) => ({
      ...prev,
      [groupName]: option, // { label, price }
    }));
  };

  // Multi-select (checkbox) — price mode only, respects maxSelect (max # of options)
  const handleMultiAddOn = (group, option, checked) => {
    setSelectedAddOns((prev) => {
      const existing = prev[group.groupName] || {};

      if (checked) {
        const currentCount = Object.keys(existing).length;
        if (group.maxSelect && currentCount >= Number(group.maxSelect)) {
          alert(`You can only select up to ${group.maxSelect} options for "${group.groupName}"`);
          return prev;
        }
        return {
          ...prev,
          [group.groupName]: { ...existing, [option.label]: option },
        };
      } else {
        const updated = { ...existing };
        delete updated[option.label];
        return { ...prev, [group.groupName]: updated };
      }
    });
  };

  // Quantity mode — increment/decrement a specific option, respects maxSelect (max total quantity)
  const getGroupQuantityTotal = (groupName) => {
    const groupVal = selectedAddOns[groupName] || {};
    return Object.values(groupVal).reduce(
      (sum, v) => sum + (typeof v === "number" ? v : 0),
      0,
    );
  };

  const handleQuantityAddOn = (group, option, delta) => {
    setSelectedAddOns((prev) => {
      const existing = prev[group.groupName] || {};
      const currentQty = existing[option.label] || 0;
      const groupTotal = Object.values(existing).reduce(
        (sum, v) => sum + (typeof v === "number" ? v : 0),
        0,
      );

      const nextQty = Math.max(0, currentQty + delta);

      // Block increasing past the group's max total quantity
      if (
        delta > 0 &&
        group.maxSelect &&
        groupTotal + delta > Number(group.maxSelect)
      ) {
        return prev;
      }

      const updated = { ...existing, [option.label]: nextQty };
      return { ...prev, [group.groupName]: updated };
    });
  };

  const addOnsTotal = useMemo(() => {
    let total = 0;
    (product?.addOns || []).forEach((group) => {
      const val = selectedAddOns[group.groupName];
      if (!val) return;

      if (group.mode === "quantity") {
        // sum of (option price * quantity) — usually price is 0 for pure quantity pickers
        Object.entries(val).forEach(([label, qty]) => {
          const opt = group.options.find((o) => o.label === label);
          if (opt) total += (Number(opt.price) || 0) * (Number(qty) || 0);
        });
      } else if (typeof val === "object" && "price" in val) {
        // single-select
        total += Number(val.price) || 0;
      } else if (typeof val === "object") {
        // multi-select
        Object.values(val).forEach((opt) => {
          total += Number(opt.price) || 0;
        });
      }
    });
    return total;
  }, [selectedAddOns, product]);

  /* ======================
     ADD TO CART
  ====================== */
const addToCart = () => {
  console.log("🟢 ADD TO CART CLICKED");

  if (!selectedVariant) {
    console.log("❌ No variant selected");
    return;
  }

  console.log("✅ Variant:", selectedVariant);

  // Validate required add-ons
  const requiredGroups = (product.addOns || []).filter((g) => g.required);
  for (const group of requiredGroups) {
    if (group.mode === "quantity") {
      const total = getGroupQuantityTotal(group.groupName);
      if (total <= 0) {
        alert(`Please select at least one option for "${group.groupName}"`);
        return;
      }
      if (group.maxSelect && total !== Number(group.maxSelect)) {
        alert(
          `Please select exactly ${group.maxSelect} for "${group.groupName}" (currently ${total})`,
        );
        return;
      }
      continue;
    }

    const picked = selectedAddOns[group.groupName];
    const hasPick =
      picked &&
      (typeof picked.label === "string" || Object.keys(picked).length > 0);

    if (!hasPick) {
      console.log("❌ Missing required add-on:", group.groupName);
      alert(`Please select an option for "${group.groupName}"`);
      return;
    }
  }

  const key = `${product._id}_${selectedVariant.label}`;
  console.log("🔑 KEY:", key);

  const itemBasePrice =
    selectedVariant.discountedPrice ?? selectedVariant.price;

  // Build add-ons
  const chosenAddOns = [];
  (product.addOns || []).forEach((group) => {
    const val = selectedAddOns[group.groupName];
    if (!val) return;

    if (group.mode === "quantity") {
      Object.entries(val).forEach(([label, qtyVal]) => {
        if (Number(qtyVal) > 0) {
          const opt = group.options.find((o) => o.label === label);
          chosenAddOns.push({
            groupName: group.groupName,
            label,
            price: Number(opt?.price) || 0,
            quantity: Number(qtyVal),
          });
        }
      });
    } else if (typeof val === "object" && "label" in val) {
      chosenAddOns.push({
        groupName: group.groupName,
        label: val.label,
        price: Number(val.price) || 0,
      });
    } else if (typeof val === "object") {
      Object.values(val).forEach((opt) => {
        chosenAddOns.push({
          groupName: group.groupName,
          label: opt.label,
          price: Number(opt.price) || 0,
        });
      });
    }
  });

  console.log("🧩 AddOns:", chosenAddOns);

  const newItem = {
    itemId: product._id,
    name: product.name,
    variant: selectedVariant.label,
    price: itemBasePrice + addOnsTotal,
    qty,
    image: product.images?.[0],
    category: product.category,
    festival: product.festival ?? null,
    addOns: chosenAddOns,
    cakeMessage: cakeMessage.trim(),
  };

  console.log("📦 NEW ITEM:", newItem);

  // BEFORE SAVE
  console.log("📂 BEFORE:", localStorage.getItem("cart"));

  const current = JSON.parse(localStorage.getItem("cart") || "{}");
  current[key] = newItem;

  localStorage.setItem("cart", JSON.stringify(current));

  // AFTER SAVE
  console.log("📂 AFTER:", localStorage.getItem("cart"));

  // React state
  setOrders((prev) => {
    const updated = { ...prev, [key]: newItem };
    console.log("⚡ STATE UPDATED:", updated);
    return updated;
  });

  const fulfillment = localStorage.getItem("fulfillmentData");
if (!fulfillment) {
  setShowFulfillment(true);
} else {
  window.dispatchEvent(new Event("open-cart")); // ← opens CartDrawer
}
};
  /* ======================
     LOADING STATE
  ====================== */
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 animate-pulse">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="h-[420px] bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        {/* ================= LEFT IMAGES ================= */}
        <div>
          <img
            src={product.images?.[activeImage]}
            alt={product.name}
            className="w-full h-[420px] md:h-[520px] object-cover rounded-xl"
          />

          {product.images?.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border ${
                    activeImage === i
                      ? "border-[#1E3A8A] ring-2 ring-[#1E3A8A]"
                      : "border-gray-200"
                  }`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT DETAILS ================= */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>

          <p className="text-lg text-[#1E3A8A] font-semibold mb-4">
            From {formatPrice(basePrice)}
          </p>
          {product.isPromoEligible && (
            <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="text-sm font-bold text-green-800">
                  Buy 4 Get 1 Free!
                </p>
                <p className="text-xs text-green-600">
                  Add 4 eligible items to your cart and choose 1 for free
                </p>
              </div>
            </div>
          )}

          <p className="text-gray-600 mb-6 whitespace-pre-line">
            {product.description}
          </p>

          {/* ================= VARIANT ACCORDION ================= */}
          <div className="border rounded-xl overflow-hidden mb-6">
            <button
              onClick={() => setAccordionOpen((o) => !o)}
              className="w-full flex justify-between items-center px-4 py-4 bg-gray-50"
            >
              <div>
                <p className="font-semibold">Choose from below</p>
                <p className="text-sm text-gray-500">Select 1</p>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {selectedVariant?.label}
                {accordionOpen ? <FiChevronUp /> : <FiChevronDown />}
              </div>
            </button>

            {accordionOpen && (
              <div className="divide-y">
                {productWithOffer.variants.map((v) => {
                  const diff = (v.discountedPrice ?? v.price) - basePrice;

                  return (
                    <label
                      key={v.label}
                      className="flex justify-between items-center px-4 py-4 cursor-pointer"
                    >
                      <div>
                        <p className="font-medium">{v.label}</p>
                        {diff > 0 && (
                          <p className="text-sm text-gray-500">
                            +{formatPrice(diff)}
                          </p>
                        )}
                      </div>

                      <input
                        type="radio"
                        checked={selectedVariant?.label === v.label}
                        onChange={() => setSelectedVariant(v)}
                        className="w-5 h-5 accent-[#1E3A8A]"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================= QTY ================= */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="border p-2 rounded"
            >
              <FiMinus />
            </button>
            <span className="font-semibold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="border p-2 rounded"
            >
              <FiPlus />
            </button>
          </div>

          {/* ================= ADD-ONS ================= */}
          {product.addOns?.length > 0 && (
            <div className="space-y-4 mb-6">
              {product.addOns.map((group) => {
                const isQuantityMode = group.mode === "quantity";
                const groupTotal = isQuantityMode
                  ? getGroupQuantityTotal(group.groupName)
                  : null;
                const atMax =
                  isQuantityMode &&
                  group.maxSelect &&
                  groupTotal >= Number(group.maxSelect);

                return (
                  <div
                    key={group.groupName}
                    className="border rounded-xl overflow-hidden"
                  >
                    {/* Group Header */}
                    <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {group.groupName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {group.required ? "Required · " : "Optional · "}
                          {isQuantityMode
                            ? `Pick quantities${
                                group.maxSelect
                                  ? ` (max ${group.maxSelect})`
                                  : ""
                              }`
                            : group.multiSelect
                            ? `Pick multiple${
                                group.maxSelect
                                  ? ` (max ${group.maxSelect})`
                                  : ""
                              }`
                            : "Pick one"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isQuantityMode && group.maxSelect && (
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${
                              atMax
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {groupTotal} of {group.maxSelect}
                          </span>
                        )}
                        {group.required && (
                          <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-1 rounded-full">
                            Required
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Options */}
                    <div className="divide-y">
                      {group.options.map((opt) => {
                        if (isQuantityMode) {
                          const currentQty =
                            selectedAddOns[group.groupName]?.[opt.label] || 0;

                          return (
                            <div
                              key={opt.label}
                              className="flex justify-between items-center px-4 py-3"
                            >
                              <div>
                                <p className="font-medium text-gray-800">
                                  {opt.label}
                                </p>
                                {opt.price > 0 && (
                                  <p className="text-sm text-gray-500">
                                    +{formatPrice(opt.price)} each
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityAddOn(group, opt, -1)
                                  }
                                  disabled={currentQty <= 0}
                                  className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <FiMinus size={14} />
                                </button>
                                <span className="w-6 text-center font-semibold">
                                  {currentQty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantityAddOn(group, opt, 1)
                                  }
                                  disabled={
                                    group.maxSelect &&
                                    groupTotal >= Number(group.maxSelect)
                                  }
                                  className="w-8 h-8 flex items-center justify-center border rounded-full disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <FiPlus size={14} />
                                </button>
                              </div>
                            </div>
                          );
                        }

                        // Price mode (existing checkbox / radio behavior)
                        const isSelected = group.multiSelect
                          ? !!selectedAddOns[group.groupName]?.[opt.label]
                          : selectedAddOns[group.groupName]?.label ===
                            opt.label;

                        return (
                          <label
                            key={opt.label}
                            className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                          >
                            <div>
                              <p className="font-medium text-gray-800">
                                {opt.label}
                              </p>
                              {opt.price > 0 && (
                                <p className="text-sm text-gray-500">
                                  +{formatPrice(opt.price)}
                                </p>
                              )}
                              {opt.price === 0 && (
                                <p className="text-sm text-green-600">Free</p>
                              )}
                            </div>

                            {group.multiSelect ? (
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) =>
                                  handleMultiAddOn(
                                    group,
                                    opt,
                                    e.target.checked,
                                  )
                                }
                                className="w-5 h-5 accent-[#1E3A8A]"
                              />
                            ) : (
                              <input
                                type="radio"
                                checked={isSelected}
                                onChange={() =>
                                  handleSingleAddOn(group.groupName, opt)
                                }
                                name={group.groupName}
                                className="w-5 h-5 accent-[#1E3A8A]"
                              />
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ================= CAKE MESSAGE ================= */}
      {/* ================= CAKE MESSAGE ================= */}
{product.category?.name?.toLowerCase().includes("cake") && (
  <div className="mb-6 border rounded-2xl p-4 bg-white">
    
    <div className="flex items-center justify-between mb-2">
      <label className="text-sm font-semibold text-gray-800">
        🎂 Message on Cake
      </label>

      <span className="text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-1 rounded-full">
        +$5 extra
      </span>
    </div>

    <input
      type="text"
      value={cakeMessage}
      onChange={(e) => setCakeMessage(e.target.value)}
      maxLength={40}
      placeholder="e.g. Happy Birthday Sara ❤️"
      className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
    />

    <div className="flex items-center justify-between mt-2">
      <p className="text-xs text-gray-500">
        Custom cake wording will incur an additional charge.
      </p>

      <p className="text-xs text-gray-400">
        {cakeMessage.length}/40
      </p>
    </div>

    {cakeMessage.trim() !== "" && (
      <div className="mt-3 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2">
        <p className="text-sm font-medium text-orange-700">
          🎂 Cake wording added • +{formatPrice(5)}
        </p>
      </div>
    )}
  </div>
)}

          {/* ================= ADD TO CART ================= */}
          <button
            onClick={addToCart}
            className="w-full bg-[#1E3A8A] text-white py-4 rounded-sm text-lg font-semibold"
          >
            ADD TO CART —{" "}
            {formatPrice(
  (
    (selectedVariant?.discountedPrice ?? selectedVariant?.price) +
    addOnsTotal +
    (cakeMessage.trim() !== "" ? 5 : 0)
  ) * qty,
)}
          </button>
        </div>
      </div>

      {/* <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      /> */}
      <FulfillmentModal
  open={showFulfillment}
  onClose={() => {
    setShowFulfillment(false);
    window.dispatchEvent(new Event("open-cart")); // ← open cart after fulfillment
  }}
  redirectToCheckout={true}
/>
    </div>
  );
};

export default ProductDetail;