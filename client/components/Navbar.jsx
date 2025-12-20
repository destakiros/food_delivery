
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import CartSidebar from './CartSidebar.jsx';
import AIConcierge from './AIConcierge.jsx';

const Navbar = () => {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-ino-clay/5 h-20 md:h-24 flex items-center transition-all duration-300">
        <div className="max-w-content mx-auto px-6 md:px-12 w-full flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-ino-red rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl shadow-xl shadow-ino-red/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <i className="ph-fill ph-cooking-pot"></i>
            </div>
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-gray-950 dark:text-white uppercase leading-none">
              IN-N-<span className="text-ino-red">OUT</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-10">
            <Link to="/menu" className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:text-ino-red transition-colors">Today's Menu</Link>
            <Link to="/orders" className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:text-ino-red transition-colors">Live Tracking</Link>
          </div>

          <div className="flex items-center space-x-3 md:space-x-6">
            <button 
              onClick={() => setIsAIOpen(true)}
              className="px-4 md:px-6 py-2.5 bg-ino-clay text-white rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest shadow-xl shadow-ino-clay/10 flex items-center gap-2 hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <i className="ph-fill ph-chat-circle-dots text-lg"></i>
              <span className="hidden sm:inline">Concierge</span>
            </button>

            <div className="h-8 w-px bg-ino-clay/10 hidden md:block"></div>

            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-3 text-gray-400 hover:text-ino-yellow dark:hover:text-ino-yellow transition-all duration-300"
                aria-label="Toggle dark mode"
              >
                <i className={`ph-fill ${isDarkMode ? 'ph-sun' : 'ph-moon'} text-2xl`}></i>
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="p-3 text-gray-400 hover:text-ino-red relative group transition-all"
              >
                <i className="ph-bold ph-shopping-basket text-2xl"></i>
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 bg-ino-red text-white text-[9px] font-black h-5 w-5 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>

            {user ? (
              <Link to="/profile" className="flex items-center space-x-3 md:pl-6 md:border-l border-ino-clay/10 group">
                <div className="text-right hidden xl:block">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Neighbor</p>
                  <p className="text-xs font-black text-gray-900 dark:text-white uppercase">{user.name.split(' ')[0]}</p>
                </div>
                <img src={`https://ui-avatars.com/api/?name=${user.name}&background=A44200&color=fff&bold=true`} className="w-10 h-10 rounded-2xl border-2 border-transparent group-hover:border-ino-clay transition-all" alt="Profile" />
              </Link>
            ) : (
              <Link to="/login" className="px-6 py-2.5 bg-gray-950 text-white dark:bg-white dark:text-black rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-ino-red hover:text-white transition-all shadow-lg active:scale-95">Sign In</Link>
            )}
          </div>
        </div>
      </nav>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AIConcierge isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};

export default Navbar;
