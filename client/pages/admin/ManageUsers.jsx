
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const ManageUsers = () => {
  const { allUsers } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(allUsers);
  }, [allUsers]);

  const updateUser = (userId, updates) => {
    const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    setUsers(updated);
    localStorage.setItem('demo_users', JSON.stringify(updated));
  };

  const toggleSuspension = (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    updateUser(userId, { status: newStatus });
    showToast(`User ${newStatus === 'Active' ? 'Activated' : 'Suspended'}`, 'info');
  };

  const promoteToAdmin = (userId) => {
    updateUser(userId, { role: 'ADMIN' });
    showToast(`User promoted to Command Terminal`, 'success');
  };

  return (
    <div className="py-20 bg-gray-50 dark:bg-black min-h-screen">
      <div className="max-w-ultra mx-auto px-6 sm:px-10 lg:px-16">
        <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-16 tracking-tighter uppercase">Member <span className="text-ino-red">Fleet</span></h1>
        
        <div className="bg-white dark:bg-gray-900 rounded-[4rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                   <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.3em]">
                      <th className="p-10">Legal Node</th>
                      <th className="p-10">Email Pipeline</th>
                      <th className="p-10">Rank</th>
                      <th className="p-10">Pulse</th>
                      <th className="p-10 text-right">Actions</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                   {users.map(u => (
                      <tr key={u.id} className="dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                         <td className="p-10 font-black flex items-center gap-4">
                            <img src={`https://ui-avatars.com/api/?name=${u.name}&background=A44200&color=fff&bold=true`} className="w-10 h-10 rounded-xl" alt="" />
                            {u.name}
                         </td>
                         <td className="p-10 font-bold text-gray-500">{u.email}</td>
                         <td className="p-10">
                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'ADMIN' ? 'bg-ino-red text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                               {u.role}
                            </span>
                         </td>
                         <td className="p-10">
                            <span className={`flex items-center gap-2 font-black uppercase text-[10px] tracking-widest ${u.status === 'Active' ? 'text-green-500' : 'text-red-500'}`}>
                               <span className={`w-2 h-2 rounded-full ${u.status === 'Active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                               {u.status}
                            </span>
                         </td>
                         <td className="p-10 text-right">
                            <div className="flex justify-end gap-3">
                               {u.role !== 'ADMIN' && (
                                 <button onClick={() => promoteToAdmin(u.id)} className="text-[9px] font-black uppercase text-ino-clay hover:text-ino-red">Promote</button>
                               )}
                               <button 
                                 onClick={() => toggleSuspension(u.id, u.status)}
                                 className={`text-[9px] font-black uppercase px-4 py-2 rounded-lg border transition-all ${u.status === 'Active' ? 'text-red-600 border-red-600/20 hover:bg-red-50' : 'text-green-600 border-green-600/20 hover:bg-green-50'}`}
                               >
                                 {u.status === 'Active' ? 'Suspend' : 'Activate'}
                               </button>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
