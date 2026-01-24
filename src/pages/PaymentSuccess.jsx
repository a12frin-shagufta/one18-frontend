import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext"; // ✅ ADD

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { clearCart } = useCart(); // ✅ ADD

  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

        if (!sessionId) {
          setMsg("Session ID missing ❌");
          setLoading(false);
          return;
        }

        // ✅ verify on backend
        const res = await axios.post(`${BACKEND_URL}/api/payment/verify`, {
          sessionId,
        });

        setMsg(res.data.message || "Payment successful ✅");

        // ✅ clear cart ✅✅✅
        clearCart();

        // ✅ clear checkout temp storage
        localStorage.removeItem("fulfillmentData");
        localStorage.removeItem("orderNote");
        localStorage.removeItem("checkoutCustomer");

        setLoading(false);

        // ✅ auto redirect after 2 sec
        setTimeout(() => navigate("/confirmation"), 2000);
      } catch (err) {
        setMsg(err.response?.data?.message || "Payment verification failed ❌");
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, navigate, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border rounded-2xl p-6 text-center shadow">
        <h1 className="text-2xl font-bold mb-2">
          {loading ? "Verifying Payment..." : "Payment Status"}
        </h1>
        <p className="text-gray-600">{msg}</p>

        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-black text-white px-6 py-3 rounded-full"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
