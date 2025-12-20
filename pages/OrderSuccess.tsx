
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-8 text-center overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-red-600 blur-[150px] opacity-20 animate-pulse"></div>
        <div className="w-40 h-40 bg-red-600 rounded-[3rem] flex items-center justify-center text-white text-6xl shadow-3xl mb-12 animate-in zoom-in duration-700">
           <i className="ph-bold ph-check-circle"></i>
        </div>
      </div>

      <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase mb-6 animate-in slide-in-from-bottom-8 duration-700">
        Order <span className="text-red-600">Locked</span>
      </h1>
      <p className="text-2xl text-gray-400 font-bold max-w-xl mx-auto mb-16 leading-relaxed opacity-80 animate-in slide-in-from-bottom-12 duration-700">
        Our elite chefs have received your coordinates. Preparation has commenced in the Addis Hub.
      </p>

      <div className="flex flex-col sm:flex-row gap-6 animate-in fade-in duration-1000 delay-500">
        <Link 
          to="/orders" 
          className="px-12 py-5 bg-white text-gray-950 rounded-full font-black text-lg uppercase tracking-widest hover:bg-gray-100 hover:scale-105 transition-all shadow-2xl"
        >
          Track Live
        </Link>
        <Link 
          to="/menu" 
          className="px-12 py-5 bg-red-600 text-white rounded-full font-black text-lg uppercase tracking-widest hover:bg-red-700 hover:scale-105 transition-all shadow-2xl"
        >
          Add More
        </Link>
      </div>

      <div className="mt-32 flex items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
         <div className="text-center">
            <i className="ph ph-shield-check text-white text-4xl mb-2"></i>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Verified Payment</p>
         </div>
         <div className="text-center">
            <i className="ph ph-moped text-white text-4xl mb-2"></i>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Courier Enroute</p>
         </div>
         <div className="text-center">
            <i className="ph ph-thermometer text-white text-4xl mb-2"></i>
            <p className="text-[10px] font-black text-white uppercase tracking-widest">Hot Seal Tech</p>
         </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
