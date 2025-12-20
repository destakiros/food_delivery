
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="py-24 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-ultra mx-auto px-6 sm:px-10 lg:px-16">
        <header className="mb-20 flex flex-col md:flex-row justify-between items-end gap-10">
          <div>
            <h1 className="text-7xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">CMD <span className="text-ino-red">Terminal</span></h1>
            <p className="text-2xl text-gray-400 font-bold mt-4 tracking-tight">Mainframe Control Node • 2025 Release</p>
          </div>
          <div className="flex gap-4">
             <div className="px-8 py-3 bg-green-500/10 text-green-500 rounded-full border border-green-500/20 text-xs font-black uppercase tracking-widest">Systems Nominal</div>
             <div className="px-8 py-3 bg-white dark:bg-white/5 dark:text-white rounded-full border border-gray-100 dark:border-white/10 text-xs font-black uppercase tracking-widest">v4.0.2-Stable</div>
          </div>
        </header>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-20">
          <div className="bg-white dark:bg-gray-900 p-12 rounded-[4rem] shadow-xl border border-gray-100 dark:border-white/5">
            <div className="w-16 h-16 bg-red-100 dark:bg-ino-red/20 text-ino-red rounded-3xl flex items-center justify-center mb-10 text-3xl">
              <i className="ph-fill ph-pulse"></i>
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Live Throughput</p>
            <p className="text-6xl font-black text-gray-950 dark:text-white tracking-tighter">48 <span className="text-sm text-gray-400 uppercase font-black">Active</span></p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-12 rounded-[4rem] shadow-xl border border-gray-100 dark:border-white/5">
            <div className="w-16 h-16 bg-ino-yellow/10 text-ino-yellow rounded-3xl flex items-center justify-center mb-10 text-3xl">
              <i className="ph-fill ph-vault"></i>
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Net Liquidity</p>
            <p className="text-6xl font-black text-gray-950 dark:text-white tracking-tighter">$42k <span className="text-sm text-green-500 uppercase font-black">+14%</span></p>
          </div>

          <div className="bg-white dark:bg-gray-900 p-12 rounded-[4rem] shadow-xl border border-gray-100 dark:border-white/5">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-3xl flex items-center justify-center mb-10 text-3xl">
              <i className="ph-fill ph-user-list"></i>
            </div>
            <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] mb-3">Verified Nodes</p>
            <p className="text-6xl font-black text-gray-950 dark:text-white tracking-tighter">1,204</p>
          </div>

          <div className="bg-ino-red p-12 rounded-[4rem] shadow-3xl shadow-red-500/30 text-white flex flex-col justify-between overflow-hidden relative">
            <i className="ph-fill ph-warning-diamond absolute -bottom-10 -right-10 text-[12rem] opacity-10"></i>
            <div className="relative z-10">
               <p className="text-[11px] font-black text-white/60 uppercase tracking-[0.4em] mb-2">Priority Alerts</p>
               <p className="text-5xl font-black tracking-tighter">02</p>
            </div>
            <button className="relative z-10 w-full py-4 bg-white text-ino-red rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Resolve Now</button>
          </div>
        </div>

        {/* Command Links Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <Link to="/admin/orders" className="lg:col-span-2 group p-16 bg-gray-900 rounded-[5rem] shadow-3xl border border-white/5 hover:-translate-y-3 transition-all">
             <div className="flex justify-between items-start mb-24">
               <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-white text-5xl group-hover:bg-ino-red transition-all">
                 <i className="ph-fill ph-stack"></i>
               </div>
               <div className="text-right">
                  <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">Status</p>
                  <p className="text-green-500 font-black uppercase text-xs">High Efficiency</p>
               </div>
             </div>
             <h3 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Logistics Hub</h3>
             <p className="text-2xl text-gray-500 font-bold max-w-xl">Monitor real-time fulfillment, manage driver coordinates, and optimize the Addis delivery grid.</p>
          </Link>
          
          <div className="grid gap-10">
            <Link to="/admin/products" className="group p-12 bg-white dark:bg-gray-900 rounded-[4rem] shadow-2xl border border-gray-100 dark:border-white/5 hover:scale-[1.02] transition-all">
               <div className="flex justify-between mb-12">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-ino-red transition-all">
                     <i className="ph-fill ph-pizza text-3xl"></i>
                  </div>
                  <i className="ph ph-arrow-right text-gray-200 text-3xl"></i>
               </div>
               <h3 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter mb-4">Inventory Node</h3>
               <p className="text-gray-500 font-bold">Manage archives & AI assets.</p>
            </Link>

            <Link to="/admin/users" className="group p-12 bg-white dark:bg-gray-900 rounded-[4rem] shadow-2xl border border-gray-100 dark:border-white/5 hover:scale-[1.02] transition-all">
               <div className="flex justify-between mb-12">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-blue-500 transition-all">
                     <i className="ph-fill ph-users-four text-3xl"></i>
                  </div>
                  <i className="ph ph-arrow-right text-gray-200 text-3xl"></i>
               </div>
               <h3 className="text-3xl font-black text-gray-950 dark:text-white uppercase tracking-tighter mb-4">Member Fleet</h3>
               <p className="text-gray-500 font-bold">Monitor elite account status.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
