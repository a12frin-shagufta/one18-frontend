import React, { useEffect, useMemo, useState } from "react";
import { X, Plus, Minus, Trash2, Truck, Store, Search } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
     FETCH MENU (RELATED)
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
  const item = items[0];

  if (!item?.preorder?.enabled) {
    return today.toISOString().split("T")[0];
  }

  today.setDate(today.getDate() + item.preorder.minDays);
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

    // delivery
    postalCode,
    address: address?.text || "",
    deliveryDate,
    deliveryTime,
    deliveryFee,

    // pickup
    pickupDate,
    pickupTime,
    branch: selectedBranch,
  };

  localStorage.setItem(
    "fulfillmentData",
    JSON.stringify(fulfillmentData)
  );

  navigate("/checkout");
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

  // ✅ FORCE string + trim spaces
  const cleanedPostalCode = String(postalCode).trim();

  // ✅ Singapore postal code validation
  if (!/^\d{6}$/.test(cleanedPostalCode)) {
    alert("Please enter a valid 6-digit Singapore postal code");
    setDeliveryChecked(false);
    return;
  }

  try {
    const res = await axios.post(
      `${BACKEND_URL}/api/delivery/check`,
      {
        postalCode: cleanedPostalCode,
        subtotal: total,
      }
    );

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


const getAvailableDeliveryTimes = () => {
  const now = new Date();
  const isToday =
    deliveryDate === new Date().toISOString().split("T")[0];

  const allSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // preorder → show all slots
  if (items[0]?.preorder?.enabled) {
    return allSlots;
  }

  // not today → show all slots
  if (!isToday) {
    return allSlots;
  }

  // today → only slots after 2 hours
  return allSlots.filter((time) => {
    const [h, m] = time.split(":").map(Number);
    const slotTime = new Date();
    slotTime.setHours(h, m, 0, 0);

    const diffInHours =
      (slotTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return diffInHours >= 2;
  });
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
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50
        transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0">
            <h2 className="text-lg font-semibold">Shopping Cart</h2>
            <button onClick={onClose}>
              <X />
            </button>
          </div>

          {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto px-4 py-4 overflow-visible">

            {/* CART ITEMS */}
            {items.map((item) => (
              <div
                key={`${item.itemId}_${item.variant}`}
                className="flex gap-3 py-4 border-b"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.variant}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQty(item, "dec")}>
                      <Minus size={14} />
                    </button>
                    <span>{item.qty}</span>
                    <button onClick={() => updateQty(item, "inc")}>
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <p className="font-medium">
                    {formatPrice(item.price * item.qty)}
                  </p>
                  <button
                    onClick={() => removeItem(item)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
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
                    <div key={p._id}>
                      <img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="rounded-lg mb-2"
                      />
                      <p className="text-sm">{p.name}</p>
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
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border rounded-lg p-3 text-sm"
                placeholder="Cake message, candles, etc."
              />
            </div>

            {/* DELIVERY / PICKUP - FIXED UX */}
            <div className="py-4">
              <h3 className="text-sm font-medium mb-3">Select fulfillment method</h3>
              
              {/* BUTTONS IN A ROW WITH ICONS */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setFulfillmentType("delivery")}
                  className={`flex flex-col items-center justify-center gap-2 border-2 rounded-xl py-4 transition-all ${
                    fulfillmentType === "delivery"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Truck size={24} className="text-gray-700" />
                  <span className="font-medium">Local Delivery</span>
                </button>

                <button
                  onClick={() => setFulfillmentType("pickup")}
                  className={`flex flex-col items-center justify-center gap-2 border-2 rounded-xl py-4 transition-all ${
                    fulfillmentType === "pickup"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Store size={24} className="text-gray-700" />
                  <span className="font-medium">Store Pickup</span>
                </button>
              </div>

              {/* DELIVERY FLOW - SHOWS BELOW IN COLUMN */}
              {fulfillmentType === "delivery" && (
                <div className="space-y-6">
                  {/* POSTAL CODE INPUT WITH SEARCH ICON */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Enter your postal code
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handlePostalCodeCheck();
                          }
                        }}
                        placeholder="Enter your postal code ..."
                        className="w-full border border-gray-300 rounded-xl p-4 pl-5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        onClick={handlePostalCodeCheck}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        aria-label="Check postal code"
                      >
                        <Search size={20} />
                      </button>
                    </div>

                    {deliveryChecked && address && (
                      <p className="text-sm text-green-600 mt-3 ml-2">
                        ✔ Delivery available to this address
                      </p>
                    )}
                  </div>

                  {/* DELIVERY DATE & TIME - SHOWS BELOW IN COLUMN */}
                  {deliveryChecked && address && (
                    <>
                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Choose delivery date
                        </label>
                       <input
  type="date"
  min={getMinFulfillmentDate()}
  value={deliveryDate}
  onChange={(e) => setDeliveryDate(e.target.value)}
  className="
    w-full
    border
    border-gray-300
    rounded-xl
    p-4
    text-base
    bg-white
    relative
    z-50
    appearance-auto
  "
/>


{items[0]?.preorder?.enabled && (
  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded text-sm">
    This item requires at least{" "}
    <strong>{items[0].preorder.minDays} day(s)</strong> advance notice.
  </div>
)}

                      </div>

                      <div>
                        <label className="text-sm font-medium block mb-2">
                          Choose time slot
                        </label>
                        <select
  value={deliveryTime}
  onChange={(e) => setDeliveryTime(e.target.value)}
  className="w-full border border-gray-300 rounded-xl p-3 text-sm bg-gray-50"
>
  <option value="">Select time</option>

  {getAvailableDeliveryTimes().map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ))}
</select>

                        
                        
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* PICKUP FLOW - SHOWS BELOW IN COLUMN */}
              {fulfillmentType === "pickup" && selectedBranch && (
                <div className="space-y-6">
                  {/* PICKUP LOCATION */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Pickup location
                    </label>
                    <div className="border border-gray-300 rounded-xl p-4 bg-gray-50">
                      <p className="font-medium">{selectedBranch.name}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedBranch.address}
                      </p>
                      {selectedBranch.mapUrl && (
                        <a
                          href={selectedBranch.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 underline mt-2 inline-block"
                        >
                          View map
                        </a>
                      )}
                    </div>
                  </div>

                  {/* PICKUP DATE */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Choose pickup date
                    </label>
                   <input
  type="date"
  min={getMinFulfillmentDate()}
  value={pickupDate}
  onChange={(e) => setPickupDate(e.target.value)}
/>

                  </div>

                  {/* PICKUP TIME */}
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Choose pickup time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select time</option>
                      <option>10:00 AM – 10:30 AM</option>
                      <option>11:00 AM – 11:30 AM</option>
                      <option>12:00 PM – 12:30 PM</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* TOTAL */}
            <div className="py-4 border-t">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-3xl font-bold">
                  {formatPrice(grandTotal)}
                </span>
              </div>
              {fulfillmentType === "delivery" && (
                <p className="text-sm text-gray-600">
                  Delivery fee:{" "}
                  {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                </p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t bg-white p-4 flex gap-3 flex-shrink-0">
            <button
              onClick={() => navigate("/cart")}
              className="flex-1 rounded-full bg-yellow-400 py-3 font-medium hover:bg-yellow-500 transition"
            >
              View Cart
            </button>

            <button
  onClick={saveFulfillmentAndCheckout}
  className="flex-1 rounded-full border py-3 font-medium"
>
  Check Out
</button>

          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;