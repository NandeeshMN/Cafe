import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [userOrders, setUserOrders] = useState(() => {
    const saved = localStorage.getItem('userOrders');
    return saved ? JSON.parse(saved) : [];
  });

  const [tableId, setTableId] = useState(() => {
    return localStorage.getItem('tableId') || null;
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
  }, [userOrders]);

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
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.id === id) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const placeOrderSuccess = (orderData) => {
    // Add the new order to the start of the list
    const newOrder = {
      ...orderData,
      id: orderData.id || orderData.order_number || `ORD-${Math.floor(Math.random() * 10000)}`,
      items: [...cartItems],
      total_amount: getCartTotal(),
      status: 'Preparing',
      created_at: new Date().toISOString()
    };
    
    console.log('Adding new order to local history:', newOrder);
    setUserOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
  };

  const clearOrders = () => {
    setUserOrders([]);
    localStorage.removeItem('userOrders');
  };

  useEffect(() => {
    if (tableId) {
      localStorage.setItem('tableId', tableId);
    }
  }, [tableId]);

  const getCartTotal = () => cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const getCartCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      userOrders,
      tableId,
      setTableId,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      placeOrderSuccess,
      clearOrders
    }}>
      {children}
    </CartContext.Provider>
  );
};
