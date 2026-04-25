import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [previousOrder, setPreviousOrder] = useState(() => {
    const saved = localStorage.getItem('previousOrder');
    return saved ? JSON.parse(saved) : null;
  });

  const [orderInfo, setOrderInfo] = useState(() => {
    const saved = localStorage.getItem('orderInfo');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('previousOrder', JSON.stringify(previousOrder));
  }, [previousOrder]);

  useEffect(() => {
    localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
  }, [orderInfo]);

  const addToCart = (item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const placeOrderSuccess = (orderData) => {
    // Move current cart items to previousOrder
    if (previousOrder) {
      setPreviousOrder({
        ...previousOrder,
        items: [...previousOrder.items, ...cartItems],
        total: previousOrder.total + getCartTotal()
      });
    } else {
      setPreviousOrder({
        items: [...cartItems],
        total: getCartTotal()
      });
    }
    
    // Only set orderInfo if it's the first time, or update it
    setOrderInfo(orderData);
    setCartItems([]);
  };

  const cancelCurrentOrder = () => {
    setPreviousOrder(null);
    setOrderInfo(null);
    setCartItems([]);
  };

  const getCartTotal = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const getCartCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      previousOrder,
      orderInfo,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      placeOrderSuccess,
      cancelCurrentOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};
