import React, { useState, useMemo, useEffect } from "react";
import { X, Store, Truck, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
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
  "07:30", "08:30", "09:30", "10:30", "11:30",
  "12:30", "13:30", "14:30", "15:30", "16:30",
  "17:30", "18:30", "19:00",
];

// ── Festive date constants ────────────────────────────────────────────────────
const FESTIVE_YEAR = new Date().getFullYear();
// ✅ NEW — only 17 and 18 (1 day advance)
const FESTIVE_DATES = [
  { value: `${FESTIVE_YEAR}-03-17`, day: "TUE", date: 17, month: "MAR", label: null },
  { value: `${FESTIVE_YEAR}-03-18`, day: "WED", date: 18, month: "MAR", label: null },
];

// ── Component ─────────────────────────────────────────────────────────────────
const FulfillmentModal = ({ open, onClose, redirectToCheckout }) => {
  const { orders } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [deliveryDateError, setDeliveryDateError] = useState("");
  const [postalStatus, setPostalStatus] = useState("idle");
  const [postalMessage, setPostalMessage] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const cartSubtotal = useMemo(
    () => Object.values(orders).reduce((sum, item) => sum + item.price * item.qty, 0),
    [orders]
  );

  const hasFestiveCookies = useMemo(
  () => Object.values(orders).some((item) => !!item.festival),
  [orders]
);
  console.log("🍪 hasFestiveCookies:", hasFestiveCookies);
console.log("🛒 orders:", JSON.stringify(Object.values(orders).map(i => ({ name: i.name, festival: i.festival })), null, 2));

  // ── Auto-default dates when festive cookies enter cart ────────────────────
  useEffect(() => {
    if (!hasFestiveCookies) return;
    if (!FESTIVE_DATES.map((d) => d.value).includes(pickupDate)) {
      setPickupDate(FESTIVE_DATES[0].value);
      setPickupDateError("");
    }
    if (!FESTIVE_DATES.map((d) => d.value).includes(deliveryDate)) {
      setDeliveryDate(FESTIVE_DATES[0].value);
      setDeliveryDateError("");
    }
  }, [hasFestiveCookies]);

  // ── Re-validate postal when subtotal changes ──────────────────────────────
  useEffect(() => {
    if (postalCode.length === 6) {
      handlePostalChange({ target: { value: postalCode } });
    }
  }, [cartSubtotal]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handlePostalChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPostalCode(value);
    setPostalStatus("idle");
    setPostalMessage("");
    setDeliveryFee(null);
    if (value.length !== 6) return;
    setPostalStatus("checking");
    try {
      const res = await axios.post(`${BACKEND_URL}/api/delivery/check`, {
        postalCode: value,
        subtotal: cartSubtotal,
      });
      setPostalStatus("success");
      setDeliveryFee(res.data.deliveryFee);
      setPostalMessage(`Delivering to ${res.data.area} • Fee S$${res.data.deliveryFee}`);
    } catch (err) {
      setPostalStatus("error");
      setPostalMessage(err.response?.data?.message || "Delivery not available");
    }
  };

  const saveAndClose = () => {
  if (step === "pickup") {
  if (!branch) { setBranchError("Please choose a branch"); return; }
  if (!pickupDate) { setPickupDateError("Please select a pickup date"); return; }

  // ← ADD THIS CHECK
  if (pickupDate < getMinDate()) {
    setPickupDateError("Pickup must be at least 3 days in advance");
    return;
  }

  if (!pickupTime) return;
}

 if (step === "delivery_details") {
  if (!postalCode || postalStatus !== "success") return;

  // ← ADD THIS CHECK
  if (deliveryDate < getMinDate()) {
    setDeliveryDateError("Delivery must be at least 3 days in advance");
    return;
  }

  if (!deliveryDate || !deliveryTime) return;
  setStep("delivery_branch");
  return;
}
    const area = postalMessage?.includes("Delivering to ")
      ? postalMessage.replace("Delivering to ", "")
      : "";

    localStorage.setItem(
      "fulfillmentData",
      JSON.stringify({
        type: step.startsWith("delivery") ? "delivery" : step,
        branch,
        pickupDate,
        pickupTime,
        postalCode,
        deliveryDate,
        deliveryTime,
        deliveryFee,
        area,
      })
    );

    onClose();
    if (redirectToCheckout) navigate("/checkout");
  };

  // Returns today + 3 days in YYYY-MM-DD format (local time)
const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
};

  if (!open) return null;

  // ── Sub-components ─────────────────────────────────────────────────────────

  const FestiveNotice = () => (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-4 text-sm text-amber-900 leading-relaxed">
      <p className="font-semibold mb-2">Important Notice</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Self-collection is preferred to maintain the best condition of the treats.</li>
        <li>Delivery is available upon request. Slight crumb movement may occur during transit.</li>
        <li>All payments made are non-refundable.</li>
      </ul>
    </div>
  );

  const FestiveDateBanner = () => (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800">
      🎉 Festive cookies are available until
      <strong> 18 March {FESTIVE_YEAR}</strong>
    </div>
  );

  /** Tile-based date picker — only shows the 3 festive dates */
  const FestiveDatePicker = ({ label, value, onChange, error }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex gap-">
        {FESTIVE_DATES.map((d) => {
          const isSelected = value === d.value;
          return (
            <button
              key={d.value}
              type="button"
              onClick={() => onChange(d.value)}
              className={`w-[95px] h-[120px] flex flex-col items-center justify-center rounded-2xl border-2 transition-all active:scale-95 shadow-sm
  ${isSelected
    ? "border-black bg-white shadow-md"
    : "border-gray-200 bg-white hover:border-gray-400"
  }`}
            >
              {/* Checkmark row */}
              <div className="w-full flex justify-end pr-2 h-4 mb-1">
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7l4 4 6-6"
                      stroke="#111"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Day label (TODAY / TUE / WED) */}
             {/* Day label */}
<span
  className={`text-[11px] uppercase tracking-wide mb-1
  ${isSelected ? "font-bold text-gray-900" : "text-gray-500"}`}
>
  {d.label ?? d.day}
</span>

{/* Date number */}
<span
  className={`text-4xl leading-none
  ${isSelected ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}
>
  {d.date}
</span>

{/* Month */}
<span
  className={`text-[11px] uppercase tracking-wide mt-1
  ${isSelected ? "font-bold text-gray-900" : "text-gray-500"}`}
>
  {d.month}
</span>
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );

  /** Normal free-form date input used when no festive cookies in cart */
const NormalDatePicker = ({ label, value, onChange, disabled = false, error }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium">{label}</label>
    <input
      type="date"
      value={value}
      min={getMinDate()}  
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border rounded-lg px-3 py-2.5 text-base disabled:bg-gray-100 focus:outline-none
        ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-blue-500"}`}
    />
    {error && <p className="text-xs text-red-600">{error}</p>}
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
                  step === "delivery_branch"
                    ? setStep("delivery_details")
                    : setStep("select")
                }
                className="p-1.5 -ml-1.5"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="font-semibold text-[17px]">
              {step === "select" && "Select your preference"}
              {step === "pickup" && "Pickup"}
              {step.startsWith("delivery") && "Delivery"}
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
                  <p className="text-sm text-gray-600 mt-2">Self-collect and beat the queue</p>
                </div>
                <div className="mt-6 bg-blue-800 text-yellow-300 py-3 rounded-lg font-semibold">
                  Select
                </div>
              </button>

              <button
                onClick={() => setStep("delivery_details")}
                className="border rounded-xl p-6 sm:p-8 text-center hover:shadow-md hover:border-blue-600 active:scale-[0.98] transition flex flex-col justify-between"
              >
                <div>
                  <Truck className="mx-auto text-blue-700 mb-4" size={40} />
                  <h3 className="font-semibold text-xl">Delivery</h3>
                  <p className="text-sm text-gray-600 mt-2">Delivered right to your doorstep</p>
                </div>
                <div className="mt-6 bg-blue-800 text-yellow-300 py-3 rounded-lg font-semibold">
                  Select
                </div>
              </button>
            </div>
          )}

          {/* ── Step: pickup ── */}
          {step === "pickup" && (
            <div className="space-y-5">
              {/* Branch selection */}
              <div>
                <p className="font-medium mb-2.5">Select Pickup Store</p>
                <div className="space-y-3">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setBranch(b); setBranchError(""); }}
                      className={`w-full border-2 rounded-xl p-4 text-left transition
                        ${branch?.id === b.id
                          ? "border-blue-600 bg-blue-50/60"
                          : branchError
                            ? "border-red-500"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <p className="font-medium">{b.name}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{b.address}</p>
                        </div>
                        {branch?.id === b.id && (
                          <CheckCircle className="text-blue-600 mt-1" size={20} />
                        )}
                      </div>
                    </button>
                  ))}
                  {branchError && (
                    <p className="text-sm text-red-600">{branchError}</p>
                  )}
                </div>
              </div>

              {/* Festive banners */}
              {hasFestiveCookies && <FestiveDateBanner />}
              {hasFestiveCookies && <FestiveNotice />}

              {/* Date picker — tile for festive, normal input otherwise */}
              {hasFestiveCookies ? (
                <FestiveDatePicker
                  label="Pickup Date"
                  value={pickupDate}
                  onChange={(v) => { setPickupDate(v); setPickupDateError(""); }}
                  error={pickupDateError}
                />
              ) : (
                <NormalDatePicker
                  label="Pickup Date"
                  value={pickupDate}
                  onChange={setPickupDate}
                  error={pickupDateError}
                />
              )}

              {/* Time slot */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Pickup Time</label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
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
                  placeholder="Enter 6 digit postal"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:border-blue-500 focus:outline-none"
                />
                {postalStatus === "checking" && (
                  <p className="text-xs text-gray-500">Checking…</p>
                )}
                {postalStatus === "success" && (
                  <p className="text-xs text-green-600">{postalMessage}</p>
                )}
                {postalStatus === "error" && (
                  <p className="text-xs text-red-600">{postalMessage}</p>
                )}
              </div>

              {/* Festive banners */}
              {hasFestiveCookies && <FestiveDateBanner />}
              {hasFestiveCookies && <FestiveNotice />}

              {/* Date picker — tile for festive, normal input otherwise */}
              {hasFestiveCookies ? (
                <FestiveDatePicker
                  label="Delivery Date"
                  value={deliveryDate}
                  onChange={(v) => { setDeliveryDate(v); setDeliveryDateError(""); }}
                  error={deliveryDateError}
                />
              ) : (
                <NormalDatePicker
                  label="Delivery Date"
                  value={deliveryDate}
                  onChange={setDeliveryDate}
                  disabled={postalStatus !== "success"}
                  error={deliveryDateError}
                />
              )}

              {/* Time slot */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Delivery Time</label>
                <select
                  value={deliveryTime}
                  disabled={postalStatus !== "success"}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base disabled:bg-gray-100 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Delivery fee */}
              {postalStatus === "success" && deliveryFee !== null && (
                <div className="bg-gray-50 p-3.5 rounded-xl text-base">
                  Delivery Fee:{" "}
                  <span className="font-semibold">
                    {deliveryFee === 0 ? "Free" : `S$${deliveryFee}`}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* ── Step: delivery_branch ── */}
          {step === "delivery_branch" && (
            <div className="space-y-5">
              <p className="font-medium mb-2.5">Select Delivery Branch</p>
              <div className="space-y-3">
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBranch(b)}
                    className={`w-full border-2 rounded-xl p-4 text-left transition
                      ${branch?.id === b.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="font-medium">{b.name}</p>
                        <p className="text-sm text-gray-600">{b.address}</p>
                      </div>
                      {branch?.id === b.id && (
                        <CheckCircle className="text-blue-600 mt-1" size={20} />
                      )}
                    </div>
                  </button>
                ))}
              </div>
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