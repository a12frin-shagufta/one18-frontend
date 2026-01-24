import { createContext, useContext, useEffect, useState , useMemo } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    // ✅ Load cart on refresh
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : {};
  });

  // ✅ Save cart on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(orders));
  }, [orders]);

  const clearCart = () => {
    setOrders({});
    localStorage.removeItem("cart");
  };
  const totalItems = useMemo(() => {
    return Object.values(orders).reduce(
      (sum, item) => sum + item.qty,
      0
    );
  }, [orders]);

  return (
    <CartContext.Provider value={{ orders, setOrders, clearCart , totalItems}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
 