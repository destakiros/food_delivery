
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
      // Create order entry in storage/db
      const orderData = {
        id: 'ORDER-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        customerId: user.id,
        items: [...cartItems],
        totalAmount: grandTotal,
        deliveryAddress: address,
        instructions: instructions,
        orderStatus: 'Confirmed',
        createdAt: new Date().toISOString()
      };

      const savedOrders = JSON.parse(localStorage.getItem('demo_orders') || '[]');
      savedOrders.push(orderData);
      localStorage.setItem('demo_orders', JSON.stringify(savedOrders));

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      clearCart();
      showToast('Order Placed Successfully!', 'success');
      navigate('/order-success');
    } catch (error: any) {
      showToast(error.message || 'Failed to place order', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <i className="ph-fill ph-shopping-cart text-red-600 text-5xl"></i>
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tighter uppercase">Cart Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10 font-bold uppercase tracking-widest text-xs">Your Addis Grid selection is clear.</p>
        <Link to="/menu" className="px-12 py-4 bg-red-600 text-white rounded-full font-black text-lg shadow-2xl shadow-red-500/20 hover:bg-red-700 transition-all uppercase tracking-widest">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-16 tracking-tighter uppercase">Your <span className="text-red-600">Selection</span></h1>
        
        <div className="flex flex-col xl:flex-row gap-16">
          <div className="xl:flex-grow space-y-8">
            <div className="bg-white dark:bg-gray-900 rounded-[3rem] shadow-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                <h2 className="font-black text-xs text-gray-400 uppercase tracking-[0.4em]">Cart Payload</h2>
                <button onClick={() => clearCart()} className="text-[10px] font-black uppercase text-red-600 hover:underline tracking-widest">Purge All</button>
              </div>
              <ul className="divide-y divide-gray-50 dark:divide-gray-800">
                {cartItems.map(item => (
                  <li key={item.cartId} className="p-8 flex flex-col sm:flex-row sm:items-center gap-8 group">
                    <div className="relative overflow-hidden rounded-3xl w-32 h-32 shadow-xl">
                       <img src={item.imageURL} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-tighter">{item.name}</h3>
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
                        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 border border-gray-100 dark:border-gray-700">
                          <button onClick={() => updateQuantity(item.cartId, -1)} className="text-gray-500 dark:text-gray-400 hover:text-red-600"><i className="ph-bold ph-minus"></i></button>
                          <span className="mx-6 text-lg font-black text-gray-900 dark:text-white">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, 1)} className="text-gray-500 dark:text-gray-400 hover:text-red-600"><i className="ph-bold ph-plus"></i></button>
                        </div>
                        <button onClick={() => updateQuantity(item.cartId, -item.quantity)} className="text-red-600 font-black text-[10px] uppercase hover:underline tracking-widest">Remove</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-50">Unit: ${item.price.toFixed(2)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4 uppercase tracking-tighter">
                  <i className="ph-fill ph-map-pin text-red-600"></i> Delivery Target
                </h3>
                <textarea 
                  className="w-full p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl border-none ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-4 focus:ring-red-600/10 transition-all outline-none text-lg font-black text-gray-900 dark:text-white placeholder:text-gray-400"
                  rows={4}
                  placeholder="Neighborhood, Building, Landmark..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
              </div>

              <div className="bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-800">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-4 uppercase tracking-tighter">
                  <i className="ph-fill ph-warning text-red-600"></i> Drop Notes
                </h3>
                <textarea 
                  className="w-full p-8 bg-gray-50 dark:bg-gray-800 rounded-3xl border-none ring-1 ring-gray-100 dark:ring-gray-700 focus:ring-4 focus:ring-red-600/10 transition-all outline-none text-lg font-black text-gray-900 dark:text-white placeholder:text-gray-400"
                  rows={4}
                  placeholder="Gate codes, allergies, special requests..."
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                ></textarea>
              </div>
            </div>
          </div>
          
          <div className="xl:w-1/3">
            <div className="bg-gray-950 p-12 rounded-[4rem] shadow-3xl border border-white/5 sticky top-28">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] mb-8">Financial Overview</p>
              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-gray-400 font-black uppercase text-xs tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-black uppercase text-xs tracking-widest">
                  <span>Elite Delivery</span>
                  <span className="text-white">${deliveryFee.toFixed(2)}</span>
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest block mb-2">Total Valuation</span>
                    <span className="text-5xl font-black text-white tracking-tighter">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-7 bg-red-600 text-white rounded-[2rem] font-black text-2xl uppercase tracking-widest hover:bg-red-700 shadow-3xl shadow-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
              >
                {isProcessing ? (
                  <div className="animate-spin h-8 w-8 border-t-2 border-white rounded-full"></div>
                ) : (
                  <>
                    <span>Execute Order</span>
                    <i className="ph-bold ph-arrow-right"></i>
                  </>
                )}
              </button>

              <div className="mt-8 pt-8 border-t border-white/5 text-center">
                 <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Encrypted Checkout Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
