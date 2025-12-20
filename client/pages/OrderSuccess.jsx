
import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess = () => {
  return (
    <div className="min-h-screen bg-ino-cream dark:bg-[#0f0b08] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-10">
        <div className="absolute -inset-8 bg-ino-red blur-2xl opacity-10 animate-pulse rounded-full"></div>
        <div className="w-24 h-24 bg-ino-clay rounded-3xl flex items-center justify-center text-white text-4xl relative shadow-xl">
           <i className="ph-bold ph-heart"></i>
        </div>
      </div>
      <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight uppercase mb-4">Ameseginalehu!</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 font-medium max-w-md mx-auto mb-12 italic leading-relaxed">
        Thank you for supporting our neighborhood kitchen! We're preparing your food with extra care right now. It will be with you shortly.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/orders" className="px-10 py-4 bg-ino-red text-white rounded-xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-red-500/20">
          Track My Plate
        </Link>
        <Link to="/" className="px-10 py-4 bg-white dark:bg-white/5 text-ino-clay dark:text-white border border-ino-clay/20 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-white/10 transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
