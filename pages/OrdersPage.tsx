import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../tools/utils';
import { apiService } from '../services/api';
import { useToast } from '../context/ToastContext';

const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await apiService.get('/orders/myorders');
        const formatted = data.map((o: any) => ({
          ...o,
          id: o._id || o.id
        }));
        setOrders(formatted);
      } catch (error) {
        // Fallback for demo if API fails
        const mockOrder: Order = {
          id: 'addis-987654',
          customerId: user?.id,
          items: [],
          totalAmount: 42.50,
          paymentStatus: 'Paid',
          orderStatus: OrderStatus.OUT_FOR_DELIVERY,
          deliveryAddress: user?.address || 'Bole, near Edna Mall, Addis Ababa',
          createdAt: new Date().toISOString()
        };
        setOrders([mockOrder]);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CONFIRMED: return 'bg-blue-100 text-blue-700';
      case OrderStatus.PREPARING: return 'bg-orange-100 text-orange-700';
      case OrderStatus.OUT_FOR_DELIVERY: return 'bg-purple-100 text-purple-700';
      case OrderStatus.DELIVERED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.CONFIRMED: return 'ph-check-circle';
      case OrderStatus.PREPARING: return 'ph-fire';
      case OrderStatus.OUT_FOR_DELIVERY: return 'ph-moped';
      case OrderStatus.DELIVERED: return 'ph-package';
      default: return 'ph-clock';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-[#D62828]"></div>
    </div>
  );

  return (
    <div className="py-24 bg-[#fafafa] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-8">
        <h1 className="text-6xl font-black text-gray-950 mb-16 tracking-tighter uppercase">Order <span className="text-[#D62828]">Timeline</span></h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-32 text-center shadow-elite border border-gray-100">
            <i className="ph ph-receipt text-8xl text-gray-100 mb-8 block"></i>
            <p className="text-gray-400 font-black uppercase tracking-widest">The archives are currently empty.</p>
            <Link to="/menu" className="inline-block mt-8 px-12 py-5 bg-[#D62828] text-white rounded-[2rem] font-black uppercase tracking-widest glow-red">Start Your Order</Link>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-[4rem] shadow-elite border border-gray-100 overflow-hidden transition-all hover:shadow-2xl">
                <div className="p-10 border-b border-gray-50 flex flex-wrap justify-between items-center gap-8">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-2">Addis Sequence ID</p>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">#{order.id.slice(-8).toUpperCase()}</h3>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-3 uppercase tracking-widest ${getStatusColor(order.orderStatus)}`}>
                      <i className={`ph-fill ${getStatusIcon(order.orderStatus)} text-xl`}></i>
                      {order.orderStatus}
                    </div>
                    
                    {(order.orderStatus === OrderStatus.OUT_FOR_DELIVERY || order.orderStatus === OrderStatus.PREPARING) && (
                      <Link 
                        to={`/track/${order.id}`}
                        className="px-8 py-3 bg-gray-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center gap-3 group"
                      >
                        <i className="ph-fill ph-navigation-arrow text-lg group-hover:translate-x-1 transition-transform"></i>
                        Track Live
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="p-10">
                  <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Addis Coordinates</p>
                      <p className="text-xl font-bold text-gray-600 leading-relaxed italic">"{order.deliveryAddress}"</p>
                    </div>
                    <div className="md:text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Valuation</p>
                      <p className="text-5xl font-black text-[#D62828] tracking-tighter">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;