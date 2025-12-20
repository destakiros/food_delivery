
import React from 'react';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white dark:bg-gray-900 shadow-2xl flex flex-col">
          <div className="p-8 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Your Bag ({totalItems})</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-ino-red transition-colors">
              <i className="ph-bold ph-x text-2xl"></i>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-8 space-y-8">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <i className="ph ph-shopping-bag text-gray-100 dark:text-white/5 text-8xl mb-6"></i>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Selection is empty.</p>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.cartId} className="flex items-center space-x-6 group">
                  <img src={item.imageURL} className="w-20 h-20 rounded-2xl object-cover shadow-lg" alt={item.name} />
                  <div className="flex-grow">
                    <h4 className="font-black text-gray-900 dark:text-white uppercase text-sm tracking-tight">{item.name}</h4>
                    <p className="text-xs font-black text-ino-red mt-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-4 mt-4">
                      <button onClick={() => updateQuantity(item.cartId, -1)} className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-ino-red transition-colors">-</button>
                      <span className="text-sm font-black dark:text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)} className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-ino-red transition-colors">+</button>
                    </div>
                  </div>
                  <p className="font-black text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/5">
              <div className="flex justify-between mb-8">
                <span className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Total Valuation</span>
                <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">${totalPrice.toFixed(2)}</span>
              </div>
              <Link 
                to="/cart" 
                onClick={onClose}
                className="w-full py-6 bg-ino-red text-white rounded-full font-black text-xl text-center block shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all uppercase tracking-widest"
              >
                Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
