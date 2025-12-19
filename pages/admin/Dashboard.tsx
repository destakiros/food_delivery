
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your restaurant, orders, and products.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4 text-xl">
              <i className="fas fa-shopping-bag"></i>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Orders</p>
            <p className="text-3xl font-black text-gray-900">1,284</p>
            <p className="text-green-500 text-sm mt-2"><i className="fas fa-arrow-up mr-1"></i> 12% from last week</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 text-xl">
              <i className="fas fa-dollar-sign"></i>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-gray-900">$24,592</p>
            <p className="text-green-500 text-sm mt-2"><i className="fas fa-arrow-up mr-1"></i> 8% from last month</p>
          </div>
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4 text-xl">
              <i className="fas fa-users"></i>
            </div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Customers</p>
            <p className="text-3xl font-black text-gray-900">842</p>
            <p className="text-gray-400 text-sm mt-2">Active users this month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Link to="/admin/orders" className="group p-8 bg-gray-900 rounded-[2.5rem] shadow-xl hover:-translate-y-1 transition-all">
             <div className="flex justify-between items-start mb-12">
               <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-white text-2xl group-hover:bg-orange-500 transition-colors">
                 <i className="fas fa-clipboard-list"></i>
               </div>
               <i className="fas fa-arrow-right text-gray-700 group-hover:text-white"></i>
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Manage Orders</h3>
             <p className="text-gray-400">View live orders, update statuses, and track delivery progress.</p>
          </Link>
          
          <Link to="/admin/products" className="group p-8 bg-white rounded-[2.5rem] shadow-xl hover:-translate-y-1 border border-gray-100 transition-all">
             <div className="flex justify-between items-start mb-12">
               <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 text-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors">
                 <i className="fas fa-box"></i>
               </div>
               <i className="fas fa-arrow-right text-gray-200 group-hover:text-orange-500"></i>
             </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Inventory Control</h3>
             <p className="text-gray-500">Add new menu items, update prices, or change availability status.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
