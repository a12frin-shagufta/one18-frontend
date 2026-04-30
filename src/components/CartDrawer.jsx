import React, { useEffect, useMemo, useState } from "react";
import {
  X,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Calendar,
  Clock,
  Gift,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/currency";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// ─── inline FreeItemPicker ───────────────────────────────────────────────────
const FreeItemPicker = ({ promoItems, selectedFreeItem, onSelect }) => (
  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mt-2">
    <div className="flex items-center gap-2 mb-3">
      <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center">
        <Gift size={18} className="text-green-600" />
      </div>
      <div>
        <p className="font-bold text-green-800 text-sm">Buy 4 Get 1 Free!</p>
        <p className="text-xs text-green-600">Pick your free item below</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-2">
      {promoItems.map((item) => {
        const isSelected = selectedFreeItem?._id === item._id;
        return (
          <button
            key={item._id}
            onClick={() => onSelect(isSelected ? null : item)}
            className={`rounded-xl border-2 p-1.5 text-left transition-all ${
              isSelected
                ? "border-green-500 bg-green-100 shadow-md scale-[1.03]"
                : "border-gray-200 bg-white hover:border-green-300"
            }`}
          >
            <img
              src={item.images?.[0]}
              alt={item.name}
              className="w-full aspect-square object-cover rounded-lg mb-1"
            />
            <p className="text-[11px] font-medium text-gray-800 truncate leading-tight">
              {item.name}
            </p>
            <p className="text-[11px] text-green-600 font-bold">FREE</p>
          </button>
        );
      })}
    </div>

    {selectedFreeItem && (
      <div className="mt-3 flex items-center gap-2 bg-green-100 rounded-xl px-3 py-2">
        <span className="text-green-600 text-sm">✅</span>
        <p className="text-sm text-green-700 font-medium">
          {selectedFreeItem.name} added free!
        </p>
        <button
          onClick={() => onSelect(null)}
          className="ml-auto text-green-500 hover:text-green-700"
        >
          <X size={14} />
        </button>
      </div>
    )}
  </div>
);
// ────────────────────────────────────────────────────────────────────────────

const CartDrawer = ({ isOpen, onClose }) => {
  const { orders, setOrders } = useCart();
  const navigate = useNavigate();
  const items = Object.values(orders);

  // ── promo state ────────────────────────────────────────────────────────────
  const [promoItems, setPromoItems] = useState([]);
  const [freeItem, setFreeItem] = useState(null);

  // fetch promo-eligible items once
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/promo/items`)
      .then((res) => setPromoItems(res.data || []))
      .catch(console.error);
  }, []);

  // ids for quick lookup
  const promoItemIds = useMemo(
    () => new Set(promoItems.map((p) => p._id)),
    [promoItems],
  );

  // count eligible items in cart (sum of qty)
  const promoQty = useMemo(
    () =>
      items.reduce(
        (sum, i) => (promoItemIds.has(i.itemId) ? sum + i.qty : sum),
        0,
      ),
    [items, promoItemIds],
  );

  const promoUnlocked = promoQty >= 4;

  // clear free item if promo no longer qualifies
  useEffect(() => {
    if (!promoUnlocked) setFreeItem(null);
  }, [promoUnlocked]);

  // persist free item to localStorage so checkout can read it
  useEffect(() => {
    if (freeItem) {
      localStorage.setItem("promoFreeItem", JSON.stringify(freeItem));
    } else {
      localStorage.removeItem("promoFreeItem");
    }
  }, [freeItem]);
  // ──────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isOpen]);

  useEffect(() => {
    if (items.length === 0) {
      localStorage.removeItem("fulfillmentData");
    }
  }, [items.length]);

  const fulfillment = useMemo(() => {
    const data = localStorage.getItem("fulfillmentData");
    return data ? JSON.parse(data) : null;
  }, [isOpen, items.length]);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items],
  );
  const deliveryFee =
    fulfillment?.type === "delivery"
      ? Number(fulfillment?.deliveryFee ?? 0)
      : 0;
  const total = subtotal + deliveryFee;

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
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col h-[calc(100%-140px)] sm:h-[calc(100%-160px)] overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
            {/* EMPTY STATE */}
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
                    navigate("/menu");
                  }}
                  className="w-full max-w-xs bg-[#1E3A8A] text-white py-4 px-6 rounded-xl font-semibold shadow-lg"
                >
                  Go to Menu
                </button>
              </div>
            )}

            {/* FULFILLMENT SUMMARY */}
            {items.length > 0 && fulfillment && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 mb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin
                        size={20}
                        className={
                          fulfillment.type === "pickup"
                            ? "text-blue-600"
                            : "text-green-600"
                        }
                      />
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

                {/* ✅ PROMO PROGRESS BAR (shows when < 4 eligible items) */}
                {promoItems.length > 0 && !promoUnlocked && promoQty > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-amber-800">
                        🎁 Add {4 - promoQty} more promo item
                        {4 - promoQty > 1 ? "s" : ""} for a FREE one!
                      </p>
                      <span className="text-xs font-bold text-amber-700">
                        {promoQty}/4
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(promoQty / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* ✅ PROMO TEASER (shows when 0 eligible items in cart) */}
                {/* {promoItems.length > 0 && promoQty === 0 && (
                  <div className="bg-purple-50 border border-purple-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl">🎁</span>
                    <p className="text-sm text-purple-700">
                      Buy <span className="font-bold">4 eligible items</span> and get 1 FREE!
                    </p>
                  </div>
                )} */}

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
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {item.name}
                              </h4>
                              {/* ✅ badge if promo-eligible */}
                              {promoItemIds.has(item.itemId) && (
                                <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-medium">
                                  🎁 Promo
                                </span>
                              )}
                            </div>
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
                            >
                              <Minus size={16} className="text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-900">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item, "inc")}
                              className="w-8 h-8 sm:w-10 sm:h-10 border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
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

                {/* ✅ FREE ITEM PICKER — only when promo unlocked */}
                {promoUnlocked && (
                  <FreeItemPicker
                    promoItems={promoItems}
                    selectedFreeItem={freeItem}
                    onSelect={setFreeItem}
                  />
                )}
              </div>
            )}
          </div>

          {/* FOOTER */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 bg-white p-4 sm:p-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {/* ✅ show free item saving */}
                {freeItem && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-1">
                      <Gift size={14} /> Free item ({freeItem.name})
                    </span>
                    <span className="font-medium">- FREE</span>
                  </div>
                )}
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

              <button
  onClick={() => {
    onClose();
    if (!fulfillment) {
      window.dispatchEvent(new Event("open-fulfillment"));
    } else {
      navigate("/checkout");
    }
  }}
  className="w-full bg-[#1E3A8A] text-white py-4 px-6 rounded-xl font-bold"
>
  {fulfillment
    ? `Proceed to Checkout · ${formatPrice(total)}`
    : "Proceed to Checkout"}
</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
