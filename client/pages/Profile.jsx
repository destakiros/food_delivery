
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      updateUser({ name, email, phone, address });
      showToast('Profile Terminal Updated', 'success');
    } catch (e) {
      showToast('Update failed', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="py-12 md:py-24 bg-gray-50 dark:bg-black min-h-screen pb-32">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-12 flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-900 p-10 rounded-[3rem] shadow-xl border border-gray-100 dark:border-white/5">
          <div className="relative group">
            <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=D62828&color=fff&bold=true&size=256`} className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-gray-800" alt="Avatar" />
            <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-gray-950 text-white rounded-2xl flex items-center justify-center hover:bg-ino-red transition-all border-4 border-white dark:border-gray-900 shadow-xl">
               <i className="ph ph-camera text-xl"></i>
            </button>
          </div>
          <div className="text-center md:text-left flex-grow">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
              <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase leading-none">{user?.name}</h1>
              <span className="px-4 py-1.5 bg-ino-yellow/10 text-ino-clay text-[9px] font-black uppercase tracking-widest rounded-full border border-ino-yellow/20">Platinum Member</span>
            </div>
            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px] mb-6">Security Terminal Active • ID: {user?.id.slice(-8).toUpperCase()}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
               <Link to="/orders" className="px-6 py-2 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ino-red hover:text-white transition-all">Order Archive</Link>
               <button onClick={logout} className="px-6 py-2 border border-gray-200 dark:border-white/10 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-ino-red transition-all">Sign Out</button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[3rem] p-10 shadow-xl border border-gray-100 dark:border-white/5">
              <h3 className="text-xl font-black uppercase tracking-tight mb-8 dark:text-white">Legal <span className="text-ino-red">Details</span></h3>
              <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                  <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none outline-none font-bold dark:text-white focus:ring-2 focus:ring-ino-red/30" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Node</label>
                  <input type="email" className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none outline-none font-bold dark:text-white opacity-50" value={email} readOnly />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Addis Delivery Address</label>
                  <textarea className="w-full px-6 py-4 bg-gray-50 dark:bg-white/5 rounded-2xl border-none outline-none font-bold dark:text-white focus:ring-2 focus:ring-ino-red/30" rows="4" value={address} onChange={e => setAddress(e.target.value)} placeholder="Where do we drop the flavor?"></textarea>
                </div>
                <button type="submit" disabled={isUpdating} className="col-span-2 py-5 bg-ino-clay text-white rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95 disabled:opacity-50">
                  {isUpdating ? 'Synchronizing...' : 'Save Member Pulse'}
                </button>
              </form>
           </div>

           <div className="space-y-8">
              <div className="warm-card p-10 rounded-[3rem] text-center flex flex-col items-center">
                 <i className="ph-fill ph-shield-check text-5xl text-green-500 mb-6"></i>
                 <h4 className="font-black dark:text-white uppercase tracking-tighter text-xl mb-2">Two-Factor</h4>
                 <p className="text-gray-500 text-xs font-bold leading-relaxed mb-6 italic">Secure connection to the Addis Kitchen grid established.</p>
                 <span className="px-4 py-1.5 bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-[0.3em] rounded-full border border-green-500/20">Verified</span>
              </div>

              <div className="bg-gray-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                 <i className="ph-fill ph-crown absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12"></i>
                 <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4">Account Rewards</p>
                 <p className="text-3xl font-black tracking-tighter mb-2">240 <span className="text-ino-yellow">Points</span></p>
                 <p className="text-[10px] font-bold text-gray-400 mb-8 italic leading-snug">Order 2 more Double-Doubles to reach Elite Gold Tier.</p>
                 <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Redeem Hub</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
