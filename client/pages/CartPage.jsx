
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { MIN_ORDER_VALUE, OPENING_HOUR, CLOSING_HOUR } from '../constants.js';

const CartPage = () => {
  const { cartItems, updateQuantity, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState(user?.address || '');
  const [instructions, setInstructions] = useState('');

  const deliveryFee = 25.00;
  const grandTotal = totalPrice + deliveryFee;

  const handleCheckout = async () => {
    if (!user) {
      showToast('Please login neighbor!', 'error');
      navigate('/login');
      return;
    }

    // Rule: Operating Hours (10:00 AM to 10:00 PM)
    const currentHour = new Date().getHours();
    if (currentHour < OPENING_HOUR || currentHour >= CLOSING_HOUR) {
      showToast(`Kitchen is resting. We open at ${OPENING_HOUR}:00 AM.`, 'error');
      return;
    }

    // Rule: Minimum Order Value
    if (totalPrice < MIN_ORDER_VALUE) {
      showToast(`Minimum order is ${MIN_ORDER_VALUE} ETB. Add a little more!`, 'error');
      return;
    }

    // Rule: Delivery Location (Must be within Addis)
    if (!address.toLowerCase().includes('addis')) {
      showToast('Currently we only deliver within the heart of Addis Ababa.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
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
      showToast('Order confirmed! Sending to our Addis Kitchen.', 'success');
      navigate('/order-success');
    } catch (error) {
      showToast('Something went wrong, friend.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF8F1] dark:bg-black px-4">
        <div className="w-20 h-20 bg-ino-cream dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
          <i className="ph-fill ph-shopping-cart text-ino-clay text-4xl"></i>
        </div>
        <h1 className="text-3xl font-black text-gray-950 dark:text-white mb-2 tracking-tighter uppercase">Your Bag is Empty</h1>
        <Link to="/menu" className="mt-6 px-10 py-3 bg-ino-red text-white rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-red-700 transition-all">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-[#FDF8F1] dark:bg-black min-h-screen pb-32">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-black text-gray-950 dark:text-white mb-10 tracking-tighter uppercase">Your <span className="text-ino-red">Selection</span></h1>
        
        <div className="flex flex-col gap-8">
          <div className="warm-card rounded-[2.5rem] overflow-hidden">
            <ul className="divide-y divide-ino-clay/5">
              {cartItems.map(item => (
                <li key={item.cartId} className="p-6 flex items-center gap-6">
                  <img src={item.imageURL} className="w-20 h-20 rounded-2xl object-cover" alt={item.name} />
                  <div className="flex-grow">
                    <h3 className="font-black text-gray-900 dark:text-white uppercase leading-none">{item.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                       {item.selectedOptions && Object.entries(item.selectedOptions).map(([k, v]) => (
                         <span key={k} className="text-[9px] font-black uppercase text-ino-clay/60 dark:text-gray-400 bg-ino-cream dark:bg-white/5 px-2 py-0.5 rounded-full border border-ino-clay/5">{k}: {v}</span>
                       ))}
                    </div>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center bg-ino-cream dark:bg-white/5 rounded-xl px-2 py-1">
                        <button onClick={() => updateQuantity(item.cartId, -1)} className="p-1 text-ino-clay">-</button>
                        <span className="mx-4 font-black dark:text-white text-xs">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, 1)} className="p-1 text-ino-clay">+</button>
                      </div>
                      <button onClick={() => updateQuantity(item.cartId, -item.quantity)} className="text-[10px] font-black text-gray-400 uppercase hover:text-ino-red">Remove</button>
                    </div>
                  </div>
                  <p className="font-black text-gray-900 dark:text-white text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="warm-card p-8 rounded-[2rem]">
               <h4 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><i className="ph ph-map-pin-line text-ino-red"></i> Delivery Area</h4>
               <input 
                 type="text" 
                 placeholder="Neighborhood in Addis (e.g. Bole)" 
                 className="w-full bg-ino-cream dark:bg-black/20 p-4 rounded-xl text-sm font-bold border-none ring-1 ring-ino-clay/10 outline-none dark:text-white"
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
               />
               <p className="text-[9px] font-black text-gray-400 uppercase mt-3">* Addis Ababa region only</p>
            </div>
            <div className="warm-card p-8 rounded-[2rem]">
               <h4 className="font-black text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><i className="ph ph-notepad text-ino-red"></i> Kitchen Notes</h4>
               <input 
                 type="text" 
                 placeholder="Gate code, allergies, extra napkins..." 
                 className="w-full bg-ino-cream dark:bg-black/20 p-4 rounded-xl text-sm font-bold border-none ring-1 ring-ino-clay/10 outline-none dark:text-white"
                 value={instructions}
                 onChange={(e) => setInstructions(e.target.value)}
               />
            </div>
          </div>
          
          <div className="bg-gray-950 p-10 rounded-[2.5rem] text-white shadow-2xl">
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-400 font-black text-[10px] uppercase tracking-widest">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-400 font-black text-[10px] uppercase tracking-widest">
                <span>Addis Delivery</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="font-black uppercase tracking-tighter text-xl">Total Valuation</span>
                <span className="text-3xl font-black text-ino-yellow tracking-tighter">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-5 bg-ino-red text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? 'Connecting...' : 'Secure Checkout'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
