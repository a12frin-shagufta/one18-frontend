import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const ThankYou = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Top success accent */}
        <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

        <div className="p-8 sm:p-10 text-center">
          {/* Blue verified tick - Paytm style */}
          <div className="mx-auto mb-6 relative">
            <div className="w-24 h-24 mx-auto bg-blue-50 rounded-full flex items-center justify-center">
              <CheckCircle 
                className="w-16 h-16 text-blue-600" 
                strokeWidth={2.5}
              />
            </div>
            
            {/* Optional subtle ring/pulse effect */}
            <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-pulse-slow" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Thank You!
          </h1>

          <div className="space-y-4 mb-8">
            <p className="text-lg font-medium text-gray-700">
              Your order has been received 🎉
            </p>

            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              <CheckCircle className="w-5 h-5" />
              <span>Payment proof received</span>
            </div>

            <p className="text-gray-600 leading-relaxed">
              Your payment will be verified shortly.<br />
              You’ll receive an email confirmation once it’s confirmed.
            </p>

            {state?.orderId && (
              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Order ID
                </p>
                <p className="font-mono font-medium text-gray-900 mt-1">
                  {state.orderId}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-black hover:bg-gray-900 text-white font-medium py-4 px-8 rounded-2xl transition-colors duration-200 shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            Back to Home
          </button>

          <p className="mt-6 text-xs text-gray-500">
            We'll keep you updated — check your email (including spam folder)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;