import React, { useEffect, useMemo } from "react";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const { orders, setOrders } = useCart();
  const navigate = useNavigate();
  const items = Object.values(orders);

  /* ======================
     BODY SCROLL LOCK
  ====================== */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  /* ======================
     CLEAR FULFILLMENT WHEN CART EMPTY ✅
  ====================== */
  useEffect(() => {
    if (items.length === 0) {
      localStorage.removeItem("fulfillmentData");
    }
  }, [items.length]);

  /* ======================
     READ FULFILLMENT (SAFE)
  ====================== */
  const fulfillment = useMemo(() => {
    if (items.length === 0) return null;
    const data = localStorage.getItem("fulfillmentData");
    return data ? JSON.parse(data) : null;
  }, [isOpen, items.length]);

  /* ======================
     TOTAL
  ====================== */
  const subtotal = useMemo(() => {
    return items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }, [items]);

  const total = subtotal + (fulfillment?.deliveryFee || 0);

  /* ======================
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

  /* ======================
     UI
  ====================== */
  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <p className="text-sm text-gray-500">
              You’ve added {items.length} item(s)
            </p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">

          {/* ✅ EMPTY CART STATE (SECOND IMAGE LOGIC) */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center text-center px-6 py-20">
              <div className="text-6xl mb-6">🛒</div>
              <h3 className="text-xl font-semibold text-blue-600">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mt-2">
                Looks like you have no items in your cart
              </p>

              <button
                onClick={() => {
                  onClose();
                  window.dispatchEvent(new Event("open-fulfillment"));
                }}
                className="mt-10 w-full bg-[#1E3A8A] text-white py-4 rounded-full font-medium"
              >
                Select your dining preference
              </button>
            </div>
          )}

          {/* ✅ FULFILLMENT SUMMARY (ONLY WHEN ITEMS EXIST) */}
          {items.length > 0 && fulfillment && (
            <div className="border-b px-4 py-4 space-y-4">
              {fulfillment.type === "pickup" && (
                <>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pickup from</p>
                      <p className="font-medium text-blue-700">
                        {fulfillment.branch?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {fulfillment.branch?.address}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new Event("edit-fulfillment"));
                      }}
                    >
                      ✏️
                    </button>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Pickup on</p>
                    <p className="font-medium text-blue-700">
                      {fulfillment.pickupDate} · {fulfillment.pickupTime}
                    </p>
                  </div>
                </>
              )}

              {fulfillment.type === "delivery" && (
                <>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Delivering to</p>
                      <p className="font-medium text-blue-700">
                        {fulfillment.postalCode}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        window.dispatchEvent(new Event("edit-fulfillment"));
                      }}
                    >
                      ✏️
                    </button>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Delivering on</p>
                    <p className="font-medium text-blue-700">
                      {fulfillment.deliveryDate} · {fulfillment.deliveryTime}
                    </p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* CART ITEMS */}
          {items.length > 0 && (
            <div className="px-4 py-4 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.itemId}_${item.variant}`}
                  className="flex gap-3 border-b pb-4"
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
                        className="w-8 h-8 border rounded-full"
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.qty}</span>

                      <button
                        onClick={() => updateQty(item, "inc")}
                        className="w-8 h-8 border rounded-full"
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
            </div>
          )}
        </div>

        {/* FOOTER */}
        {items.length > 0 && (
          <div className="border-t p-4">
            <button
              onClick={() => {
                onClose();
                navigate("/checkout");
              }}
              className="w-full bg-[#1E3A8A] text-white py-4 rounded-full font-medium"
            >
              Proceed to Checkout · {formatPrice(total)}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
