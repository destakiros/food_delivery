
import React, { Suspense, lazy, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import Navbar from './components/Navbar.jsx';
import BottomNav from './components/BottomNav.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const MenuPage = lazy(() => import('./pages/MenuPage.jsx'));
const FoodDetails = lazy(() => import('./pages/FoodDetails.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess.jsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'));
const OrderTracking = lazy(() => import('./pages/OrderTracking.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const ManageOrders = lazy(() => import('./pages/admin/ManageOrders.jsx'));
const ManageProducts = lazy(() => import('./pages/admin/ManageProducts.jsx'));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers.jsx'));
const ManageReviews = lazy(() => import('./pages/admin/ManageReviews.jsx'));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D62828]"></div>
  </div>
);

const App = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-[#FDF8F1] dark:bg-black transition-colors duration-300">
              <Navbar />
              <main className="flex-grow">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/food/:id" element={<FoodDetails />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    
                    <Route element={<ProtectedRoute />}>
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/order-success" element={<OrderSuccess />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/track/:id" element={<OrderTracking />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                      <Route path="/admin" element={<Dashboard />} />
                      <Route path="/admin/orders" element={<ManageOrders />} />
                      <Route path="/admin/products" element={<ManageProducts />} />
                      <Route path="/admin/users" element={<ManageUsers />} />
                      <Route path="/admin/reviews" element={<ManageReviews />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Suspense>
              </main>
              <BottomNav />
              <footer className="bg-gray-950 text-white pt-16 pb-32 md:pb-16 border-t border-white/5">
                <div className="max-w-6xl mx-auto px-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2">
                      <h3 className="text-2xl font-black text-[#D62828] mb-6 uppercase tracking-tighter">IN-N-<span className="text-white">OUT</span></h3>
                      <p className="text-gray-400 font-medium leading-relaxed max-w-sm">Hand-crafted food delivered with Habesha Hospitality. Quality you can taste, sourced from our neighborhood.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-500">Navigation</h4>
                      <ul className="space-y-3 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        <li><Link to="/menu" className="hover:text-ino-red transition-all">Menu</Link></li>
                        <li><Link to="/orders" className="hover:text-ino-red transition-all">Tracking</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-[10px] uppercase tracking-[0.3em] mb-6 text-gray-500">Legal</h4>
                      <ul className="space-y-3 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                        <li>Privacy Hub</li>
                        <li>Terms of Plate</li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.3em]">&copy; 2025 Online Food Delivery Website Project.</p>
                    <div className="flex gap-8 text-[9px] font-black text-gray-700 uppercase tracking-widest">
                        <span>Admas University</span>
                        <span>Comp. Sci. Dept</span>
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
