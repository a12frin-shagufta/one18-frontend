import React, { useState } from "react";
import { X, Store, Truck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
};

const FulfillmentModal = ({ open, onClose }) => {
  const [step, setStep] = useState("select");
  const navigate = useNavigate();

  const [branch, setBranch] = useState(null);
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  if (!open) return null;

  const saveAndClose = () => {
    if (step === "pickup" && (!branch || !pickupDate || !pickupTime)) {
      alert("Please complete pickup details");
      return;
    }

    if (step === "delivery" && (!postalCode || !deliveryDate || !deliveryTime)) {
      alert("Please complete delivery details");
      return;
    }

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
      })
    );

    onClose();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            {step !== "select" && (
              <button
                onClick={() => setStep("select")}
                className="p-1 rounded hover:bg-gray-100"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-base font-medium">
              {step === "select" && "Select Fulfillment"}
              {step === "pickup" && "Pickup Details"}
              {step === "delivery" && "Delivery Details"}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4">
          {step === "select" && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setStep("pickup")}
                className="p-4 border rounded-lg hover:border-blue-500"
              >
                <Store className="mx-auto mb-2 text-blue-600" size={24} />
                <h3 className="font-medium">Pickup</h3>
                <p className="text-xs text-gray-500">Collect at store</p>
              </button>

              <button
                onClick={() => setStep("delivery")}
                className="p-4 border rounded-lg hover:border-blue-500"
              >
                <Truck className="mx-auto mb-2 text-blue-600" size={24} />
                <h3 className="font-medium">Delivery</h3>
                <p className="text-xs text-gray-500">To your address</p>
              </button>
            </div>
          )}

          {step === "pickup" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Pickup Location
                </label>
                {branches.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBranch(b)}
                    className={`w-full p-3 border rounded text-left mb-1 ${
                      branch?.id === b.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300"
                    }`}
                  >
                    <p className="font-medium">{b.name}</p>
                    <p className="text-xs text-gray-500">{b.address}</p>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pickup Date
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Pickup Time
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === "delivery" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="Enter 6-digit postal code"
                  value={postalCode}
                  onChange={(e) =>
                    setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Date
                </label>
                <input
                  type="date"
                  min={getMinDate()}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Delivery Time
                </label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {step !== "select" && (
          <div className="px-4 py-3 border-t">
            <button
              onClick={saveAndClose}
              className="w-full py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
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