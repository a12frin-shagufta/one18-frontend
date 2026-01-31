import React, { useState } from "react";
import { X, Store, Truck, ArrowLeft, CheckCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const branches = [
  {
    id: "tampines",
    name: "One18 Bakery Tampines",
    address: "826 Tampines Street 81, Singapore 520826",
  },
  {
    id: "northbridge",
    name: "One18 Bakery North Bridge",
    address: "North Bridge Road, Singapore",
  },
];

const timeSlots = [
  "07:30", "08:30", "09:30", "10:30",
  "11:30", "12:30", "13:30", "14:30",
  "15:30", "16:30", "17:30", "18:30", "19:00",
];

const FulfillmentModal = ({ open, onClose, redirectToCheckout }) => {
  if (!open) return null;

  const [step, setStep] = useState("select");
  const navigate = useNavigate();

  const [branch, setBranch] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const [pickupDateError, setPickupDateError] = useState("");
  const [deliveryDateError, setDeliveryDateError] = useState("");
  const [postalStatus, setPostalStatus] = useState("idle"); // idle | error | success | checking
  const [postalMessage, setPostalMessage] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(null);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split("T")[0];
  };

  const minDate = getMinDate();

  const saveAndClose = () => {
    if (step === "pickup" && (!branch || !pickupDate || !pickupTime)) return;
    if (step === "delivery" && (!postalCode || !deliveryDate || !deliveryTime || postalStatus !== "success")) return;

    const area = postalMessage?.includes("Delivering to ")
      ? postalMessage.replace("Delivering to ", "")
      : "";

    localStorage.setItem(
      "fulfillmentData",
      JSON.stringify({
        type: step,
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

  const handlePostalChange = async (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setPostalCode(value);

    setPostalStatus("idle");
    setPostalMessage("");
    setDeliveryFee(null);

    if (value.length !== 6) return;

    setPostalStatus("checking");

    try {
      const res = await axios.post(`${BACKEND_URL}/api/postal/validate`, { postalCode: value });
      if (res.data.valid) {
        setPostalStatus("success");
        setPostalMessage(res.data.area ? `Delivering to ${res.data.area}` : "Postal code accepted");

        try {
          const feeRes = await axios.post(`${BACKEND_URL}/api/delivery/check`, { postalCode: value });
          setDeliveryFee(feeRes.data.deliveryFee);
        } catch {
          setDeliveryFee(10); // fallback
        }
      } else {
        setPostalStatus("error");
        setPostalMessage("Invalid or undeliverable postal code");
      }
    } catch {
      setPostalStatus("error");
      setPostalMessage("Cannot check right now");
    }
  };

  const handleDateChange = (value, setter, errorSetter) => {
    if (!value) {
      setter("");
      errorSetter("");
      return;
    }
    if (new Date(value) < new Date(minDate)) {
      setter("");
      errorSetter("Date must be at least 3 days from today");
      return;
    }
    setter(value);
    errorSetter("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col max-h-[92vh] sm:max-h-[90vh] overflow-hidden">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b shrink-0">
          <div className="flex items-center gap-2.5">
            {step !== "select" && (
              <button onClick={() => setStep("select")} className="p-1.5 -ml-1.5">
                <ArrowLeft size={20} />
              </button>
            )}
            <h2 className="font-semibold text-[17px]">
              {step === "select" && "Select your preference"}
              {step === "pickup" && "Pickup"}
              {step === "delivery" && "Delivery"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 -mr-1.5">
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-5">

          {step === "select" && (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

             <button
  onClick={() => setStep("pickup")}
  className="border rounded-xl p-6 sm:p-8 text-center hover:shadow-md hover:border-blue-600 active:scale-[0.98] transition flex flex-col justify-between"
>
  <div>
    <Store className="mx-auto text-blue-700 mb-4" size={40} />
    <h3 className="font-semibold text-xl">Pickup</h3>
    <p className="text-sm text-gray-600 mt-2">
      Self-collect and beat the queue
    </p>
  </div>

  <div className="mt-6 bg-blue-800 text-yellow-300 py-3 rounded-lg font-semibold">
    Select
  </div>
</button>


              <button
  onClick={() => setStep("delivery")}
  className="border rounded-xl p-6 sm:p-8 text-center hover:shadow-md hover:border-blue-600 active:scale-[0.98] transition flex flex-col justify-between"
>
  <div>
    <Truck className="mx-auto text-blue-700 mb-4" size={40} />
    <h3 className="font-semibold text-xl">Delivery</h3>
    <p className="text-sm text-gray-600 mt-2">
      Delivered right to your doorstep
    </p>
  </div>

  <div className="mt-6 bg-blue-800 text-yellow-300 py-3 rounded-lg font-semibold">
    Select
  </div>
</button>

            </div>
          )}

          {step === "pickup" && (
            <div className="space-y-5">
              <div>
                <p className="font-medium mb-2.5">Select Pickup Store</p>
                <div className="space-y-3">
                  {branches.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => setBranch(b)}
                      className={`w-full border-2 rounded-xl p-4 text-left transition
                        ${branch?.id === b.id
                          ? "border-blue-600 bg-blue-50/60"
                          : "border-gray-200 hover:border-gray-300"}`}
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
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Pickup Date</label>
                <input
                  type="date"
                  min={minDate}
                  value={pickupDate}
                  onChange={(e) => handleDateChange(e.target.value, setPickupDate, setPickupDateError)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-base
                    ${pickupDateError ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                />
                {pickupDateError && (
                  <p className="text-xs text-red-600">{pickupDateError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Pickup Time</label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base focus:border-blue-500"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === "delivery" && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Postal Code</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Enter 6-digit postal code"
                    value={postalCode}
                    onChange={handlePostalChange}
                    maxLength={6}
                    inputMode="numeric"
                    className={`w-full pl-10 pr-10 py-2.5 border rounded-lg text-base
                      focus:outline-none focus:ring-2 focus:ring-blue-400
                      ${postalStatus === "error"   ? "border-red-500 bg-red-50" : ""}
                      ${postalStatus === "success" ? "border-green-500 bg-green-50" : ""}
                      ${postalStatus === "checking" ? "border-yellow-500" : "border-gray-300"}`}
                  />
                  {postalCode && (
                    <button
                      onClick={() => {
                        setPostalCode("");
                        setPostalStatus("idle");
                        setPostalMessage("");
                        setDeliveryFee(null);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {postalStatus === "checking" && (
                  <p className="text-xs text-yellow-700">Checking...</p>
                )}
                {postalStatus === "success" && postalMessage && (
                  <p className="text-sm text-green-700 font-medium">{postalMessage}</p>
                )}
                {postalStatus === "error" && (
                  <p className="text-xs text-red-600">{postalMessage}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Delivery Date</label>
                <input
                  type="date"
                  min={minDate}
                  value={deliveryDate}
                  disabled={postalStatus !== "success"}
                  onChange={(e) => handleDateChange(e.target.value, setDeliveryDate, setDeliveryDateError)}
                  className={`w-full border rounded-lg px-3 py-2.5 text-base disabled:bg-gray-100
                    ${deliveryDateError ? "border-red-500" : "border-gray-300 focus:border-blue-500"}`}
                />
                {deliveryDateError && (
                  <p className="text-xs text-red-600">{deliveryDateError}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Delivery Time</label>
                <select
                  value={deliveryTime}
                  disabled={postalStatus !== "success"}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-base disabled:bg-gray-100 focus:border-blue-500"
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {postalStatus === "success" && deliveryFee !== null && (
                <div className="bg-gray-50 p-3.5 rounded-xl text-base">
                  Delivery Fee: <span className="font-semibold">
                    {deliveryFee === 0 ? "Free" : `S$${deliveryFee}`}
                  </span>
                </div>
              )}
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