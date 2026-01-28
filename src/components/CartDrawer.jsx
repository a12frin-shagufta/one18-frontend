import React, { useEffect, useMemo } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  Edit2,
} from "lucide-react";
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

  const fulfillment = useMemo(() => {
  const data = localStorage.getItem("fulfillmentData");
  return data ? JSON.parse(data) : null;
}, [isOpen, items.length]);


  /* ======================
     READ FULFILLMENT (SAFE)
  ====================== */

  /* ======================
     TOTAL
  ====================== */
  

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );
  const deliveryFee =
  fulfillment?.type === "delivery"
    ? Number(fulfillment?.deliveryFee ?? 0)
    : 0;


  const total = subtotal + deliveryFee;

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
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          isOpen
            ? "bg-black/50 backdrop-blur-sm"
            : "bg-transparent pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-md bg-white z-50 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white sticky top-0 z-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {items.length}
                </span>
              </div>
              <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
            </div>
            <p className="text-sm text-gray-500">
              {items.length === 0
                ? "Your cart is empty"
                : `${items.length} item${items.length > 1 ? "s" : ""} added`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col h-[calc(100%-140px)] sm:h-[calc(100%-160px)] overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {/* EMPTY CART STATE */}
            {items.length === 0 && (
              <div className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24">
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <span className="text-4xl sm:text-5xl">🛒</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-8 max-w-sm">
                  Looks like you haven't added any delicious items yet
                </p>

                <button
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new Event("open-fulfillment"));
                  }}
                  className="w-full max-w-xs bg-[#1E3A8A] hover:from-blue-700 hover:to-blue-800 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Select Dining Preference
                </button>
              </div>
            )}

            {/* FULFILLMENT SUMMARY */}
            {items.length > 0 && fulfillment && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 mb-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {fulfillment.type === "pickup" ? (
                        <MapPin size={20} className="text-blue-600" />
                      ) : (
                        <MapPin size={20} className="text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 capitalize">
                        {fulfillment.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {fulfillment.type === "pickup"
                          ? "Store pickup"
                          : "Home delivery"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      window.dispatchEvent(new Event("edit-fulfillment"));
                    }}
                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    aria-label="Edit fulfillment details"
                  >
                    <Edit2 size={18} className="text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin
                      size={16}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {fulfillment.type === "pickup"
                          ? "Pickup from"
                          : "Delivering to"}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {fulfillment.type === "pickup"
                          ? fulfillment.branch?.name
                          : fulfillment.postalCode}
                      </p>
                      {fulfillment.type === "pickup" && (
                        <p className="text-xs text-gray-500 mt-1">
                          {fulfillment.branch?.address}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar
                      size={16}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {fulfillment.type === "pickup"
                          ? "Pickup date"
                          : "Delivery date"}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {fulfillment.type === "pickup"
                          ? fulfillment.pickupDate
                          : fulfillment.deliveryDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock
                      size={16}
                      className="text-gray-400 mt-0.5 flex-shrink-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500">
                        {fulfillment.type === "pickup"
                          ? "Pickup time"
                          : "Delivery time"}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm">
                        {fulfillment.type === "pickup"
                          ? fulfillment.pickupTime
                          : fulfillment.deliveryTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CART ITEMS */}
            {items.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-lg">Order Items</h3>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={`${item.itemId}_${item.variant}`}
                      className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500 mt-1">
                              {item.variant}
                            </p>
                            <p className="font-bold text-gray-900 text-lg mt-2">
                              {formatPrice(item.price * item.qty)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2
                              size={18}
                              className="text-gray-400 hover:text-red-500"
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQty(item, "dec")}
                              className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} className="text-gray-600" />
                            </button>

                            <span className="w-8 text-center font-semibold text-gray-900">
                              {item.qty}
                            </span>

                            <button
                              onClick={() => updateQty(item, "inc")}
                              className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} className="text-gray-600" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} each
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER - ONLY SHOW WHEN ITEMS EXIST */}
         {items.length > 0 && (
  <div className="border-t border-gray-100 bg-white p-4 sm:p-6 space-y-4">

              {/* PRICE BREAKDOWN */}
              <div className="space-y-2">
  <div className="flex justify-between">
    <span className="text-gray-600">Subtotal</span>
    <span>{formatPrice(subtotal)}</span>
  </div>

  <div className="flex justify-between">
    <span className="text-gray-600">Delivery</span>
    <span className="font-medium">
      {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
    </span>
  </div>

  <div className="border-t pt-2">
    <div className="flex justify-between font-bold">
      <span>Total</span>
      <span>{formatPrice(total)}</span>
    </div>
  </div>
</div>


              {/* CHECKOUT BUTTON */}
              {/* NO fulfillment → only yellow button */}
{!fulfillment && (
  <button
    onClick={() => {
      onClose();
      window.dispatchEvent(new Event("open-fulfillment"));
    }}
    className="w-full bg-[#1E3A8A]  text-white py-3 rounded-xl font-semibold"
  >
    Continue with selection
  </button>
)}

{/* fulfillment exists → only checkout */}
{fulfillment && (
  <button
    onClick={() => {
      onClose();
      navigate("/checkout");
    }}
    className="w-full bg-[#1E3A8A] text-white py-4 px-6 rounded-xl font-bold"
  >
    Proceed to Checkout · {formatPrice(total)}
  </button>
)}

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
