
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      showToast('Account created successfully!', 'success');
      navigate('/');
    } catch (error: any) {
      showToast(error.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-10">
          <Link to="/" className="mb-6 group">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">
              <i className="ph-fill ph-user-plus"></i>
            </div>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight text-center">
            Create <span className="text-orange-500">Account</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Join the Addis elite food club</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
              <div className="relative">
                <i className="ph ph-user absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 font-medium"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email</label>
              <div className="relative">
                <i className="ph ph-envelope absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Password</label>
              <div className="relative">
                <i className="ph ph-lock-key absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-gray-900 font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 font-bold text-center leading-relaxed">
            BY JOINING, YOU AGREE TO OUR <span className="text-orange-500">TERMS OF SERVICE</span> AND CULINARY GUIDELINES.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest hover:bg-orange-600 shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : 'Create Account'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-500 font-black hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center">
        <span className="px-3 py-1 bg-blue-50 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest mb-4">
          Demo Mode Enabled
        </span>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
          &copy; 2025 IN-N-OUT EATS ADDIS
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
