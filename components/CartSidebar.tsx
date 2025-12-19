
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, totalPrice, totalItems } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Your Cart ({totalItems})</h2>
            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="text-center py-20">
                <i className="fas fa-shopping-basket text-gray-200 text-6xl mb-4"></i>
                <p className="text-gray-500 font-medium">Your cart is currently empty</p>
                <button onClick={onClose} className="mt-4 text-orange-500 font-bold">Start Shopping</button>
              </div>
            ) : (
              cartItems.map(item => (
                <div key={item.cartId} className="flex items-center space-x-4">
                  <img src={item.imageURL} className="w-16 h-16 rounded-xl object-cover" alt={item.name} />
                  <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                    {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.selectedOptions).map(([name, val]) => (
                          <span key={name} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter">
                            {val}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 my-1">${item.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => updateQuantity(item.cartId, -1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">-</button>
                      <span className="text-sm font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)} className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-600">+</button>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex justify-between mb-6">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="text-xl font-black text-gray-900">${totalPrice.toFixed(2)}</span>
              </div>
              <Link 
                to="/cart" 
                onClick={onClose}
                className="w-full py-4 bg-orange-500 text-white rounded-2xl font-bold text-center block shadow-lg hover:bg-orange-600 transition-all"
              >
                Checkout Now
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSidebar;
