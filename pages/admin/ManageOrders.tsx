
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { addNotificationToUser } = useAuth();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/orders');
      if (data && Array.isArray(data)) {
        setOrders(data.map((o: any) => ({ ...o, id: o._id || o.id })));
      } else {
        const savedOrders = localStorage.getItem('demo_orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        } else {
          setOrders([]);
        }
      }
    } catch (error) {
      showToast('Offline Mode: Loading from storage', 'info');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleAction = async (orderId: string, action: 'APPROVE' | 'CANCEL') => {
    const newStatus = action === 'APPROVE' ? OrderStatus.PREPARING : OrderStatus.CANCELLED;
    const message = action === 'APPROVE' ? 'Approved' : 'order cancelled';
    
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const updatedOrders = orders.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o);
      setOrders(updatedOrders);
      localStorage.setItem('demo_orders', JSON.stringify(updatedOrders));

      const customerId = typeof order.customerId === 'object' ? order.customerId.id || order.customerId._id : order.customerId;
      addNotificationToUser(customerId, message);
      
      showToast(`Order ${action === 'APPROVE' ? 'Approved' : 'Cancelled'}. Notification sent to user.`, 'success');
    } catch (error) {
      showToast('Failed to process order action', 'error');
    }
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Order <span className="text-red-600">Pipeline</span></h1>
            <p className="text-2xl text-gray-400 font-bold mt-4">Review, Approve, or Cancel incoming delivery requests.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="px-10 py-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-4 text-xl font-black text-gray-800 dark:text-white hover:bg-red-50 transition-all"
          >
             <i className="ph-bold ph-arrows-clockwise text-red-600"></i> 
             <span>Sync Hub</span>
          </button>
        </header>

        <div className="bg-white dark:bg-gray-900 rounded-[4rem] shadow-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-gray-400 font-black text-xs uppercase tracking-[0.4em]">
                  <th className="px-10 py-8">ID</th>
                  <th className="px-10 py-8">Customer</th>
                  <th className="px-10 py-8">Items Ordered</th>
                  <th className="px-10 py-8">Valuation</th>
                  <th className="px-10 py-8">Time</th>
                  <th className="px-10 py-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-10 py-20 text-center text-gray-400 font-bold uppercase tracking-widest italic">No active orders in pipeline.</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all">
                      <td className="px-10 py-8 font-black text-gray-400 dark:text-gray-500 tracking-tighter">#{order.id.slice(-6).toUpperCase()}</td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-4">
                          <img src={`https://ui-avatars.com/api/?name=${typeof order.customerId === 'object' ? order.customerId.name : 'User'}&background=D62828&color=fff&bold=true`} className="w-12 h-12 rounded-2xl" alt="" />
                          <div>
                            <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{typeof order.customerId === 'object' ? order.customerId.name : 'Customer'}</p>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${order.orderStatus === OrderStatus.CANCELLED ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>{order.orderStatus}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                         <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
                           {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                         </p>
                      </td>
                      <td className="px-10 py-8 font-black text-2xl text-red-600 tracking-tighter">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-10 py-8 text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleTimeString()}</td>
                      <td className="px-10 py-8 text-right">
                        <div className="flex justify-end gap-3">
                          {order.orderStatus !== OrderStatus.CANCELLED && (
                            <>
                              <button 
                                onClick={() => handleAction(order.id, 'APPROVE')}
                                className="px-6 py-3 bg-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all"
                              >
                                Approve
                              </button>
                              <button 
                                onClick={() => handleAction(order.id, 'CANCEL')}
                                className="px-6 py-3 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-500/20 hover:bg-red-700 transition-all"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageOrders;
