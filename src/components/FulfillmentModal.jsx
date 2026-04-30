import React, { useState, useMemo, useEffect } from "react";
import { X, Store, Truck, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const branches = [
  {
    id: "tampines",
    _id: "696b2592f5f3ced6b3de4974",
    name: "One18 Bakery Tampines",
    address: "826 Tampines Street 81, Singapore 520826",
    lat: 1.3526,
    lng: 103.9448,
  },
  {
    id: "northbridge",
    _id: "696b25f8f5f3ced6b3de4982",
    name: "One18 Bakery North Bridge",
    address: "North Bridge Road, Singapore",
    lat: 1.2905,
    lng: 103.852,
  },
];

const timeSlots = [
  "07:30", "08:30", "09:30", "10:30", "11:30", "12:30",
  "13:30", "14:30", "15:30", "16:30", "17:30", "18:30", "19:00",
];

// Returns today + 3 days as YYYY-MM-DD (local time)
const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// Generate next N tile dates starting from minDate
const getTileDates = (count = 7) => {
  const dates = [];
  const base = new Date();
  base.setDate(base.getDate() + 3);
  for (let i = 0; i < count; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    dates.push({
      value: `${yyyy}-${mm}-${dd}`,
      day: d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: d.getDate(),
      month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    });
  }
  return dates;
};

const FulfillmentModal = ({ open, onClose, redirectToCheckout }) => {
  const { orders } = useCart();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // ── State ──────────────────────────────────────────────────────────────────
  const [step, setStep] = useState("select");
  const [branch, setBranch] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [branchError, setBranchError] = useState("");
  const [pickupDateError, setPickupDateError] = useState("");
  const [pickupTimeError, setPickupTimeError] = useState("");
  const [deliveryDateError, setDeliveryDateError] = useState("");
  const [deliveryTimeError, setDeliveryTimeError] = useState("");
  const [postalStatus, setPostalStatus] = useState("idle");
  const [postalMessage, setPostalMessage] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [deliveryArea, setDeliveryArea] = useState("");
  const [deliveryAccessError, setDeliveryAccessError] = useState(false);

  // ── Cart subtotal ──────────────────────────────────────────────────────────
  const cartSubtotal = useMemo(
    () => Object.values(orders).reduce((sum, item) => sum + item.price * item.qty, 0),
    [orders],
  );

  // ── Re-validate postal when subtotal changes (e.g. free delivery threshold) ─
  useEffect(() => {
    if (postalCode.length !== 6 || postalStatus === "idle") return;
    const recheck = async () => {
      setPostalStatus("checking");
      try {
        const res = await axios.post(`${BACKEND_URL}/api/delivery/check`, {
          postalCode,
          subtotal: cartSubtotal,
        });
        setPostalStatus("success");
        setDeliveryFee(res.data.deliveryFee);
        setDeliveryArea(res.data.area);
        setPostalMessage(
          `Delivering to ${res.data.area} • Fee S$${res.data.deliveryFee}`,
        );
      } catch (err) {
        setPostalStatus("error");
        setPostalMessage(err.response?.data?.message || "Delivery not available");
      }
    };
    recheck();
  }, [cartSubtotal]);

  // ── Postal change handler ──────────────────────────────────────────────────
  const handlePostalChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPostalCode(value);
    setPostalStatus("idle");
    setPostalMessage("");
    setDeliveryFee(null);
    setDeliveryArea("");
    if (value.length !== 6) return;

    setPostalStatus("checking");
    try {
      const res = await axios.post(`${BACKEND_URL}/api/delivery/check`, {
        postalCode: value,
        subtotal: cartSubtotal,
      });
      setPostalStatus("success");
      setDeliveryFee(res.data.deliveryFee);
      setDeliveryArea(res.data.area);
      setPostalMessage(
        `Delivering to ${res.data.area} • Fee S$${res.data.deliveryFee}`,
      );
    } catch (err) {
      setPostalStatus("error");
      setPostalMessage(err.response?.data?.message || "Delivery not available");
    }
  };

  // ── Continue / save handler ────────────────────────────────────────────────
  const saveAndClose = () => {
    // ── Pickup validation ──
    if (step === "pickup") {
      let valid = true;
      if (!branch) { setBranchError("Please choose a branch"); valid = false; }
      if (!pickupDate) { setPickupDateError("Please select a pickup date"); valid = false; }
      if (!pickupTime) { setPickupTimeError("Please select a pickup time"); valid = false; }
      if (!valid) return;

      localStorage.setItem(
        "fulfillmentData",
        JSON.stringify({
          type: "pickup",
          branch,
          pickupDate,
          pickupTime,
        }),
      );
      onClose();
      if (redirectToCheckout) navigate("/checkout");
      return;
    }

    // ── Delivery details → go to branch selection ──
    if (step === "delivery_details") {
      let valid = true;
      if (postalStatus !== "success") { valid = false; }
      if (!deliveryDate) { setDeliveryDateError("Please select a delivery date"); valid = false; }
      if (!deliveryTime) { setDeliveryTimeError("Please select a delivery time"); valid = false; }
      if (!valid) return;
      setStep("delivery_branch");
      return;
    }

    // ── Delivery branch validation → save ──
    if (step === "delivery_branch") {
      if (!branch) { setBranchError("Please choose a branch"); return; }

      localStorage.setItem(
        "fulfillmentData",
        JSON.stringify({
          type: "delivery",
          branch,
          postalCode,
          area: deliveryArea,
          deliveryDate,
          deliveryTime,
          deliveryFee,
        }),
      );
      onClose();
      if (redirectToCheckout) navigate("/checkout");
      return;
    }
  };

  if (!open) return null;

  // ── Date tile picker ───────────────────────────────────────────────────────
const TileDatePicker = ({
  label,
  value,
  onChange,
  error,
  disabled = false,
  showAccessError,
  setShowAccessError
}) => {
    const tiles = getTileDates(30);
    return (
      <div className={`space-y-2 ${
  showAccessError ? "border border-red-400 bg-red-50 p-2 rounded-lg" : ""
}`}>
  {showAccessError && (
  <p className="text-xs text-red-600 mt-1">
    ⚠️ Please enter a valid postal code first
  </p>
)}
        <label className="text-sm font-medium">{label}</label>
        <p className="text-xs text-gray-400">
          📅 Earliest available: <span className="font-medium">{getMinDate()}</span>
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tiles.map((d) => {
            const isSelected = value === d.value;
            return (
              <button
                key={d.value}
                type="button"
                disabled={disabled}
                onClick={() => {
if (disabled) {
  setShowAccessError?.(true); // 👈 SAFE CALL
  return;
}
setShowAccessError?.(false);
  onChange(d.value);
}}
                className={`flex-shrink-0 w-[80px] h-[110px] flex flex-col items-center justify-center rounded-2xl border-2 transition-all active:scale-95
                  ${disabled
                    ? "opacity-40 cursor-not-allowed border-gray-100 bg-gray-50"
                    : isSelected
                      ? "border-black bg-white shadow-md"
                      : "border-gray-200 bg-white hover:border-gray-400 cursor-pointer"
                  }`}
              >
                <div className="w-full flex justify-end pr-2 h-4 mb-1">
                  {isSelected && (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7l4 4 6-6" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-[11px] uppercase tracking-wide mb-1 ${isSelected ? "font-bold text-gray-900" : "text-gray-500"}`}>
                  {d.day}
                </span>
                <span className={`text-3xl leading-none ${isSelected ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                  {d.date}
                </span>
                <span className={`text-[11px] uppercase tracking-wide mt-1 ${isSelected ? "font-bold text-gray-900" : "text-gray-500"}`}>
                  {d.month}
                </span>
              </button>
            );
          })}
        </div>
        {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      </div>
    );
  };

  // ── Branch selector (shared) ───────────────────────────────────────────────
  const BranchSelector = () => (
    <div className="space-y-3">
      {branches.map((b) => (
        <button
          key={b.id}
          onClick={() => { setBranch(b); setBranchError(""); }}
          className={`w-full border-2 rounded-xl p-4 text-left transition
            ${branch?.id === b.id
              ? "border-blue-600 bg-blue-50/60"
              : branchError
                ? "border-red-400"
                : "border-gray-200 hover:border-gray-300"
            }`}
        >
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-gray-600 mt-0.5">{b.address}</p>
            </div>
            {branch?.id === b.id && <CheckCircle className="text-blue-600 mt-1" size={20} />}
          </div>
        </button>
      ))}
      {branchError && <p className="text-sm text-red-600">{branchError}</p>}
    </div>
  );

  // ── JSX ────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b shrink-0">
          <div className="flex items-center gap-2.5">
            {step !== "select" && (
              <button
                onClick={() =>
                  step === "delivery_branch" ? setStep("delivery_details") : setStep("select")
                }
                className="p-1.5 -ml-1.5"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="font-semibold text-[17px]">
              {step === "select" && "How would you like to receive your order?"}
              {step === "pickup" && "Pickup Details"}
              {step === "delivery_details" && "Delivery Details"}
              {step === "delivery_branch" && "Select Branch"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 -mr-1.5">
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">

          {/* ── Step: select ── */}
          {step === "select" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <button
                onClick={() => setStep("pickup")}
                className="border rounded-xl p-6 sm:p-8 text-center hover:shadow-md hover:border-blue-600 active:scale-[0.98] transition flex flex-col justify-between"
              >
                <div>
                  <Store className="mx-auto text-blue-700 mb-4" size={40} />
                  <h3 className="font-semibold text-xl">Pickup</h3>
                  <p className="text-sm text-gray-600 mt-2">Self-collect from our store</p>
                </div>
                <div className="mt-6 bg-blue-800 text-yellow-300 py-3 rounded-lg font-semibold">Select</div>
              </button>

              <button
                onClick={() => setStep("delivery_details")}
                className="border rounded-xl p-6 sm:p-8 text-center hover:shadow-md hover:border-blue-600 active:scale-[0.98] transition flex flex-col justify-between"
              >
                <div>
                  <Truck className="mx-auto text-blue-700 mb-4" size={40} />
                  <h3 className="font-semibold text-xl">Delivery</h3>
                  <p className="text-sm text-gray-600 mt-2">Delivered to your doorstep</p>
                </div>
                <div className="mt-6 bg-blue-800 text-yellow-300 py-3 rounded-lg font-semibold">Select</div>
              </button>
            </div>
          )}

          {/* ── Step: pickup ── */}
          {step === "pickup" && (
            <div className="space-y-5">
              <div>
                <p className="font-medium mb-2.5">Select Pickup Store</p>
                <BranchSelector />
              </div>

              <TileDatePicker
                label="Pickup Date"
                value={pickupDate}
                onChange={(v) => { setPickupDate(v); setPickupDateError(""); }}
                error={pickupDateError}
              />

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Pickup Time</label>
                <select
                  value={pickupTime}
                  onChange={(e) => { setPickupTime(e.target.value); setPickupTimeError(""); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {pickupTimeError && <p className="text-xs text-red-600">{pickupTimeError}</p>}
              </div>
            </div>
          )}

          {/* ── Step: delivery_details ── */}
          {step === "delivery_details" && (
            <div className="space-y-5">
              {/* Postal code */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Postal Code</label>
                <input
                  value={postalCode}
                  onChange={handlePostalChange}
                  maxLength={6}
                  placeholder="Enter 6-digit postal code"
                  className={`w-full border rounded-lg px-3 py-2.5 focus:outline-none transition
                    ${postalStatus === "error"
                      ? "border-red-400 focus:border-red-500"
                      : postalStatus === "success"
                        ? "border-green-400 focus:border-green-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                />
                {postalStatus === "checking" && <p className="text-xs text-gray-500">Checking availability…</p>}
                {postalStatus === "success" && <p className="text-xs text-green-600">✓ {postalMessage}</p>}
                {postalStatus === "error" && <p className="text-xs text-red-600">✕ {postalMessage}</p>}
              </div>

              {/* Delivery fee badge */}
              {postalStatus === "success" && deliveryFee !== null && (
                <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl text-sm">
                  Delivery Fee:{" "}
                  <span className="font-semibold">
                    {deliveryFee === 0 ? "🎉 Free" : `S$${deliveryFee}`}
                  </span>
                </div>
              )}

             {/* 👇 Show message BEFORE date */}
{postalStatus !== "success" && (
  <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-500">
    📍 Enter a valid postal code to select delivery date & time
  </div>
)}

<TileDatePicker
  label="Delivery Date"
  value={deliveryDate}
  onChange={(v) => {
    setDeliveryDate(v);
    setDeliveryDateError("");
    setDeliveryAccessError(false);
  }}
  error={deliveryDateError}
  disabled={postalStatus !== "success"}
  showAccessError={deliveryAccessError}
  setShowAccessError={setDeliveryAccessError}
/>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Delivery Time</label>
                <select
                  value={deliveryTime}
                  disabled={postalStatus !== "success"}
                  onChange={(e) => { setDeliveryTime(e.target.value); setDeliveryTimeError(""); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base disabled:bg-gray-100 disabled:cursor-not-allowed focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {deliveryTimeError && <p className="text-xs text-red-600">{deliveryTimeError}</p>}
              </div>

              {postalStatus !== "success" && (
                <p className="text-xs text-gray-400 text-center">Enter a valid postal code to select date & time</p>
              )}
            </div>
          )}

          {/* ── Step: delivery_branch ── */}
          {step === "delivery_branch" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-1">Which branch should handle your delivery?</p>
              <BranchSelector />
            </div>
          )}
        </div>

        {/* FOOTER */}
        {step !== "select" && (
          <div className="border-t px-4 py-4 shrink-0">
            <button
              onClick={saveAndClose}
              className="w-full bg-blue-800 text-yellow-300 py-3.5 rounded-xl font-semibold text-[17px] active:scale-[0.98] transition"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FulfillmentModal;