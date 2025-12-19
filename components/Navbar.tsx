
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { UserRole } from '../types';
import CartSidebar from './CartSidebar';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const unreadNotifications = user?.notifications?.filter(n => !n.read).length || 0;

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 bg-orange-500 rounded-full flex items-center justify-center text-yellow-400 font-bold text-xl border-2 border-yellow-400 shadow-sm group-hover:scale-105 transition-transform">
                <i className="ph-fill ph-arrow-fat-right"></i>
              </div>
              <span className="text-2xl font-black tracking-tighter text-orange-600 dark:text-orange-500">
                IN-N-OUT <span className="text-gray-900 dark:text-white">EATS</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/menu" className="text-gray-600 dark:text-gray-300 hover:text-orange-500 font-bold transition-colors">Menu</Link>
              
              <div className="flex items-center space-x-6">
                {/* Dark Mode Switch */}
                <label className="ui-switch">
                  <input 
                    type="checkbox" 
                    checked={isDarkMode} 
                    onChange={() => setIsDarkMode(!isDarkMode)} 
                  />
                  <div className="slider">
                    <div className="circle"></div>
                  </div>
                </label>

                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition relative"
                  >
                    <i className="ph ph-bell text-2xl"></i>
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700 p-4 max-h-[400px] overflow-y-auto">
                      <h4 className="font-black text-sm text-gray-400 uppercase tracking-widest mb-4">Notifications</h4>
                      {!user || user.notifications.length === 0 ? (
                        <p className="text-gray-500 text-xs italic text-center py-4">No new messages.</p>
                      ) : (
                        <div className="space-y-3">
                          {user.notifications.map((n, i) => (
                            <div key={i} className={`p-3 rounded-xl ${n.read ? 'bg-gray-50 dark:bg-gray-700/50 opacity-60' : 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500'}`}>
                              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{n.message}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => setIsCartOpen(true)} 
                  className="relative p-2.5 text-gray-700 dark:text-gray-300 hover:text-orange-500 transition-all hover:scale-110"
                >
                  <i className="ph ph-shopping-cart text-2xl"></i>
                  {totalItems > 0 && (
                    <span className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-3 focus:outline-none">
                      <img src={`https://ui-avatars.com/api/?name=${user.name}&background=f97316&color=fff&bold=true`} className="w-10 h-10 rounded-xl" alt="avatar" />
                      <div className="text-left hidden lg:block">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Account</p>
                        <p className="text-sm font-black text-gray-800 dark:text-white leading-none">{user.name.split(' ')[0]}</p>
                      </div>
                    </button>
                    <div className="absolute right-0 w-56 mt-3 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                      <Link to="/orders" className="flex items-center space-x-3 px-5 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                        <i className="ph ph-clock-counter-clockwise"></i>
                        <span>Order History</span>
                      </Link>
                      {user.role === UserRole.ADMIN && (
                        <Link to="/admin" className="flex items-center space-x-3 px-5 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition-colors">
                          <i className="ph ph-shield-check"></i>
                          <span>Admin Portal</span>
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <i className="ph ph-sign-out"></i> 
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <Link to="/login" className="px-6 py-2.5 text-sm font-black text-orange-500 hover:text-orange-600">Login</Link>
                    <Link to="/register" className="px-6 py-2.5 text-sm font-black text-white bg-orange-500 rounded-full hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all hover:-translate-y-0.5">Register</Link>
                  </div>
                )}
              </div>
            </div>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-700 dark:text-white">
              <i className={`ph ${isMenuOpen ? 'ph-x' : 'ph-list'} text-3xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-8 space-y-4 shadow-xl">
            <Link to="/menu" className="block text-xl font-black text-gray-800 dark:text-white">Menu</Link>
            {user && (
              <Link to="/orders" className="block text-xl font-black text-gray-800 dark:text-white">My Orders</Link>
            )}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
              {user ? (
                <button onClick={handleLogout} className="w-full text-left text-xl font-black text-red-600">Logout</button>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link to="/login" className="w-full py-4 text-center text-lg font-black text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-2xl">Login</Link>
                  <Link to="/register" className="w-full py-4 text-center text-lg font-black text-white bg-orange-500 rounded-2xl">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
