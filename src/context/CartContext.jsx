import { createContext, useContext, useEffect, useState , useMemo } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    // ✅ Load cart on refresh
    const saved =
  localStorage.getItem("cart") ||
  localStorage.getItem("guestCart_v2");

return saved ? JSON.parse(saved) : {};
    return saved ? JSON.parse(saved) : {};
  });

  // ✅ Save cart on every change
useEffect(() => {
  localStorage.setItem("cart", JSON.stringify(orders));
  localStorage.setItem("guestCart_v2", JSON.stringify(orders)); // keep both synced
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

  // CartContext.jsx — already saves on every change via useEffect, that's fine.
// The real fix is in ProductDetail.jsx — add a small flush:



  return (
    <CartContext.Provider value={{ orders, setOrders, clearCart , totalItems}}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
 