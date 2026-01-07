import React, { useState, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ShoppingCart, 
  ArrowRight,
  Receipt,
  User,
  Phone,
  Hash
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../utils/currency";

const Cart = () => {
  const { orders, setOrders } = useCart();
  const [tableNo, setTableNo] = useState("");
  const [phone, setPhone] = useState("");
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);

  const items = Object.values(orders);
  const navigate = useNavigate();

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );
  }, [items]);

  const handleIncrease = (item) => {
    const key = `${item.itemId}_${item.variant}`;
    setOrders(prev => ({
      ...prev,
      [key]: { ...prev[key], qty: item.qty + 1 }
    }));
  };

  const handleDecrease = (item) => {
    const key = `${item.itemId}_${item.variant}`;
    if (item.qty > 1) {
      setOrders(prev => ({
        ...prev,
        [key]: { ...prev[key], qty: item.qty - 1 }
      }));
    }
  };

  const handleRemove = (item) => {
    const key = `${item.itemId}_${item.variant}`;
    setOrders(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Your Cart</h1>
              <p className="text-sm text-gray-500">{items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {items.length > 0 && (
            <button
              onClick={() => {
                setOrders({});
              }}
              className="text-sm text-red-500 hover:text-red-600 px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-40 px-4">
        {/* Empty State */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-8 max-w-sm">
              Add some delicious items to your cart and let's get started!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Start Ordering
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="space-y-4 mt-6">
              {items.map((item, index) => {
                const key = `${item.itemId}_${item.variant}`;
                const itemTotal = item.price * item.qty;

                return (
                  <div
                    key={key}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-gray-800 text-lg">{item.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">Variant: {item.variant}</p>
                          </div>
                          <button
                            onClick={() => handleRemove(item)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleDecrease(item)}
                              className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="min-w-[40px] text-center font-bold text-lg">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => handleIncrease(item)}
                              className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center hover:bg-blue-100 active:scale-95 transition-all"
                            >
                              <Plus className="w-4 h-4 text-blue-600" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">Item Price</p>
                            <p className="font-bold text-lg text-gray-800">{formatPrice(itemTotal)}</p>
                            <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Customer Details Toggle */}
            <div className="mt-8">
              <button
                onClick={() => setShowCustomerDetails(!showCustomerDetails)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">Customer Details</p>
                    <p className="text-sm text-gray-500">Add table number & phone</p>
                  </div>
                </div>
                <div className={`transition-transform ${showCustomerDetails ? 'rotate-180' : ''}`}>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </button>

              {/* Customer Details Form */}
              {showCustomerDetails && (
                <div className="mt-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="space-y-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Hash className="w-4 h-4" />
                        Table Number (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Table 12"
                        value={tableNo}
                        onChange={(e) => setTableNo(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Phone className="w-4 h-4" />
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="+65 1234 5678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        For order updates and notifications
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Receipt className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">Order Summary</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium text-gray-500">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium text-gray-500">Included</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Estimated Total</span>
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(total)}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Final total calculated at checkout
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="text-left">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-blue-600">{formatPrice(total)}</p>
              </div>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl font-semibold hover:opacity-95 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-center text-gray-500">
              Free delivery on orders above {formatPrice(50)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;