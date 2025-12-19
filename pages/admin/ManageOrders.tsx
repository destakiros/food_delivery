
import React, { useState, useEffect } from 'react';
import { Order, OrderStatus } from '../../types';
import { apiService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingInstructions, setViewingInstructions] = useState<Order | null>(null);
  const { showToast } = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await apiService.get('/orders');
      setOrders(data.map((o: any) => ({ ...o, id: o._id || o.id })));
    } catch (error) {
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      await apiService.put(`/orders/${id}/status`, { orderStatus: newStatus });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, orderStatus: newStatus } : o));
      showToast('Order status updated', 'success');
    } catch (error) {
      showToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Live <span className="text-orange-500">Logistics</span></h1>
            <p className="text-2xl text-gray-400 font-bold mt-4">Command center for all active and historical orders.</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="px-10 py-5 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl flex items-center gap-4 text-xl font-black text-gray-800 dark:text-white hover:bg-orange-50 transition-all"
          >
             <i className="ph-bold ph-arrows-clockwise text-orange-500"></i> 
             <span>Refresh Pipeline</span>
          </button>
        </header>

        <div className="bg-white dark:bg-gray-900 rounded-[4rem] shadow-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-gray-400 font-black text-xs uppercase tracking-[0.4em]">
                  <th className="px-10 py-8">ID Sequence</th>
                  <th className="px-10 py-8">Elite Customer</th>
                  <th className="px-10 py-8">Total Valuation</th>
                  <th className="px-10 py-8">Instructions</th>
                  <th className="px-10 py-8">Pipeline Status</th>
                  <th className="px-10 py-8 text-right">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all">
                    <td className="px-10 py-8 font-black text-gray-400 dark:text-gray-500 tracking-tighter">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${(order.customerId as any).name}&background=f97316&color=fff&bold=true`} className="w-12 h-12 rounded-2xl" alt="" />
                        <div>
                          <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{(order.customerId as any).name}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase">{(order.customerId as any).email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 font-black text-2xl text-gray-900 dark:text-white tracking-tighter">${order.totalAmount.toFixed(2)}</td>
                    <td className="px-10 py-8">
                      {order.instructions ? (
                        <button 
                          onClick={() => setViewingInstructions(order)}
                          className="px-5 py-2.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2"
                        >
                          <i className="ph-fill ph-warning-circle"></i> View Notes
                        </button>
                      ) : (
                        <span className="text-gray-300 dark:text-gray-600 font-bold text-xs uppercase italic">Standard</span>
                      )}
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                        order.orderStatus === OrderStatus.DELIVERED ? 'bg-green-500 text-white' :
                        order.orderStatus === OrderStatus.OUT_FOR_DELIVERY ? 'bg-purple-500 text-white' :
                        order.orderStatus === OrderStatus.PREPARING ? 'bg-orange-500 text-white' :
                        'bg-blue-500 text-white'
                      }`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <select 
                        value={order.orderStatus}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-4 py-3 font-black text-xs uppercase tracking-widest outline-none focus:ring-4 focus:ring-orange-500/10 dark:text-white"
                      >
                        {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Instruction Modal */}
      {viewingInstructions && (
        <div className="fixed inset-0 bg-black/80 z-[80] flex items-center justify-center p-6 backdrop-blur-xl animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-900 rounded-[4rem] p-16 w-full max-w-2xl border-4 border-orange-500 shadow-3xl">
              <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter uppercase">Elite Instructions</h3>
              <div className="p-10 bg-orange-50 dark:bg-orange-900/10 rounded-[3rem] border border-orange-100 dark:border-orange-800 italic text-2xl font-bold text-orange-900 dark:text-orange-400">
                "{viewingInstructions.instructions}"
              </div>
              <button 
                onClick={() => setViewingInstructions(null)}
                className="mt-12 w-full py-6 bg-gray-900 text-white rounded-[2rem] font-black text-2xl uppercase tracking-widest hover:bg-black transition-all"
              >
                Acknowledge Notes
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
