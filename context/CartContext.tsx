
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, FoodItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (food: FoodItem, selectedOptions?: Record<string, string>, finalPrice?: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('qb_cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('qb_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (food: FoodItem, selectedOptions?: Record<string, string>, finalPrice?: number) => {
    setCartItems(prev => {
      // Create a unique cartId based on the product ID and its selected options
      const optionsString = selectedOptions ? JSON.stringify(Object.entries(selectedOptions).sort()) : '';
      const cartId = `${food.id}-${optionsString}`;

      const itemPrice = finalPrice !== undefined ? finalPrice : food.price;

      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...food, quantity: 1, selectedOptions, cartId, price: itemPrice, basePrice: food.price }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCartItems([]);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
