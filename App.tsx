
import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const MenuPage = lazy(() => import('./pages/MenuPage'));
const FoodDetails = lazy(() => import('./pages/FoodDetails'));
const CartPage = lazy(() => import('./pages/CartPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const OrderTracking = lazy(() => import('./pages/OrderTracking'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const ManageOrders = lazy(() => import('./pages/admin/ManageOrders'));
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D62828]"></div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-[#fafafa]">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/food/:id" element={<FoodDetails />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    {/* Customer Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/track/:id" element={<OrderTracking />} />
                    </Route>

                    {/* Admin Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
                      <Route path="/admin" element={<Dashboard />} />
                      <Route path="/admin/orders" element={<ManageOrders />} />
                      <Route path="/admin/products" element={<ManageProducts />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <footer className="bg-gray-950 text-white py-32 border-t border-white/5">
                <div className="max-w-[1600px] mx-auto px-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
                    <div className="md:col-span-1">
                      <h3 className="text-4xl font-black text-[#D62828] mb-8 tracking-tighter">IN-N-OUT <span className="text-white">EATS</span></h3>
                      <p className="text-gray-500 font-bold leading-relaxed mb-10">Addis Ababa's gold standard for fresh, elite delivery. Quality you can taste in every single bite.</p>
                      <div className="flex space-x-6">
                        <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#D62828] transition-all"><i className="ph-fill ph-instagram-logo text-2xl"></i></a>
                        <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#D62828] transition-all"><i className="ph-fill ph-twitter-logo text-2xl"></i></a>
                        <a href="#" className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-[#D62828] transition-all"><i className="ph-fill ph-facebook-logo text-2xl"></i></a>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-[0.4em] mb-10 text-gray-400">Neighborhood Hubs</h4>
                      <ul className="space-y-4 text-gray-500 font-black uppercase text-[10px] tracking-widest">
                        <li><span className="hover:text-white transition-colors cursor-pointer">Bole Medhanialem</span></li>
                        <li><span className="hover:text-white transition-colors cursor-pointer">Piazza Center</span></li>
                        <li><span className="hover:text-white transition-colors cursor-pointer">Old Airport</span></li>
                        <li><span className="hover:text-white transition-colors cursor-pointer">Kazanchis Diplomatic</span></li>
                        <li><span className="hover:text-white transition-colors cursor-pointer">Summit Area</span></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-[0.4em] mb-10 text-gray-400">Platform</h4>
                      <ul className="space-y-4 text-gray-500 font-bold">
                        <li><Link to="/menu" className="hover:text-[#D62828] transition-colors">The Digital Menu</Link></li>
                        <li><Link to="/" className="hover:text-[#D62828] transition-colors">Our Story</Link></li>
                        <li><Link to="/" className="hover:text-[#D62828] transition-colors">Hygiene Protocol</Link></li>
                        <li><Link to="/" className="hover:text-[#D62828] transition-colors">Partner with Us</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-[0.4em] mb-10 text-gray-400">Concierge</h4>
                      <ul className="space-y-4 text-gray-500 font-bold">
                        <li><Link to="/" className="hover:text-[#D62828] transition-colors">Support Terminal</Link></li>
                        <li><Link to="/" className="hover:text-[#D62828] transition-colors">Track Order</Link></li>
                        <li><Link to="/" className="hover:text-[#D62828] transition-colors">Privacy Shield</Link></li>
                        <li><Link to="/" className="hover:text-[#D62828] transition-colors">Refund Protocol</Link></li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                     <p className="text-gray-700 font-black text-[10px] uppercase tracking-[0.3em]">&copy; 2025 IN-N-OUT ADDIS LEGACY. ALL RIGHTS RESERVED.</p>
                     <div className="flex gap-12 text-[10px] font-black text-gray-700 uppercase tracking-widest">
                        <span>EST. ADDIS ABABA, ETHIOPIA</span>
                        <span>QUALITY SERVICE 24/7</span>
                     </div>
                  </div>
                </div>
              </footer>
            </div>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </HashRouter>
  );
};

export default App;
