import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ clear saved checkout data (optional)
    localStorage.removeItem("fulfillmentData");
    localStorage.removeItem("checkoutCustomer");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow border text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Order Confirmed 🎉
        </h1>

        <p className="text-gray-600 mt-2">
          Thank you! Your order has been placed successfully.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/menu")}
            className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-900"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full border py-3 rounded-full font-semibold hover:bg-gray-100"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
