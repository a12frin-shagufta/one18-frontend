import React, { useMemo, useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/currency";

const Cart = () => {
  const { orders, setOrders } = useCart();
  const items = Object.values(orders);
  const navigate = useNavigate();

  const [note, setNote] = useState("");
  const [fulfillmentType, setFulfillmentType] = useState("delivery");

  const fulfillmentData = {
  type: fulfillmentType, // "delivery" | "pickup"
  postalCode,
  address,
  deliveryFee,
  deliveryDate,
  deliveryTime,
  pickupDate,
  pickupTime,
  branch: selectedBranch,
};

// localStorage.setItem(
//   "fulfillmentData",
//   JSON.stringify(fulfillmentData)
// );


  /* =====================
     TOTAL
  ====================== */
  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );
  }, [items]);

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

  /* =====================
     EMPTY STATE
  ====================== */
  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">
          Add items from the menu to get started.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-black text-white rounded-full"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b px-4 py-4">
        <h1 className="text-lg font-semibold">Your Cart</h1>
      </div>

      {/* CONTENT */}
      <div className="px-4 py-4 space-y-4">
        {/* CART ITEMS */}
        {items.map((item) => (
          <div
            key={`${item.itemId}_${item.variant}`}
            className="bg-white rounded-xl p-4 flex gap-3 border"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 rounded-lg object-cover"
            />

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.variant}</p>

              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => updateQty(item, "dec")}
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                >
                  <Minus size={14} />
                </button>

                <span className="min-w-[24px] text-center">
                  {item.qty}
                </span>

                <button
                  onClick={() => updateQty(item, "inc")}
                  className="w-8 h-8 border rounded-full flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
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

        {/* ORDER NOTES */}
        <div className="bg-white rounded-xl p-4 border">
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

        {/* DELIVERY / PICKUP */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setFulfillmentType("delivery")}
            className={`rounded-xl py-4 border ${
              fulfillmentType === "delivery" ? "bg-gray-100" : ""
            }`}
          >
            Local Delivery
          </button>

          <button
            onClick={() => setFulfillmentType("pickup")}
            className={`rounded-xl py-4 border ${
              fulfillmentType === "pickup" ? "bg-gray-100" : ""
            }`}
          >
            Store Pickup
          </button>
        </div>

        {/* TOTAL */}
        <div className="bg-white rounded-xl p-4 border">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold">{formatPrice(total)}</p>
          <p className="text-xs text-gray-400 mt-1">
            Tax included. Final charges at checkout.
          </p>
        </div>
      </div>

      {/* FIXED FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-4">
        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-black text-white py-4 rounded-full font-medium"
        >
          Proceed to Checkout · {formatPrice(total)}
        </button>
      </div>
    </div>
  );
};

export default Cart;
