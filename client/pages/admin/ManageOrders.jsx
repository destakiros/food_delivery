
import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { addNotificationToUser } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/orders');
      if (data && Array.isArray(data)) {
        setOrders(data.map((o) => ({ ...o, id: o._id || o.id })));
      } else {
        const saved = JSON.parse(localStorage.getItem('demo_orders') || '[]');
        setOrders(saved);
      }
    } catch (error) {
      showToast('Error fetching pipeline', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      const updated = orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
      setOrders(updated);
      localStorage.setItem('demo_orders', JSON.stringify(updated));
      addNotificationToUser(order.customerId, `Order status updated to: ${newStatus}`);
      showToast(`Order updated to ${newStatus}`, 'success');
    } catch (error) {
      showToast('Update failed.', 'error');
    }
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <header className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none mb-2">Order <span className="text-ino-red">Pipeline</span></h1>
            <p className="text-gray-500 font-bold">Monitor every meal in the Addis Grid.</p>
          </div>
          <button onClick={fetchOrders} className="p-3 bg-white dark:bg-white/5 rounded-xl shadow-md"><i className="ph ph-arrows-clockwise text-xl"></i></button>
        </header>

        <div className="space-y-6">
          {orders.length === 0 ? (
             <div className="text-center py-32 warm-card rounded-[3rem]">
                <p className="text-gray-400 font-black uppercase tracking-[0.3em]">The kitchen is quiet right now.</p>
             </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="warm-card rounded-[2.5rem] p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 transition-all hover:shadow-lg">
                <div className="flex-grow">
                   <div className="flex items-center gap-4 mb-2">
                      <span className="font-black text-gray-950 dark:text-white text-lg">#{order.id.slice(-8).toUpperCase()}</span>
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' : 
                        order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600' : 'bg-ino-yellow/10 text-ino-clay'
                      }`}>
                        {order.orderStatus}
                      </span>
                   </div>
                   <p className="text-xs font-bold text-gray-500 mb-4">{order.deliveryAddress}</p>
                   <div className="flex flex-wrap gap-2">
                      {order.items.map((it, idx) => (
                        <span key={idx} className="text-[10px] bg-ino-cream dark:bg-white/5 px-2 py-1 rounded-lg border border-ino-clay/5 dark:text-gray-300">{it.quantity}x {it.name}</span>
                      ))}
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                   <div className="text-right mr-4 hidden sm:block">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Value</p>
                      <p className="text-2xl font-black text-ino-red">${order.totalAmount?.toFixed(2)}</p>
                   </div>
                   
                   <div className="grid grid-cols-2 sm:flex gap-3">
                      {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                        <>
                          <button 
                            onClick={() => updateStatus(order.id, 'Preparing')}
                            className="px-5 py-2.5 bg-gray-950 text-white rounded-xl text-[10px] font-black uppercase hover:bg-ino-clay transition-all"
                          >Cook</button>
                          <button 
                            onClick={() => updateStatus(order.id, 'Out for Delivery')}
                            className="px-5 py-2.5 bg-ino-clay text-white rounded-xl text-[10px] font-black uppercase hover:bg-black transition-all"
                          >Dispatch</button>
                          <button 
                            onClick={() => updateStatus(order.id, 'Delivered')}
                            className="px-5 py-2.5 bg-green-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-green-600 transition-all"
                          >Deliver</button>
                        </>
                      )}
                      {order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled' && (
                        <button 
                          onClick={() => updateStatus(order.id, 'Cancelled')}
                          className="px-5 py-2.5 border border-ino-red text-ino-red rounded-xl text-[10px] font-black uppercase hover:bg-red-50 transition-all"
                        >Cancel</button>
                      )}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
