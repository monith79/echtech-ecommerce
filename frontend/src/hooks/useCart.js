import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (productToAdd) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === productToAdd.id);
      if (existingItemIndex > -1) {
        // Item already in cart, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += productToAdd.quantity || 1;
        return updatedCart;
      } else {
        // New item, add to cart
        return [...prevCart, { ...productToAdd, quantity: productToAdd.quantity || 1 }];
      }
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => 
        item.id === productId ? { ...item, quantity: Math.max(1, newQuantity) } : item
      );
      return updatedCart.filter(item => item.quantity > 0); // Remove if quantity becomes 0
    });
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = { cart, addToCart, updateQuantity, removeFromCart, clearCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  return useContext(CartContext);
};