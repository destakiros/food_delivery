
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      showToast('Account Created!', 'success');
      navigate('/');
    } catch (error) {
      showToast('Registration failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-white/5">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase mb-12 text-center">Join <span className="text-ino-red">IN-N-OUT</span></h1>
        <form onSubmit={handleSubmit} className="space-y-6">
           <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-ino-red/10 border-none ring-1 ring-gray-100 dark:ring-white/10 dark:text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
           />
           <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-ino-red/10 border-none ring-1 ring-gray-100 dark:ring-white/10 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
           />
           <input 
            type="password" 
            placeholder="Secure Password" 
            className="w-full px-8 py-5 bg-gray-50 dark:bg-white/5 rounded-2xl outline-none focus:ring-4 focus:ring-ino-red/10 border-none ring-1 ring-gray-100 dark:ring-white/10 dark:text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
           />
           <button 
            type="submit" 
            disabled={loading}
            className="w-full py-6 bg-ino-red text-white rounded-full font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-700 transition-all disabled:opacity-50"
           >
             {loading ? 'Creating Account...' : 'Join Now'}
           </button>
        </form>
        <p className="text-center mt-10 text-gray-400 font-bold">
          Member already? <Link to="/login" className="text-ino-red hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
