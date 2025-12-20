
import React from 'react';
import { useAuth } from '../../context/AuthContext';

const ManageUsers: React.FC = () => {
  const { allUsers } = useAuth();

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-12">
        <header className="mb-16">
          <h1 className="text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">User <span className="text-red-600">Directory</span></h1>
          <p className="text-2xl text-gray-400 font-bold mt-4">Manage and monitor all platform members.</p>
        </header>

        <div className="bg-white dark:bg-gray-900 rounded-[4rem] shadow-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 text-gray-400 font-black text-xs uppercase tracking-[0.4em]">
                  <th className="px-10 py-8">User Profile</th>
                  <th className="px-10 py-8">Email Address</th>
                  <th className="px-10 py-8">Phone Number</th>
                  <th className="px-10 py-8">Role</th>
                  <th className="px-10 py-8">Status</th>
                  <th className="px-10 py-8 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {allUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-all">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <img src={`https://ui-avatars.com/api/?name=${user.name}&background=D62828&color=fff&bold=true`} className="w-14 h-14 rounded-2xl shadow-lg" alt="" />
                        <div>
                          <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{user.name}</p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID: #{user.id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{user.email}</p>
                    </td>
                    <td className="px-10 py-8">
                      <p className="text-sm font-bold text-gray-600 dark:text-gray-300">{user.phone || 'Not Provided'}</p>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="p-3 text-gray-400 hover:text-red-600 transition-all">
                        <i className="ph-bold ph-pencil-simple text-xl"></i>
                      </button>
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
