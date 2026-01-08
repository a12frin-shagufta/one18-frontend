// components/CartDrawer.jsx
import React from "react";
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const { orders, setOrders } = useCart();
  const navigate = useNavigate();

  const items = Object.values(orders);

  const total = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0
  );

  const handleIncrease = (item) => {
    const key = `${item.itemId}_${item.variant}`;
    setOrders((prev) => ({
      ...prev,
      [key]: { ...prev[key], qty: item.qty + 1 },
    }));
  };

  const handleDecrease = (item) => {
    const key = `${item.itemId}_${item.variant}`;
    if (item.qty > 1) {
      setOrders((prev) => ({
        ...prev,
        [key]: { ...prev[key], qty: item.qty - 1 },
      }));
    }
  };

  const handleRemove = (item) => {
    const key = `${item.itemId}_${item.variant}`;
    setOrders((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-40 ${
          isOpen ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* DRAWER - UPDATED FOR MOBILE */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:max-w-sm md:max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          // Ensure drawer doesn't exceed viewport on mobile
          maxWidth: "100vw",
          width: "100%",
          // On larger screens, use fixed width
          "@media (min-width: 640px)": { width: "24rem" },
          "@media (min-width: 768px)": { width: "28rem" }
        }}
      >
        <div className="flex flex-col h-full">
          {/* HEADER - FIXED FOR MOBILE */}
          <div className="sticky top-0 bg-white border-b px-4 py-3 md:px-6 md:py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <ShoppingBag className="w-5 h-5 text-[#1E3A8A] flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 truncate">
                  Your Cart
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                  {items.length > 0 && ` • ${formatPrice(total)}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0 ml-2"
              aria-label="Close cart"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* CONTENT - IMPROVED SCROLLING ON MOBILE */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 pb-32 md:pb-36 overscroll-contain">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-sm text-gray-500 mb-5">
                  Add items to get started
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-2 sm:space-y-3">
                {items.map((item) => {
                  const key = `${item.itemId}_${item.variant}`;
                  const itemTotal = item.price * item.qty;

                  return (
                    <div
                      key={key}
                      className="bg-gray-50 rounded-lg sm:rounded-xl p-3 border border-gray-200"
                    >
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">
                            {item.variant}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(item)}
                          className="p-1.5 rounded-lg hover:bg-red-50 flex-shrink-0"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecrease(item)}
                            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-100 active:bg-gray-200"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <span className="min-w-[32px] text-center text-base font-medium">
                            {item.qty}
                          </span>

                          <button
                            onClick={() => handleIncrease(item)}
                            className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center hover:bg-blue-100 active:bg-blue-200"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3 text-[#1E3A8A]" />
                          </button>
                        </div>

                        <p className="font-semibold text-gray-800 text-base">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER - FIXED POSITION FOR MOBILE */}
          {items.length > 0 && (
            <div className="sticky bottom-0 bg-white border-t px-4 py-4 sm:px-6 md:py-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm sm:text-base">Subtotal</span>
                  <span className="font-bold text-lg sm:text-xl text-gray-800">
                    {formatPrice(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-[#1E3A8A] text-white py-3 sm:py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-800 active:bg-blue-900 transition-colors"
                >
                  <span className="truncate">Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5 flex-shrink-0" />
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 text-gray-600 text-sm hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;