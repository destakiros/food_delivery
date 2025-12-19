
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      showToast('Invalid email or password', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      <div className="login-bg-animation"></div>
      
      <div className="card-auth w-full max-w-md relative z-10">
        <div className="bg-[#171717] rounded-[22px] p-10 flex flex-col items-center">
          <Link to="/" className="absolute top-6 left-6 text-orange-500 hover:scale-110 transition-transform">
            <i className="ph-bold ph-arrow-left text-2xl"></i>
          </Link>

          <div className="text-center mb-10 pt-4">
             <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="ph-fill ph-user text-orange-500 text-3xl"></i>
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Customer Sign In</h2>
             <p className="text-gray-500 text-sm mt-2 font-bold tracking-widest uppercase">Premium Access</p>
          </div>
          
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="field">
                <i className="ph-fill ph-envelope-simple text-orange-500 text-xl"></i>
                <input
                  type="email"
                  required
                  className="bg-transparent border-none outline-none w-full text-orange-400 font-bold placeholder:text-gray-700"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="field">
                <i className="ph-fill ph-lock-key text-orange-500 text-xl"></i>
                <input
                  type="password"
                  required
                  className="bg-transparent border-none outline-none w-full text-orange-400 font-bold placeholder:text-gray-700"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-2">
              <label className="flex items-center text-gray-400 font-bold cursor-pointer hover:text-white transition">
                <input type="checkbox" className="mr-2 accent-orange-500" />
                STAY SIGNED IN
              </label>
              <Link to="#" className="text-orange-500 font-black hover:underline">FORGOT PIN?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-black text-lg transition-all flex items-center justify-center space-x-3 uppercase tracking-widest bg-gradient-to-r from-[#00ff75] to-[#3700ff] text-black hover:opacity-90 disabled:opacity-50"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : (
                <>
                  <span>Authenticate</span>
                  <i className="ph-bold ph-key"></i>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-10 text-center w-full border-t border-white/5 pt-8">
            <p className="text-sm text-gray-500 font-bold">
              NEW TO THE PLATFORM?
            </p>
            <Link to="/register" className="inline-block mt-3 text-white font-black hover:text-orange-500 transition-colors underline decoration-orange-500 underline-offset-8">
              CREATE ELITE ACCOUNT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
