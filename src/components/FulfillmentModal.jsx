import React, { useState, useEffect, useRef } from "react";

import { X, Store, Truck, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Search, AlertCircle } from "lucide-react";
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
  "07:30","08:30","09:30","10:30",
  "11:30","12:30","13:30","14:30",
  "15:30","16:30","17:30","18:30","19:00",
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
  const [noResults, setNoResults] = useState(false);

  
  const postalInputRef = useRef(null);

  



const [postalStatus, setPostalStatus] = useState("idle"); 
// idle | error | success | checking
const [postalMessage, setPostalMessage] = useState("");
const [deliveryFee, setDeliveryFee] = useState(null);




 const saveAndClose = () => {
  if (step === "pickup" && (!branch || !pickupDate || !pickupTime)) return;

  if (
    step === "delivery" &&
    (!postalCode || !deliveryDate || !deliveryTime || postalStatus !== "success")
  ) return;

  // Extract area name cleanly
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
      area,               // ← add this
    })
  );

  onClose();

  if (redirectToCheckout) {
    navigate("/checkout");
  }
};

const getMinDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toISOString().split("T")[0];
};



// useEffect(() => {
//   if (!postalInputRef.current || !window.google) return;

//   const autocomplete = new window.google.maps.places.Autocomplete(
//     postalInputRef.current,
//     {
//       types: ["postal_code"],
//       componentRestrictions: { country: "sg" },
//     }
//   );

//   autocomplete.addListener("place_changed", () => {
//     const place = autocomplete.getPlace();

//     const postal = place.address_components?.find(c =>
//       c.types.includes("postal_code")
//     )?.long_name;

//     const area =
//       place.address_components?.find(c =>
//         c.types.includes("neighborhood") ||
//         c.types.includes("sublocality")
//       )?.long_name ||
//       place.address_components?.find(c =>
//         c.types.includes("locality")
//       )?.long_name;

//     if (postal) {
//       setPostalCode(postal);
//       setPostalStatus("success");
//       setPostalMessage(area ? `Delivering to ${area}` : "Postal code selected");
//     }
//   });


// const fetchAddressFromPostal = async (postal) => {
//   try {
//     const res = await fetch(
//       `https://maps.googleapis.com/maps/api/geocode/json?address=${postal}&components=country:SG&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`
//     );

//     const data = await res.json();
//     if (!data.results?.length) return null;

//     const components = data.results[0].address_components;

//     // SG-specific priority
//     const area =
//       components.find(c => c.types.includes("sublocality_level_1"))?.long_name ||
//       components.find(c => c.types.includes("neighborhood"))?.long_name ||
//       components.find(c => c.types.includes("administrative_area_level_3"))?.long_name ||
//       components.find(c => c.types.includes("administrative_area_level_2"))?.long_name;

//     return area || null;
//   } catch {
//     return null;
//   }
// };



 const checkPostalCode = async () => {
  if (postalCode.length !== 6) {
    setPostalStatus("error");
    setPostalMessage("Postal code must be 6 digits");
    setDeliveryFee(null);
    return;
  }

  try {
    setPostalStatus("checking");

    // 1️⃣ REAL validation (Google via backend)
    const postalRes = await axios.post(
      `${BACKEND_URL}/api/postal/validate`,
      { postalCode }
    );

    if (!postalRes.data.valid) {
      setPostalStatus("error");
      setPostalMessage("Invalid Singapore postal code");
      setDeliveryFee(null);
      return;
    }

    // 2️⃣ Delivery fee check
    const feeRes = await axios.post(
      `${BACKEND_URL}/api/delivery/check`,
      { postalCode }
    );

    setDeliveryFee(feeRes.data.deliveryFee);
    setPostalStatus("success");
    setPostalMessage(`Delivering to ${postalRes.data.area}`);

  } catch {
    setPostalStatus("error");
    setPostalMessage("Delivery not available to this postal code");
    setDeliveryFee(null);
  }
};




const isBeforeMinDate = (selectedDate, minDate) => {
  if (!selectedDate) return false;
  return new Date(selectedDate) < new Date(minDate);
};

const minPickupDate = getMinDate();

const handlePickupDateChange = (e) => {
  const selected = e.target.value;

  if (!selected) {
    setPickupDate("");
    setPickupDateError("");
    return;
  }

  if (new Date(selected) < new Date(minPickupDate)) {
    setPickupDate("");
    setPickupDateError("Pickup date must be at least 3 days from today");
    return;
  }

  setPickupDate(selected);
  setPickupDateError("");
};


const minDeliveryDate = getMinDate();

const handleDeliveryDateChange = (e) => {
  const selected = e.target.value;

  if (!selected) {
    setDeliveryDate("");
    setDeliveryDateError("");
    return;
  }

  if (new Date(selected) < new Date(minDeliveryDate)) {
    setDeliveryDate("");
    setDeliveryDateError("Delivery date must be at least 3 days from today");
    return;
  }

  setDeliveryDate(selected);
  setDeliveryDateError("");
};

const handlePostalChange = async (e) => {
  let value = e.target.value.replace(/\D/g, "").slice(0, 6);
  setPostalCode(value);

  // Reset states
  setPostalStatus("idle");
  setPostalMessage("");
  setDeliveryFee(null);
  setNoResults(false);

  if (value.length !== 6) return;

  try {
    setPostalStatus("checking");

    const res = await axios.post(
      `${BACKEND_URL}/api/postal/validate`,
      { postalCode: value }
    );

    if (res.data.valid) {
      setPostalStatus("success");
      setPostalMessage(
        res.data.area
          ? `Delivering to ${res.data.area}`
          : "Postal code accepted"
      );

      // Optional: also get fee (if you want to show fee immediately)
      try {
        const feeRes = await axios.post(
          `${BACKEND_URL}/api/delivery/check`,
          { postalCode: value }
        );
        setDeliveryFee(feeRes.data.deliveryFee);
      } catch (feeErr) {
        console.warn("Fee check failed", feeErr);
        setDeliveryFee(10); // fallback – or leave null
      }
    } else {
      setPostalStatus("error");
      setPostalMessage("Invalid or undeliverable postal code");
    }
  } catch (err) {
    console.error(err);
    setPostalStatus("error");
    setPostalMessage("Cannot check postal code right now");
  }
};



  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center">
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-xl flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            {step !== "select" && (
              <button onClick={() => setStep("select")} className="p-1">
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="font-semibold text-base">
              {step === "select" && "Select your dining preference"}
              {step === "pickup" && "Pickup"}
              {step === "delivery" && "Delivery"}
            </h2>
          </div>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-4 overflow-y-auto flex-1">

          {/* SELECT */}
          {step === "select" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setStep("pickup")}
                  className="border rounded-xl p-5 text-center hover:border-blue-700 transition"
                >
                  <Store className="mx-auto text-blue-700 mb-3" size={32} />
                  <h3 className="font-semibold">Pickup</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Self-collect and beat the queue
                  </p>
                  <div className="mt-4 bg-blue-800 text-yellow-400 py-2 rounded-lg font-semibold">
                    Select
                  </div>
                </button>

                <button
                  onClick={() => setStep("delivery")}
                  className="border rounded-xl p-5 text-center hover:border-blue-700 transition"
                >
                  <Truck className="mx-auto text-blue-700 mb-3" size={32} />
                  <h3 className="font-semibold">Delivery</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Delivered right to your doorstep
                  </p>
                  <div className="mt-4 bg-blue-800 text-yellow-400 py-2 rounded-lg font-semibold">
                    Select
                  </div>
                </button>
              </div>

              <button
                onClick={onClose}
                className="block mx-auto mt-6 text-sm underline text-gray-600"
              >
                I’m just browsing
              </button>
            </>
          )}

          {/* PICKUP */}
          {step === "pickup" && (
            <div className="space-y-4">
              <p className="font-semibold text-sm">Select a Pickup Store</p>

              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBranch(b)}
                  className={`w-full border rounded-xl p-4 text-left relative
                    ${branch?.id === b.id
                      ? "border-blue-700 bg-blue-50"
                      : "border-gray-300"}
                  `}
                >
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold">{b.name}</p>
                      <p className="text-sm text-blue-700">{b.address}</p>
                    </div>
                    {branch?.id === b.id && (
                      <CheckCircle className="text-blue-700" size={20} />
                    )}
                  </div>

                  {branch?.id === b.id && (
                    <div className="mt-3 bg-blue-100 text-blue-800 text-sm rounded-lg px-3 py-2">
                      <p className="font-semibold">Earliest Collection Time</p>
                      <p className="text-sm">
                        Today (01:00 PM – 01:30 PM)
                      </p>
                    </div>
                  )}
                </button>
              ))}

              <div>
  <label className="text-sm font-medium">Pickup Date</label>

  <input
    type="date"
    min={minPickupDate}
    value={pickupDate}
    onChange={handlePickupDateChange}
    className={`mt-1 w-full border rounded-lg p-2
      ${pickupDateError ? "border-red-500" : ""}
    `}
  />

  {pickupDateError && (
    <p className="mt-1 text-sm text-red-600">
      {pickupDateError}
    </p>
  )}
</div>


              <div>
                <label className="text-sm font-medium">Pickup Time</label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="mt-1 w-full border rounded-lg p-2"
                >
                  <option value="">Select time</option>
                  {timeSlots.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* DELIVERY */}
          {/* DELIVERY */}


          {step === "delivery" && (
  <div className="space-y-5">

    {/* POSTAL CODE INPUT + STATUS */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">
        Postal Code
      </label>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        
        <input
          type="text"
          placeholder="Enter 6-digit postal code"
          value={postalCode}
          onChange={handlePostalChange}
          maxLength={6}
          className={`w-full pl-9 pr-9 py-2.5 border rounded-lg text-sm
            focus:outline-none focus:ring-1 focus:ring-blue-500
            ${postalStatus === "error"   ? "border-red-500 bg-red-50" : ""}
            ${postalStatus === "success" ? "border-green-500 bg-green-50" : ""}
            ${postalStatus === "checking" ? "border-yellow-500" : "border-gray-300"}
          `}
        />

        {postalCode && (
          <button
            onClick={() => {
              setPostalCode("");
              setPostalStatus("idle");
              setPostalMessage("");
              setDeliveryFee(null);
              setNoResults(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Status messages */}
      {postalStatus === "checking" && (
        <p className="text-xs text-yellow-600 pl-1">Checking availability...</p>
      )}

      {postalStatus === "success" && postalMessage && (
        <p className="text-xs text-green-700 pl-1 font-medium">{postalMessage}</p>
      )}

      {postalStatus === "error" && (
        <p className="text-xs text-red-600 pl-1">
          {postalMessage || "Delivery not available to this postal code"}
        </p>
      )}

      {noResults && postalStatus !== "error" && (
        <p className="text-xs text-red-600 pl-1">No results found</p>
      )}
    </div>

    {/* Delivery Date */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Delivery Date</label>
      <input
        type="date"
        min={minDeliveryDate}
        value={deliveryDate}
        disabled={postalStatus !== "success"}
        onChange={handleDeliveryDateChange}
        className={`w-full border rounded-lg p-2.5 text-sm disabled:bg-gray-100
          ${deliveryDateError ? "border-red-500" : "border-gray-300"}`}
      />
      {deliveryDateError && (
        <p className="text-xs text-red-600">{deliveryDateError}</p>
      )}
    </div>

    {/* Delivery Time */}
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-700">Delivery Time</label>
      <select
        value={deliveryTime}
        disabled={postalStatus !== "success"}
        onChange={(e) => setDeliveryTime(e.target.value)}
        className="w-full border rounded-lg p-2.5 text-sm disabled:bg-gray-100"
      >
        <option value="">Select time slot</option>
        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
      </select>
    </div>

    {/* Fee display */}
    {postalStatus === "success" && deliveryFee !== null && (
      <div className="bg-gray-50 p-3 rounded-lg text-sm">
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
          <div className="border-t p-4">
            <button
              onClick={saveAndClose}
              className="w-full bg-blue-800 text-yellow-400 py-3 rounded-xl font-semibold"
            >
              Continue with Selection
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FulfillmentModal;
