
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const BottomNav = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-black/95 backdrop-blur-lg border-t border-ino-clay/10 px-6 py-3 flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
      <Link to="/" className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-ino-red' : 'text-gray-400'}`}>
        <i className={`ph-fill ${isActive('/') ? 'ph-house' : 'ph-house-line'} text-2xl`}></i>
        <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
      </Link>
      <Link to="/menu" className={`flex flex-col items-center gap-1 ${isActive('/menu') ? 'text-ino-red' : 'text-gray-400'}`}>
        <i className={`ph-fill ${isActive('/menu') ? 'ph-book-open' : 'ph-book'} text-2xl`}></i>
        <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
      </Link>
      <Link to="/cart" className={`flex flex-col items-center gap-1 relative ${isActive('/cart') ? 'text-ino-red' : 'text-gray-400'}`}>
        <i className={`ph-fill ${isActive('/cart') ? 'ph-shopping-basket' : 'ph-shopping-cart'} text-2xl`}></i>
        {totalItems > 0 && (
          <span className="absolute -top-1 -right-1 bg-ino-red text-white text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center">
            {totalItems}
          </span>
        )}
        <span className="text-[10px] font-black uppercase tracking-tighter">Cart</span>
      </Link>
      <Link to={user ? "/profile" : "/login"} className={`flex flex-col items-center gap-1 ${isActive('/profile') || isActive('/login') ? 'text-ino-red' : 'text-gray-400'}`}>
        <i className={`ph-fill ${isActive('/profile') ? 'ph-user' : 'ph-user-circle'} text-2xl`}></i>
        <span className="text-[10px] font-black uppercase tracking-tighter">{user ? 'Me' : 'Join'}</span>
      </Link>
    </div>
  );
};

export default BottomNav;
