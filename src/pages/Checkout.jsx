import React, { useMemo, useState } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatPrice, DELIVERY_FEE } from "../utils/currency";
import {
  Truck,
  Store,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageSquare,
  Package,
  ChevronRight,
  Clock,
  Home,
} from "lucide-react";

const Checkout = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { orders, setOrders } = useCart();
  const items = Object.values(orders);
  const [pickupTime, setPickupTime] = useState("");

  /* =====================
     ORDER TYPE
  ====================== */
  const [orderType, setOrderType] = useState("delivery");

  /* =====================
     CUSTOMER
  ====================== */
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  /* =====================
     DELIVERY
  ====================== */
  const [deliveryAddress, setDeliveryAddress] = useState({
    address: "",
    postalCode: "",
  });

  /* =====================
     CALCULATIONS
  ====================== */
  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.qty),
      0
    );
  }, [items]);

  const deliveryFee = orderType === "delivery" ? DELIVERY_FEE : 0;
  const totalAmount = subtotal + deliveryFee;

  /* =====================
     PLACE ORDER
  ====================== */
  const placeOrder = async () => {
    if (orderType === "pickup" && !pickupTime) {
      alert("Please select pickup time");
      return;
    }

    if (!customer.name || !customer.phone) {
      alert("Please enter name and phone number");
      return;
    }

    if (orderType === "delivery" && !deliveryAddress.address) {
      alert("Please enter delivery address");
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/orders`, {
        orderType,
        customer,
        deliveryAddress: orderType === "delivery" ? deliveryAddress : null,
        pickupLocation:
          orderType === "pickup"
            ? {
                name: "One18 Bakery - Main Outlet",
                pickupTime,
              }
            : null,
        items: items.map((item) => ({
          productId: item.itemId,
          name: item.name,
          variant: item.variant,
          qty: item.qty,
          price: item.price,
        })),
        subtotal,
        deliveryFee,
        totalAmount,
      });

      alert("Order placed successfully 🎉");
      setOrders({});
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
  <div className="min-h-screen bg-white pb-40">
    {/* HEADER */}
    <div className="px-6 pt-8 pb-4 max-w-5xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-serif text-gray-900">
        Checkout
      </h1>
      <p className="text-sm text-gray-600 mt-1">
        Almost there — just a few details 💛
      </p>
    </div>

    <div className="max-w-5xl mx-auto px-6 space-y-14">
      {/* ORDER TYPE */}
      <section>
        <h2 className="text-xl font-serif text-gray-700 mb-4">
          How would you like to receive your order?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setOrderType("delivery")}
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl border transition
              ${
                orderType === "delivery"
                  ? "border-[#1E3A8A] bg-gray-50"
                  : "border-[#1E3A8A] bg-white hover:bg-[#fffaf4]"
              }`}
          >
            <Truck className="w-6 h-6 text-gray-900" />
            <div>
              <p className="font-medium">Home Delivery</p>
              <p className="text-xs text-gray-500">Fresh to your doorstep</p>
            </div>
          </button>

          <button
            onClick={() => setOrderType("pickup")}
            className={`flex items-center gap-4 px-6 py-5 rounded-2xl border transition
              ${
                orderType === "pickup"
                  ? "border-[#5c3a21] bg-[#fffaf4]"
                  : "border-[#e8d8c3] bg-white hover:bg-[#fffaf4]"
              }`}
          >
            <Store className="w-6 h-6 text-[#5c3a21]" />
            <div>
              <p className="font-medium">Store Pickup</p>
              <p className="text-xs text-gray-500">Visit our bakery</p>
            </div>
          </button>
        </div>
      </section>

      {/* CUSTOMER DETAILS */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">
          Your Details
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <input
            placeholder="Full Name"
            className="px-4 py-3 rounded-xl border border-[#1E3A8A] bg-white outline-none"
            value={customer.name}
            onChange={(e) =>
              setCustomer({ ...customer, name: e.target.value })
            }
          />

          <input
            placeholder="Phone Number"
            className="px-4 py-3 rounded-xl border border- bg-white outline-none"
            value={customer.phone}
            onChange={(e) =>
              setCustomer({ ...customer, phone: e.target.value })
            }
          />

          <input
            placeholder="Email (optional)"
            className="px-4 py-3 rounded-xl border border-black bg-white outline-none sm:col-span-2"
            value={customer.email}
            onChange={(e) =>
              setCustomer({ ...customer, email: e.target.value })
            }
          />
        </div>
      </section>

      {/* ADDRESS / PICKUP */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">
          {orderType === "delivery" ? "Delivery Address" : "Pickup Details"}
        </h2>

        {orderType === "delivery" ? (
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              placeholder="Full Address"
              className="px-4 py-3 rounded-xl border border-gray-900 bg-white outline-none sm:col-span-2"
              value={deliveryAddress.address}
              onChange={(e) =>
                setDeliveryAddress({
                  ...deliveryAddress,
                  address: e.target.value,
                })
              }
            />

            <input
              placeholder="Postal Code"
              className="px-4 py-3 rounded-xl border border-gray-900 bg-white outline-none"
              value={deliveryAddress.postalCode}
              onChange={(e) =>
                setDeliveryAddress({
                  ...deliveryAddress,
                  postalCode: e.target.value,
                })
              }
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-[#fffaf4] border border-[#e8d8c3] p-5">
            <p className="font-medium">One18 Bakery – Main Outlet</p>
            <p className="text-sm text-gray-600 mt-1">
              Pickup between 8:00 AM – 10:00 PM
            </p>
          </div>
        )}
      </section>

      {/* ORDER SUMMARY */}
      <section>
        <h2 className="text-xl font-serif text-gray-900 mb-4">
          Your Order
        </h2>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.variant} × {item.qty}
                </p>
              </div>
              <span className="font-medium">
                {formatPrice(item.price * item.qty)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* TOTAL */}
      <section className="border-t border-[#e8d8c3] pt-6">
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span className="text-gray-900">
            {formatPrice(totalAmount)}
          </span>
        </div>
      </section>
    </div>

    {/* FIXED CTA */}
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-800 p-4">
      <button
        onClick={placeOrder}
        className="w-full bg-[#1E3A8A] text-white py-4 rounded-full text-lg font-medium"
      >
        Place Order • {formatPrice(totalAmount)}
      </button>
    </div>
  </div>
);

};

export default Checkout;