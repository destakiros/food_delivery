
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserRole } from '../types';
import CartSidebar from './CartSidebar';
import AIConcierge from './AIConcierge';

const Navbar: React.FC = () => {
  const { user, logout, markNotificationsAsRead } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [showNotifications, setShowNotifications] = useState(false);

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

  const toggleNotifications = () => {
    if (!showNotifications) {
      setTimeout(() => markNotificationsAsRead(), 2500);
    }
    setShowNotifications(!showNotifications);
  };

  const unreadCount = user?.notifications?.filter(n => !n.read).length || 0;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5">
        <div className="max-w-ultra mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex justify-between h-24 items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="w-12 h-12 bg-ino-red rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-red-500/30 group-hover:rotate-12 transition-all">
                <i className="ph-fill ph-grid-four"></i>
              </div>
              <span className="text-3xl font-black tracking-tighter text-gray-950 dark:text-white uppercase">
                IN-N-<span className="text-ino-red">OUT</span>
              </span>
            </Link>

            <div className="hidden xl:flex items-center space-x-12">
              <Link to="/menu" className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-ino-red dark:text-gray-400 dark:hover:text-white transition-all">Menu</Link>
              <Link to="/orders" className="text-sm font-black uppercase tracking-widest text-gray-500 hover:text-ino-red dark:text-gray-400 dark:hover:text-white transition-all">Track Order</Link>
              
              <div className="h-8 w-px bg-gray-100 dark:bg-white/10 mx-4"></div>

              <div className="flex items-center space-x-6">
                <button 
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-3 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-ino-yellow hover:text-black transition-all"
                  aria-label="Toggle Theme"
                >
                  <i className={`ph-fill ${isDarkMode ? 'ph-sun' : 'ph-moon'} text-xl`}></i>
                </button>

                <button 
                  onClick={() => setIsAIOpen(true)}
                  className="px-6 py-3 bg-ino-red text-white rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  <i className="ph-fill ph-microphone-stage text-lg animate-pulse"></i>
                  <span>Concierge</span>
                </button>

                <div className="relative">
                  <button 
                    onClick={toggleNotifications}
                    className="p-3 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-2xl hover:text-ino-red transition-all relative"
                  >
                    <i className="ph ph-bell text-xl"></i>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-ino-red text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-4 w-[400px] bg-white dark:bg-gray-900 shadow-[0_30px_100px_rgba(0,0,0,0.3)] rounded-[2.5rem] border border-gray-100 dark:border-white/5 p-8 max-h-[500px] overflow-y-auto animate-in slide-in-from-top-4 duration-300">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Notifications</h4>
                        <button onClick={markNotificationsAsRead} className="text-[10px] font-black text-ino-red uppercase hover:underline">Clear All</button>
                      </div>
                      <div className="space-y-4">
                        {!user || user.notifications.length === 0 ? (
                          <p className="text-center py-10 text-gray-400 font-bold italic">Nothing to show.</p>
                        ) : (
                          user.notifications.map((n, i) => (
                            <div key={i} className={`p-5 rounded-3xl transition-all ${n.read ? 'bg-gray-50 dark:bg-white/5 opacity-50' : 'bg-red-50 dark:bg-red-900/10 border-l-4 border-ino-red shadow-lg'}`}>
                              <p className="text-xs font-black text-gray-900 dark:text-white leading-relaxed">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-2 uppercase font-black tracking-widest">{n.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="p-3 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-2xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all relative"
                >
                  <i className="ph ph-shopping-bag text-xl"></i>
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black dark:bg-ino-red text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-4 p-1.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all">
                      <img src={`https://ui-avatars.com/api/?name=${user.name}&background=D62828&color=fff&bold=true`} className="w-10 h-10 rounded-xl" alt="P" />
                      <div className="text-left hidden 2xl:block pr-2">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Active Member</p>
                        <p className="text-xs font-black text-gray-950 dark:text-white leading-none">{user.name.split(' ')[0]}</p>
                      </div>
                    </button>
                    <div className="absolute right-0 w-64 mt-4 py-4 bg-white dark:bg-gray-900 rounded-[2rem] shadow-3xl border border-gray-100 dark:border-white/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible translate-y-2 group-hover:translate-y-0 transition-all">
                       <Link to="/profile" className="flex items-center space-x-4 px-8 py-3 text-[11px] font-black uppercase text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                        <i className="ph ph-user-circle text-lg"></i> <span>Profile</span>
                       </Link>
                       {user.role === UserRole.ADMIN && (
                         <Link to="/admin" className="flex items-center space-x-4 px-8 py-3 text-[11px] font-black uppercase text-ino-red hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
                          <i className="ph ph-shield-check text-lg"></i> <span>Dashboard</span>
                         </Link>
                       )}
                       <div className="h-px bg-gray-100 dark:bg-white/5 my-3 mx-8"></div>
                       <button onClick={logout} className="w-full flex items-center space-x-4 px-8 py-3 text-[11px] font-black uppercase text-gray-400 hover:text-ino-red transition-all">
                        <i className="ph ph-power text-lg"></i> <span>Logout</span>
                       </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="px-8 py-3 bg-gray-950 dark:bg-white text-white dark:text-black rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all">Log In</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <AIConcierge isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </>
  );
};

export default Navbar;
