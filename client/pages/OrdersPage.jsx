
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatCurrency } from '../tools/utils.js';
import { apiService } from '../services/api.js';

const OrdersPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  // Update "now" every 30 seconds for cancellation window calculations
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await apiService.get('/orders/myorders');
      const formatted = (data || []).map((o) => ({
        ...o,
        id: o._id || o.id
      }));
      setOrders(formatted);
    } catch (error) {
      const saved = JSON.parse(localStorage.getItem('demo_orders') || '[]');
      setOrders(saved.filter(o => o.customerId === user?.id));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchOrders();
  }, [user]);

  const handleCancelOrder = (orderId, createdAt) => {
    const timeDiff = (Date.now() - new Date(createdAt).getTime()) / 1000 / 60;
    
    // OCR Rule Page 17: Cancellation within 5 minutes
    if (timeDiff > 5) {
      showToast("Cancellation window (5 mins) has closed, friend.", "error");
      return;
    }

    const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: 'Cancelled' } : o);
    setOrders(updated);
    
    // Update master storage
    const allSaved = JSON.parse(localStorage.getItem('demo_orders') || '[]');
    const masterUpdated = allSaved.map(o => o.id === orderId ? { ...o, orderStatus: 'Cancelled' } : o);
    localStorage.setItem('demo_orders', JSON.stringify(masterUpdated));
    
    showToast("Order cancelled successfully.", "success");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-ino-red"></div>
    </div>
  );

  return (
    <div className="py-24 bg-[#FDF8F1] dark:bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-16 tracking-tighter uppercase">Your <span className="text-ino-red">Plate Timeline</span></h1>
        
        {orders.length === 0 ? (
          <div className="warm-card rounded-[3rem] p-32 text-center">
            <p className="text-gray-400 font-black uppercase tracking-widest text-sm mb-8">No orders in your history yet.</p>
            <Link to="/menu" className="px-12 py-5 bg-ino-red text-white rounded-full font-black uppercase tracking-widest shadow-lg">Check Menu</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => {
              const minutesElapsed = (now - new Date(order.createdAt).getTime()) / 1000 / 60;
              const canCancel = order.orderStatus === 'Confirmed' && minutesElapsed < 5;

              return (
                <div key={order.id} className="warm-card rounded-[2.5rem] overflow-hidden transition-all hover:shadow-xl border border-ino-clay/10">
                  <div className="p-8 border-b border-ino-clay/5 flex flex-wrap justify-between items-center gap-6">
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Sequence ID</p>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">#{order.id.slice(-8).toUpperCase()}</h3>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' : 
                         order.orderStatus === 'Cancelled' ? 'bg-red-50 text-red-600' : 'bg-ino-yellow/10 text-ino-clay'
                       }`}>
                         {order.orderStatus}
                       </span>
                       {canCancel && (
                         <button 
                           onClick={() => handleCancelOrder(order.id, order.createdAt)}
                           className="text-[9px] font-black text-red-600 uppercase border border-red-600/20 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all"
                         >
                           Cancel ({Math.ceil(5 - minutesElapsed)}m left)
                         </button>
                       )}
                       <Link to={`/track/${order.id}`} className="px-6 py-2 bg-gray-950 dark:bg-white dark:text-black text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-ino-clay transition-all shadow-lg">Track Live</iLink>
                    </div>
                  </div>
                  
                  <div className="p-8 flex flex-col md:flex-row justify-between gap-6">
                     <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                           {order.items.map((it, i) => (
                             <div key={i} className="text-[10px] font-bold text-gray-600 dark:text-gray-400 bg-ino-cream dark:bg-white/5 px-2 py-1 rounded-lg border border-ino-clay/5">
                                {it.quantity}x {it.name} {it.itemInstructions && <span className="text-ino-red ml-1">({it.itemInstructions})</span>}
                             </div>
                           ))}
                        </div>
                        <p className="text-xs font-medium text-gray-400 italic">"Sent to: {order.deliveryAddress}"</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Grand Total</p>
                        <p className="text-3xl font-black text-ino-red tracking-tighter">${order.totalAmount?.toFixed(2)}</p>
                     </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
