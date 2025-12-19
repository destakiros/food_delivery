
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiService } from '../services/api';

const CartPage: React.FC = () => {
  const { cartItems, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [instructions, setInstructions] = useState('');

  const deliveryFee = 2.50;
  const grandTotal = totalPrice + deliveryFee;

  const handleCheckout = async () => {
    if (!user) {
      showToast('Please login to place an order', 'error');
      navigate('/login');
      return;
    }

    if (user.status === 'Suspended') {
      showToast('Your account is suspended. Check notifications for details.', 'error');
      return;
    }

    if (!address.trim()) {
      showToast('Please provide a delivery address', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.post('/orders', {
        items: cartItems.map(item => ({
          foodId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          selectedOptions: item.selectedOptions
        })),
        totalAmount: grandTotal,
        deliveryAddress: address,
        instructions: instructions
      });
      
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate('/orders');
    } catch (error: any) {
      showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-6">
          <i className="ph-fill ph-shopping-cart text-orange-500 text-5xl"></i>
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter">Hungry?</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 font-medium">Your cart is currently empty. Discover our elite menu.</p>
        <Link to="/menu" className="px-12 py-4 bg-orange-500 text-white rounded-full font-black text-lg shadow-2xl shadow-orange-100 dark:shadow-none hover:bg-orange-600 transition-all">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-16 tracking-tighter">Your <span className="text-orange-500">Selection</span></h1>
        
        <div className="flex flex-col xl:flex-row gap-16">
          <div className="xl:flex-grow space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800">
                <h2 className="font-black text-xl text-gray-800 dark:text-white uppercase tracking-widest">Cart Items</h2>
              </div>
              <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                {cartItems.map(item => (
                  <li key={item.cartId} className="p-8 flex flex-col sm:flex-row sm:items-center gap-8">
                    <img src={item.imageURL} alt={item.name} className="w-32 h-32 rounded-3xl object-cover shadow-xl" />
                    <div className="flex-grow">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{item.name}</h3>
                      {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Object.entries(item.selectedOptions).map(([name, val]) => (
                            <span key={name} className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full uppercase font-black border border-gray-100 dark:border-gray-700">
                              {name}: {val}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                          <button onClick={() => updateQuantity(item.cartId, -1)} className="text-gray-500 dark:text-gray-400 hover:text-orange-500"><i className="ph ph-minus"></i></button>
                          <span className="mx-6 text-lg font-black text-gray-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)} className="text-gray-500 dark:text-gray-400 hover:text-orange-500"><i className="ph ph-plus"></i></button>
                        </div>
                        <button onClick={() => updateQuantity(item.cartId, -item.quantity)} className="text-red-500 font-bold text-xs uppercase hover:underline">Remove</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-black text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">${item.price.toFixed(2)} / Unit</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                  <i className="ph-fill ph-map-pin text-orange-500"></i> Delivery Address
                </h3>
                <textarea 
                  className="w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border-none ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-lg font-medium dark:text-white"
                  rows={4}
                  placeholder="Street name, house number, floor..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-sm border border-gray-100 dark:border-gray-800">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4">
                  <i className="ph-fill ph-warning text-orange-500"></i> Instructions
                </h3>
                <textarea 
                  className="w-full p-6 bg-gray-50 dark:bg-gray-800 rounded-3xl border-none ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none text-lg font-medium dark:text-white"
                  rows={4}
                  placeholder="Allergies? Extra sauce? Door code?"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="xl:w-1/3">
            <div className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 sticky top-28">
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-10 tracking-tighter">Order Summary</h3>
              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-gray-500 font-bold text-lg">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-bold text-lg">
                  <span>Elite Delivery</span>
                  <span className="text-gray-900 dark:text-white">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="pt-6 border-t border-gray-50 dark:border-gray-800 flex justify-between items-end">
                  <span className="text-xl font-black text-gray-900 dark:text-white">Grand Total</span>
                  <span className="text-5xl font-black text-orange-500 tracking-tighter">${grandTotal.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-6 bg-gray-900 dark:bg-orange-500 text-white rounded-[2rem] font-black text-2xl hover:bg-black dark:hover:bg-orange-600 shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
              >
                {isProcessing ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <>
                    <span>Confirm Order</span>
                    <i className="ph-bold ph-arrow-right"></i>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
