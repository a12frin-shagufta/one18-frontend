import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, Minus, Trash2, Truck, Store, Search, Calendar, Clock } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import moment from "moment-timezone";


const CartDrawer = ({ isOpen, onClose }) => {
  const { orders, setOrders } = useCart();
  const navigate = useNavigate();
  const items = Object.values(orders);

  const [note, setNote] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("delivery");
  const [menu, setMenu] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const branchId = localStorage.getItem("selectedBranch");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryChecked, setDeliveryChecked] = useState(false);

  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [pickupLocation, setPickupLocation] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  // State for mobile date/time picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const selectedBranch = useMemo(() => {
    const data = localStorage.getItem("selectedBranchData");
    return data ? JSON.parse(data) : null;
  }, []);

  /* =====================
     BODY SCROLL LOCK
  ====================== */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  /* =====================
     FETCH MENU
  ====================== */
  useEffect(() => {
    if (!branchId) return;
    axios
      .get(`${BACKEND_URL}/api/menu`, { params: { branch: branchId } })
      .then((res) => setMenu(res.data))
      .catch(console.error);
  }, [branchId]);

  const getMinFulfillmentDate = () => {
  const today = new Date();

  // ✅ if ANY product is preorder -> take max minDays (example 3 days)
  const minDays = items.reduce((max, item) => {
    if (item?.preorder?.enabled) {
      return Math.max(max, item.preorder?.minDays || 3);
    }
    return max;
  }, 0);

  today.setDate(today.getDate() + minDays);
  return today.toISOString().split("T")[0];
};


 const saveFulfillmentAndCheckout = () => {
  if (fulfillmentType === "delivery") {
    if (!postalCode || !deliveryDate || !deliveryTime) {
      alert("Please complete delivery details");
      return;
    }
  }

  if (fulfillmentType === "pickup") {
    if (!pickupDate || !pickupTime || !selectedBranch) {
      alert("Please complete pickup details");
      return;
    }
  }

  const fulfillmentData = {
    type: fulfillmentType,
    postalCode,
    address: address?.text || "",
    deliveryDate,
    deliveryTime,
    deliveryFee,
    pickupDate,
    pickupTime,
    branch: selectedBranch,
  };

  localStorage.setItem("fulfillmentData", JSON.stringify(fulfillmentData));
  localStorage.setItem("orderNote", note || "");
  onClose();              // ✅ CLOSE CART DRAWER
  navigate("/checkout");  // ✅ GO CHECKOUT
};


  /* =====================
     TOTAL
  ====================== */
  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );
  }, [items]);

  const grandTotal = useMemo(() => {
    return total + (fulfillmentType === "delivery" ? deliveryFee : 0);
  }, [total, deliveryFee, fulfillmentType]);

  /* =====================
     RELATED PRODUCTS
  ====================== */
  const relatedProducts = useMemo(() => {
    if (!items.length || !menu.length) return [];
    const categoryId = items[0]?.categoryId;
    if (!categoryId) return [];

    return menu
      .filter((p) => {
        const sameCategory = p.category?._id === categoryId;
        const notInCart = !items.some((i) => i.itemId === p._id);
        return sameCategory && notInCart;
      })
      .slice(0, 2);
  }, [menu, items]);

  /* =====================
     CART HANDLERS
  ====================== */
  const updateQty = (item, type) => {
    const key = `${item.itemId}_${item.variant}`;
    setOrders((prev) => {
      const qty = type === "inc" ? item.qty + 1 : item.qty - 1;
      if (qty <= 0) {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      }
      return { ...prev, [key]: { ...prev[key], qty } };
    });
  };

  const removeItem = (item) => {
    const key = `${item.itemId}_${item.variant}`;
    setOrders((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handlePostalCodeCheck = async () => {
    if (!postalCode) return;
    const cleanedPostalCode = String(postalCode).trim();

    if (!/^\d{6}$/.test(cleanedPostalCode)) {
      alert("Please enter a valid 6-digit Singapore postal code");
      setDeliveryChecked(false);
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/api/delivery/check`, {
        postalCode: cleanedPostalCode,
        subtotal: total,
      });

      setDeliveryFee(res.data.deliveryFee);
      setDeliveryChecked(true);
      setAddress({
        text: `Postal code ${cleanedPostalCode}, Singapore`,
      });
    } catch (err) {
      console.error(err);
      alert("Delivery not available for this postal code");
      setDeliveryChecked(false);
    }
  };

  const SG_TZ = "Asia/Singapore";

const getAvailableDeliveryTimes = () => {
  const nowSG = moment().tz(SG_TZ);

  const isToday =
    deliveryDate === nowSG.format("YYYY-MM-DD");

  const allSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00", "20:00"
  ];

  // ✅ If preorder item -> allow all slots
  const hasPreorder = items.some((i) => i?.preorder?.enabled);
  if (hasPreorder) return allSlots;

  // ✅ If not today -> allow all slots
  if (!isToday) return allSlots;

  // ✅ If today -> must be 2 hours later (Singapore time)
  return allSlots.filter((time) => {
    const selected = moment.tz(
      `${deliveryDate} ${time}`,
      "YYYY-MM-DD HH:mm",
      SG_TZ
    );

    return selected.diff(nowSG, "minutes") >= 120;
  });
};


  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Mobile-friendly date input
  const DatePickerInput = ({ value, onChange, min, label, type }) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      return (
        <div>
          <label className="text-sm font-medium block mb-2">{label}</label>
          <div className="relative">
            <input
              type="date"
              min={min}
              value={value}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-base bg-white appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="text-sm font-medium block mb-2">{label}</label>
        <button
          type="button"
          onClick={() => setShowDatePicker(true)}
          className="w-full border border-gray-300 rounded-xl p-4 text-left flex items-center justify-between bg-white"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {formatDisplayDate(value)}
          </span>
          <Calendar size={20} className="text-gray-400" />
        </button>
        
        {showDatePicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Select Date</h3>
                <button onClick={() => setShowDatePicker(false)}>
                  <X size={20} />
                </button>
              </div>
              <input
                type="date"
                min={min}
                value={value}
                onChange={(e) => {
                  onChange(e);
                  setShowDatePicker(false);
                }}
                className="w-full border rounded-lg p-3"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Mobile-friendly time selector
  const TimePickerInput = ({ value, onChange, options, label, type }) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      return (
        <div>
          <label className="text-sm font-medium block mb-2">{label}</label>
          <div className="relative">
            <select
              value={value}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-xl p-4 text-base bg-white appearance-none"
            >
              <option value="">Select time</option>
              {options.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      );
    }

    return (
      <div>
        <label className="text-sm font-medium block mb-2">{label}</label>
        <button
          type="button"
          onClick={() => setShowTimePicker(true)}
          className="w-full border border-gray-300 rounded-xl p-4 text-left flex items-center justify-between bg-white"
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value || "Select time"}
          </span>
          <Clock size={20} className="text-gray-400" />
        </button>
        
        {showTimePicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Select Time</h3>
                <button onClick={() => setShowTimePicker(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {options.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => {
                      onChange({ target: { value: time } });
                      setShowTimePicker(false);
                    }}
                    className={`p-3 rounded-lg border ${
                      value === time 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50
        transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button onClick={onClose}>
              <X size={24} />
            </button>
          </div>




{/* SCROLLABLE CONTENT */}
<div className="flex-1 overflow-y-auto px-4 py-6">
  {/* ✅ EMPTY CART UI */}
  {items.length === 0 ? (
    <div className="flex flex-col items-center justify-center text-center h-full py-16">
      <div className="mb-4 text-indigo-300">
        {/* cart icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          <path d="M12 9v4" />
          <path d="M10 11h4" />
        </svg>
      </div>

      <h3 className="text-xl font-bold text-indigo-700">
        Your cart is empty
      </h3>
      <p className="text-sm text-indigo-600 mt-2">
        Looks like you have no items in your cart
      </p>
    </div>
  ) : (
    <>
      {/* CART ITEMS */}
      {items.map((item) => (
        <div
          key={`${item.itemId}_${item.variant}`}
          className="flex gap-3 py-4 border-b"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.name}</p>
            <p className="text-sm text-gray-500 truncate">{item.variant}</p>

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateQty(item, "dec")}
                  className="w-8 h-8 flex items-center justify-center border rounded-full"
                >
                  <Minus size={14} />
                </button>
                <span className="min-w-[20px] text-center">{item.qty}</span>
                <button
                  onClick={() => updateQty(item, "inc")}
                  className="w-8 h-8 flex items-center justify-center border rounded-full"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <p className="font-medium whitespace-nowrap">
                  {formatPrice(item.price * item.qty)}
                </p>
                <button
                  onClick={() => removeItem(item)}
                  className="text-gray-400 hover:text-red-500 p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <div className="py-6">
          <h3 className="text-sm font-semibold mb-3">
            Often bought together
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.map((p) => (
              <div key={p._id} className="bg-gray-50 rounded-lg p-3">
                <img
                  src={p.images?.[0]}
                  alt={p.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs text-gray-500">
                  {formatPrice(p.variants?.[0]?.price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ORDER NOTES */}
      <div className="py-4">
        <label className="text-sm font-medium block mb-2">
          Order instructions
        </label>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border rounded-lg p-3 text-sm resize-none"
          placeholder="Cake message, candles, etc."
        />
      </div>

      {/* DELIVERY / PICKUP */}
      <div className="py-4">
        <h3 className="text-sm font-medium mb-3">
          Select fulfillment method
        </h3>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 -mx-1 px-1">
          <button
            onClick={() => setFulfillmentType("delivery")}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 border-2 rounded-xl py-3 px-4 transition-all ${
              fulfillmentType === "delivery"
                ? "border-[#1E3A8A] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Truck size={20} />
            <span className="font-medium text-sm">Delivery</span>
          </button>

          <button
            onClick={() => setFulfillmentType("pickup")}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 border-2 rounded-xl py-3 px-4 transition-all ${
              fulfillmentType === "pickup"
                ? "border-[#1E3A8A] bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Store size={20} />
            <span className="font-medium text-sm">Pickup</span>
          </button>
        </div>

        {/* DELIVERY FLOW */}
        {fulfillmentType === "delivery" && (
          <div className="space-y-4">
            {/* POSTAL CODE */}
            <div>
              <label className="text-sm font-medium block mb-2">
                Postal code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={postalCode}
                  onChange={(e) =>
                    setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder=""
                  className="flex-1 border border-gray-300 rounded-xl p-4 text-base"
                />
                <button
                  onClick={handlePostalCodeCheck}
                  className="px-4 bg-[#1E3A8A] hover:bg-blue-600 text-white rounded-xl transition-colors whitespace-nowrap"
                >
                  <FaSearch/>
                </button>
              </div>

              {deliveryChecked && address && (
                <p className="text-sm text-green-600 mt-2">
                  ✔ Delivery available
                </p>
              )}
            </div>

            {/* DELIVERY DATE & TIME */}
            {deliveryChecked && address && (
              <>
                <DatePickerInput
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  min={getMinFulfillmentDate()}
                  label="Delivery date"
                  type="delivery"
                />

                {items[0]?.preorder?.enabled && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
                    ⚠ Pre-order: {items[0].preorder.minDays} day(s) advance
                    required
                  </div>
                )}

                <TimePickerInput
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  options={getAvailableDeliveryTimes()}
                  label="Delivery time"
                  type="delivery"
                />
              </>
            )}
          </div>
        )}

        {/* PICKUP FLOW */}
        {fulfillmentType === "pickup" && selectedBranch && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">
                Pickup location
              </label>
              <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                <p className="font-medium truncate">{selectedBranch.name}</p>
                <p className="text-sm text-gray-600 mt-1 truncate">
                  {selectedBranch.address}
                </p>
              </div>
            </div>

            <DatePickerInput
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={getMinFulfillmentDate()}
              label="Pickup date"
              type="pickup"
            />

            <TimePickerInput
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              options={[
                "10:00",
                "11:00",
                "12:00",
                "13:00",
                "14:00",
                "15:00",
                "16:00",
                "17:00",
              ]}
              label="Pickup time"
              type="pickup"
            />
          </div>
        )}
      </div>

      {/* TOTAL */}
      <div className="py-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(total)}</span>
          </div>

          {fulfillmentType === "delivery" && deliveryFee > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery fee</span>
              <span>{formatPrice(deliveryFee)}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">
              {formatPrice(grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </>
  )}
</div>

          

          {/* FOOTER - STICKY BOTTOM */}
          <div className="border-t bg-white p-4 flex gap-3 flex-shrink-0 safe-area-bottom">
            {/* <button
              onClick={() => navigate("/cart")}
              className="flex-1 rounded-full bg-gray-100 py-3 font-medium hover:bg-gray-200 transition"
            >
              View Cart
            </button> */}

            {items.length === 0 ? (
  <button
    onClick={onClose}
    className="flex-1 rounded-none bg-[#1E3A8A] py-4 font-semibold text-white"
  >
    Select your dining preference
  </button>
) : (
  <button
    onClick={saveFulfillmentAndCheckout}
    className="flex-1 rounded-full py-3 font-medium transition bg-[#1E3A8A] text-white hover:bg-gray-800"
  >
    Check Out
  </button>
)}

          </div>
        </div>
      </div>

      {/* Add CSS for safe areas on mobile */}
      <style>{`
  @supports (padding: max(0px)) {
    .safe-area-bottom {
      padding-bottom: max(1rem, env(safe-area-inset-bottom));
    }
  }

  @media (max-width: 640px) {
    button, input, select, textarea {
      font-size: 16px;
    }

    input[type="date"] {
      min-height: 44px;
    }
  }
`}</style>

    </>
  );
};

export default CartDrawer;