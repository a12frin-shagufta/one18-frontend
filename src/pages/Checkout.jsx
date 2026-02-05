import React, { useMemo, useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/currency";
import { CheckCircle, ChevronLeft, AlertCircle, Loader, X, Upload } from "lucide-react";
import { useLocation } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { DEFAULT_BRANCH } from "../config/defaultBranch";

import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const { orders, clearCart } = useCart();

  const items = Object.values(orders);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("paynow");
const [showPayNowQR, setShowPayNowQR] = useState(false);


  
  const [createdOrderId, setCreatedOrderId] = useState(null);
const [qrCode, setQrCode] = useState(null);

  // const [paymentProof, setPaymentProof] = useState(null);
  // const [isUploading, setIsUploading] = useState(false);

  const location = useLocation();

  const fulfillment = useMemo(() => {
    const data = localStorage.getItem("fulfillmentData");
    return data ? JSON.parse(data) : null;
  }, []);

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    address: "",
    apartment: "",
    postalCode: "",
    
    phone: "65", // ✅ Singapore default
  });

  useEffect(() => {
    const savedCustomer = localStorage.getItem("checkoutCustomer");
    if (!savedCustomer) return;

    const parsed = JSON.parse(savedCustomer);
    delete parsed.postalCode;

    setCustomer((prev) => ({
      ...prev,
      ...parsed,
    }));
  }, []);

  useEffect(() => {
    if (!fulfillment) return;

    if (fulfillment.type === "delivery") {
      setCustomer((prev) => ({
        ...prev,
        postalCode:
          fulfillment.postalCode ||
          fulfillment.postal ||
          fulfillment.zip ||
          "",
      }));
    }
  }, [fulfillment]);

  const requiredFields = useMemo(() => {
    if (fulfillment?.type === "pickup") {
      return ["firstName", "lastName", "email", "phone"];
    }
    return ["firstName", "lastName", "email", "phone", "address", "postalCode"];
  }, [fulfillment?.type]);

  const validateForm = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!customer[field]?.trim()) {
        newErrors[field] = "This field is required";
      }
    });

    if (customer.email && !/^\S+@\S+\.\S+$/.test(customer.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (customer.phone && !/^\d{8,}$/.test(customer.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (fulfillment?.type === "delivery") {
      if (
        customer.postalCode &&
        !/^\d{6}$/.test(customer.postalCode.replace(/\D/g, ""))
      ) {
        newErrors.postalCode = "Singapore postal code must be 6 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [items]);

  const deliveryFee =
    fulfillment?.type === "delivery" ? fulfillment.deliveryFee || 0 : 0;
  const totalAmount = subtotal + deliveryFee;

  const handleInputChange = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const placeOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const fulfillment = JSON.parse(
        localStorage.getItem("fulfillmentData") || "{}",
      );
      const orderNote = localStorage.getItem("orderNote") || "";

      if (!fulfillment?.type) {
        alert("Fulfillment details missing, please go back");
        setIsProcessing(false);
        return;
      }

      const hasPreorderItem = items.some((i) => i.preorder?.enabled === true);
      const orderType = hasPreorderItem ? "PREORDER" : "WALK_IN";
      const branchId =
  fulfillment.type === "pickup"
    ? fulfillment?.branch?._id
    : DEFAULT_BRANCH.id;

console.log("Sending branchId →", branchId);


      const payload = {
         branch: branchId,
        orderType,
        fulfillmentType: fulfillment.type,
        fulfillmentDate:
          fulfillment.type === "pickup"
            ? fulfillment.pickupDate
            : fulfillment.deliveryDate,
        fulfillmentTime:
          fulfillment.type === "pickup"
            ? fulfillment.pickupTime
            : fulfillment.deliveryTime,
        customer: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          company: customer.company,
          phone: customer.phone,
          address: fulfillment.type === "delivery" ? customer.address : "",
          apartment: fulfillment.type === "delivery" ? customer.apartment : "",
          postalCode:
            fulfillment.type === "delivery" ? customer.postalCode : "",
          message: orderNote,
        },
        deliveryAddress:
          fulfillment.type === "delivery"
            ? {
                addressText: customer.address,
               postalCode: customer.postalCode,
              }
            : null,
        pickupLocation:
  fulfillment.type === "pickup"
    ? {
        name: fulfillment?.branch?.name,
        address: fulfillment?.branch?.address,
      }
    : {
        name: DEFAULT_BRANCH.name,
        address: DEFAULT_BRANCH.address,
      },

        items: items.map((i) => ({
          productId: i.itemId,
          name: i.name,
          variant: i.variant,
          price: i.price,
          qty: i.qty,
        })),
        subtotal,
        deliveryFee,
        totalAmount,
      };
   


      if (paymentMethod === "paynow") {
  const res = await axios.post(
    `${BACKEND_URL}/api/orders`,
    {
      ...payload,
      paymentMethod: "paynow"
    }
  );




  const orderId = res.data.order._id;

  setCreatedOrderId(orderId);
  setShowPayNowQR(true);
  setIsProcessing(false);
  return;
}





      if (paymentMethod === "stripe") {
        const res = await axios.post(
          `${BACKEND_URL}/api/payment/create-checkout-session`,
          {
            items: payload.items,
            deliveryFee: payload.deliveryFee,
            orderPayload: {
              ...payload,
              paymentMethod: "stripe",
            },
          },
        );

        if (!res.data?.url) {
          alert("Stripe URL not received");
          return;
        }

        window.location.assign(res.data.url);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed, try again");
      setIsProcessing(false);
    }
  };

  const goBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/menu");
    }
  };

  useEffect(() => {
    const { postalCode, ...safeCustomer } = customer;
    localStorage.setItem("checkoutCustomer", JSON.stringify(safeCustomer));
  }, [customer]);


  useEffect(() => {
  if (!createdOrderId) return;

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  axios
    .get(`${BACKEND_URL}/api/paynow/qr/${createdOrderId}`)
    .then(res => {
      console.log("QR RECEIVED:", res.data);
      setQrCode(res.data.qr);
    })
    .catch(err => {
      console.error("QR fetch failed", err.response?.data || err.message);
      alert("Failed to generate QR");
    });

}, [createdOrderId]);


  // const handleFileUpload = async (file) => {
  //   setIsUploading(true);
  //   try {
  //     const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  //     const formData = new FormData();
  //     formData.append("proof", file);

  //     const uploadRes = await axios.post(
  //       `${BACKEND_URL}/api/payment/upload-proof`,
  //       formData,
  //       { headers: { "Content-Type": "multipart/form-data" } }
  //     );

  //     const proofUrl = uploadRes.data.url;

  //     if (!pendingOrderPayload) {
  //       alert("Order data not ready yet.");
  //       return null;
  //     }

  //     const res = await axios.post(`${BACKEND_URL}/api/orders`, {
  //       ...pendingOrderPayload,
  //       paymentMethod: "paynow",
  //       paymentProof: proofUrl,
  //     });

  //     clearCart();

  //     navigate("/thank-you", {
  //       state: { orderId: res.data.order._id },
  //     });
  //   } catch (err) {
  //     alert(err.response?.data?.message || "Failed to place order");
  //     return null;
  //   } finally {
  //     setIsUploading(false);
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-32">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
                Checkout
              </h1>
              <p className="text-sm text-gray-500">
                Complete your order details
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                1
              </div>
              <h2 className="text-xl font-serif font-semibold text-gray-900">
                Contact Information
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First name *
                  </label>
                  <input
                    id="firstName"
                    value={customer.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    className={`w-full border rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last name *
                  </label>
                  <input
                    id="lastName"
                    value={customer.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    className={`w-full border rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full border rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="example@gmail.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone number *
                  </label>
                  <PhoneInput
  country="sg"
  preferredCountries={["sg"]}
  value={customer.phone}
  onChange={(value) => handleInputChange("phone", value)}
  enableSearch
  inputClass={`!w-full !h-[50px] !rounded-xl !pl-14 !border ${
    errors.phone ? "!border-red-500" : "!border-gray-300"
  }`}
  buttonClass="!border-gray-300 !rounded-l-xl"
  containerClass="w-full"
  dropdownClass="!rounded-xl"
/>


                  {errors.phone && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Delivery Address section */}
          {fulfillment?.type === "delivery" && (
            <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <h2 className="text-xl font-serif font-semibold text-gray-900">
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Singapore Delivery
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        All orders are delivered within Singapore
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    id="address"
                    value={customer.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className={`w-full border rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apartment, suite, etc. (optional)
                    </label>
                    <input
                      value={customer.apartment}
                      onChange={(e) =>
                        handleInputChange("apartment", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                      placeholder="Apt 4B"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code *
                    </label>
                    <div className="relative">
                      <input
                        id="postalCode"
                        value={customer.postalCode || ""}
                        disabled
                        readOnly
                        className="w-full border border-gray-300 bg-gray-100 rounded-xl px-4 py-3"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                    {fulfillment?.area && (
                      <p className="mt-1.5 text-sm text-green-700">
                        Delivering to {fulfillment.area}
                      </p>
                    )}
                    {errors.postalCode && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Delivery Method */}
          {fulfillment && (
            <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {fulfillment?.type === "delivery" ? 3 : 2}
                </div>
                <h2 className="text-xl font-serif font-semibold text-gray-900">
                  {fulfillment.type === "delivery" ? "Delivery Method" : "Pickup Details"}
                </h2>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          fulfillment.type === "delivery"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        {fulfillment.type === "delivery" ? (
                          <span className="text-2xl">🚚</span>
                        ) : (
                          <span className="text-2xl">🏬</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {fulfillment.type === "delivery"
                            ? "Home Delivery"
                            : "Store Pickup"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {fulfillment.type === "delivery"
                            ? `${fulfillment.deliveryDate} • ${fulfillment.deliveryTime}`
                            : `${fulfillment.branch?.name} • ${fulfillment.pickupDate} • ${fulfillment.pickupTime}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {fulfillment.type === "delivery" && (
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                      </p>
                      <p className="text-xs text-gray-500">Delivery fee</p>
                    </div>
                  )}
                </div>

                {fulfillment.type === "delivery" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      Estimated delivery time: 30-45 minutes
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN - Payment & Order Summary */}
        <div className="space-y-6">
          {/* Payment Method */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-medium">
                {fulfillment?.type === "delivery" ? 4 : 3}
              </div>
              <h2 className="text-xl font-serif font-semibold text-gray-900">
                Payment Method
              </h2>
            </div>

            <div className="space-y-3">
              <label
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "paynow"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paynow"
                  checked={paymentMethod === "paynow"}
                  onChange={() => setPaymentMethod("paynow")}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    PayNow (Recommended)
                  </p>
                  <p className="text-sm text-gray-600">
                    Scan QR code to pay
                  </p>
                </div>
                <span className="text-2xl">🇸🇬</span>
              </label>

              <label
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "stripe"
                    ? "border-black bg-gray-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="stripe"
                  checked={paymentMethod === "stripe"}
                  onChange={() => setPaymentMethod("stripe")}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Card Payment</p>
                  <p className="text-sm text-gray-600">Pay securely with card</p>
                </div>
                <span className="text-xl">💳</span>
              </label>
            </div>
          </section>

          {/* Order Summary */}
          <section className="bg-white border border-gray-200 rounded-2xl p-5 md:p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="text-xl font-serif font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => (
                <div
                  key={`${item.itemId}_${item.variant}`}
                  className="flex gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {item.name}
                    </p>
                    {item.variant && (
                      <p className="text-sm text-gray-500">{item.variant}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      ${formatPrice(item.price)} each
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>

              {fulfillment?.type === "delivery" && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Delivery</span>
                  <span
                    className={`font-medium ${
                      deliveryFee === 0 ? "text-green-600" : "text-gray-900"
                    }`}
                  >
                    {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                  </span>
                </div>
              )}

              <div className="pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(totalAmount)}
                    </p>
                    <p className="text-xs text-gray-500">Including GST</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Floating Payment Button - Mobile Responsive */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-white/95 border-t shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">Total amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPrice(totalAmount)}
              </p>
            </div>

            <button
              onClick={placeOrder}
              disabled={isProcessing || items.length === 0}
              className="w-full sm:w-auto sm:max-w-md bg-black hover:bg-gray-900 text-white py-4 px-8 rounded-full text-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative group"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Pay Now</span>
                  <span className="opacity-75">•</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-3">
            By placing your order, you agree to our Terms & Conditions
          </p>
        </div>
      </div>

      {/* PayNow Modal - COMPACT VERSION */}
      {showPayNowQR && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 max-w-md w-full shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setShowPayNowQR(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Pay with PayNow
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Scan QR and complete payment

              </p>

              {/* Compact QR Section */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex-1">
                  <div className="text-center mb-2">
                    <div className="inline-flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {formatPrice(totalAmount)}
                      </span>
                      <span className="text-sm text-gray-500">SGD</span>
                    </div>
                  </div>
                  {qrCode ? (
  <img src={qrCode} className="w-full rounded-lg" />
) : (
  <p>Generating QR...</p>
)}

                  <p className="text-xs text-center text-gray-500 mt-2">
                    Scan with your banking app
                  </p>
                </div>

                {/* Upload Section */}
                {/* <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Upload Payment Proof
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all h-full flex flex-col justify-center ${
                      paymentProof
                        ? "border-green-400 bg-green-50/40"
                        : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/30"
                    }`}
                    onClick={() => !paymentProof && document.getElementById('file-upload').click()}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPaymentProof(file);
                      }}
                      className="hidden"
                    />
                    
                    {paymentProof ? (
                      <div className="space-y-2">
                        <div className="relative mx-auto w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={URL.createObjectURL(paymentProof)}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPaymentProof(null);
                            }}
                            className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs font-medium text-gray-700 truncate">
                          {paymentProof.name}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 py-2">
                        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Upload className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-600">Click to upload</p>
                        <p className="text-xs text-gray-500">
                          JPG, PNG • max 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
  disabled={!createdOrderId}
  onClick={async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

      await axios.put(
  `${BACKEND_URL}/api/orders/${createdOrderId}/mark-paid`
);


      clearCart();

      navigate("/thank-you", {
        state: { orderId: createdOrderId },
      });

    } catch (err) {
      alert("Failed to update payment status");
    }
  }}
  className="w-full py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
>
  I Have Paid
</button>


                <button
                  onClick={() => setShowPayNowQR(false)}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;