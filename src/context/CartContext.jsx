import { createContext, useContext, useState, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [orders, setOrders] = useState({});

  const totalItems = useMemo(() => {
    return Object.values(orders).reduce((sum, item) => sum + item.qty, 0);
  }, [orders]);

  return (
    <CartContext.Provider value={{ orders, setOrders, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
