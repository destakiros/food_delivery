
import React from 'react';
import { Link } from 'react-router-dom';
import { MOCK_FOODS } from '../../constants.js';

const Dashboard = () => {
  // Mock trend data for "Basic Reports" requirement
  const stats = [
    { label: 'Live Orders', value: '48', icon: 'ph-pulse', color: 'text-ino-red' },
    { label: 'Net Revenue', value: '$42.5k', icon: 'ph-vault', color: 'text-ino-clay' },
    { label: 'Neighborhood Hubs', value: '03', icon: 'ph-map-pin', color: 'text-green-600' },
    { label: 'New Members', value: '124', icon: 'ph-users-four', color: 'text-blue-600' }
  ];

  const topItems = MOCK_FOODS.slice(0, 3).map((item, i) => ({
    ...item,
    orders: [156, 142, 98][i],
    trend: ['+12%', '+8%', '-2%'][i]
  }));

  return (
    <div className="py-24 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-ultra mx-auto px-6 sm:px-10 lg:px-16">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <h1 className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">Command <span className="text-ino-red">Center</span></h1>
            <p className="text-2xl text-gray-400 font-bold mt-4 tracking-tight">Mainframe Control Node • Addis Ababa v4.0</p>
          </div>
          <div className="flex gap-4">
             <div className="px-6 py-2 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-[10px] font-black uppercase tracking-widest">Kitchen Link Active</div>
          </div>
        </header>

        {/* Dynamic Stats Grid (Page 10 requirement) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((s, i) => (
            <div key={i} className="warm-card p-10 rounded-[3rem] transition-all hover:scale-[1.02]">
              <div className={`w-14 h-14 bg-ino-cream dark:bg-white/5 rounded-2xl flex items-center justify-center mb-8 text-3xl ${s.color}`}>
                <i className={`ph-fill ${s.icon}`}></i>
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{s.label}</p>
              <p className="text-5xl font-black text-gray-950 dark:text-white tracking-tighter">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Controls */}
          <div className="lg:col-span-2 space-y-8">
             <Link to="/admin/orders" className="group block p-12 bg-gray-950 rounded-[4rem] text-white shadow-2xl relative overflow-hidden transition-all hover:-translate-y-2">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:rotate-12 transition-all">
                   <i className="ph-fill ph-cooking-pot text-[12rem]"></i>
                </div>
                <div className="relative z-10">
                   <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Order Pipeline</h3>
                   <p className="text-xl text-gray-400 font-medium max-w-md">Real-time fulfillment monitor. Direct interface to the Addis delivery grid.</p>
                   <div className="mt-12 inline-flex items-center gap-3 px-8 py-3 bg-ino-red rounded-xl font-black uppercase tracking-widest text-[10px]">
                      <span>Open Pipeline</span><i className="ph-bold ph-arrow-right"></i>
                   </div>
                </div>
             </Link>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Link to="/admin/products" className="warm-card p-10 rounded-[3rem] hover:border-ino-clay transition-all">
                   <h4 className="text-2xl font-black uppercase dark:text-white mb-2">Inventory</h4>
                   <p className="text-sm text-gray-500 font-medium">Add or remove flavor nodes from our neighborhood menu.</p>
                </Link>
                <Link to="/admin/users" className="warm-card p-10 rounded-[3rem] hover:border-ino-red transition-all">
                   <h4 className="text-2xl font-black uppercase dark:text-white mb-2">Member Fleet</h4>
                   <p className="text-sm text-gray-500 font-medium">Manage user ranks and account pulses.</p>
                </Link>
             </div>
          </div>

          {/* Reporting Panel (Page 13 requirement) */}
          <div className="warm-card p-12 rounded-[4rem] flex flex-col">
             <header className="mb-10 flex justify-between items-center">
                <h3 className="text-xl font-black uppercase dark:text-white tracking-tighter">Popular Plates</h3>
                <i className="ph ph-chart-line-up text-ino-clay text-2xl"></i>
             </header>
             <div className="space-y-8 flex-grow">
                {topItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between group">
                     <div className="flex items-center gap-4">
                        <img src={item.imageURL} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                        <div>
                           <p className="font-black dark:text-white uppercase text-[11px] leading-none mb-1">{item.name}</p>
                           <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.orders} Orders</p>
                        </div>
                     </div>
                     <span className={`text-[10px] font-black ${item.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{item.trend}</span>
                  </div>
                ))}
             </div>
             <div className="mt-12 pt-8 border-t border-ino-clay/5">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">Data accurate as of {new Date().toLocaleTimeString()}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
