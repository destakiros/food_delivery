
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      updateUser({ name, email, phone, address });
      showToast('Profile Updated Successfully', 'success');
    } catch (e) {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="py-24 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-8">
        <header className="mb-16 text-center">
          <div className="relative inline-block mb-8">
             <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=D62828&color=fff&bold=true&size=256`} className="w-40 h-40 rounded-[3rem] shadow-3xl border-4 border-white dark:border-gray-900" alt="Avatar" />
             <button className="absolute bottom-0 right-0 w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center hover:bg-red-600 transition-all border-4 border-white dark:border-gray-900">
                <i className="ph ph-camera text-xl"></i>
             </button>
          </div>
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Elite <span className="text-red-600">Account</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-2">Member ID: #{user?.id.slice(-6).toUpperCase()}</p>
        </header>

        <div className="bg-white dark:bg-gray-900 rounded-[4rem] p-12 shadow-2xl border border-gray-100 dark:border-white/5">
          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Legal Name</label>
              <input 
                type="text" 
                className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-800 rounded-3xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-4 focus:ring-red-600/10 transition-all outline-none font-bold text-gray-900 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Pipeline</label>
              <input 
                type="email" 
                className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-800 rounded-3xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-4 focus:ring-red-600/10 transition-all outline-none font-bold text-gray-900 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Link</label>
              <input 
                type="tel" 
                placeholder="+251 ..."
                className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-800 rounded-3xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-4 focus:ring-red-600/10 transition-all outline-none font-bold text-gray-900 dark:text-white"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Delivery Coordinates (Address)</label>
              <textarea 
                className="w-full px-8 py-5 bg-gray-50 dark:bg-gray-800 rounded-3xl border-none ring-1 ring-gray-200 dark:ring-gray-700 focus:ring-4 focus:ring-red-600/10 transition-all outline-none font-bold text-gray-900 dark:text-white"
                rows={4}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Where should the elite team find you?"
              ></textarea>
            </div>

            <div className="md:col-span-2 pt-6">
              <button 
                type="submit"
                disabled={isUpdating}
                className="w-full py-6 bg-red-600 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest shadow-2xl shadow-red-500/20 hover:bg-red-700 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {isUpdating ? 'Synchronizing...' : 'Update Terminal'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-gray-900 p-10 rounded-[3rem] text-center border border-white/5">
              <i className="ph-fill ph-shield-check text-4xl text-green-500 mb-4 block"></i>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Security</p>
              <p className="text-white font-black uppercase text-xs">Two-Factor Active</p>
           </div>
           <div className="bg-gray-900 p-10 rounded-[3rem] text-center border border-white/5">
              <i className="ph-fill ph-crown text-4xl text-[#FFCA3A] mb-4 block"></i>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tier</p>
              <p className="text-white font-black uppercase text-xs">Platinum Member</p>
           </div>
           <div className="bg-gray-900 p-10 rounded-[3rem] text-center border border-white/5">
              <i className="ph-fill ph-receipt text-4xl text-red-600 mb-4 block"></i>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Volume</p>
              <p className="text-white font-black uppercase text-xs">12 Orders Placed</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
