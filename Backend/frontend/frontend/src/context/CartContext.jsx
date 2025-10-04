import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    const exists = items.find((i) => i.id === item.id);
    if (exists) {
      setItems(items.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setItems([...items, { ...item, quantity: 1 }]);
    }
  };

  const removeItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  // You will want to add updateQuantity as well:
  const updateQuantity = (itemId, quantity) => {
    if (quantity < 1) {
      removeItem(itemId);
    } else {
      setItems(items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, updateQuantity, total }}>
      {children}
    </CartContext.Provider>
  );
};
