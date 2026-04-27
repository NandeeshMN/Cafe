import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import SuccessPage from './pages/SuccessPage';
import OrdersPage from './pages/OrdersPage';
import { ToastProvider } from './context/ToastContext';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminMenu from './pages/admin/Menu';
import AdminTables from './pages/admin/Tables';
import ForgotPassword from './pages/admin/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Wrapper to separate Customer Mobile view from Admin Desktop view
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) {
    return (
      <div className="min-h-screen bg-white">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center selection:bg-[#5a3a22]/10">
      <div className="w-full max-w-[480px] bg-[#faf9f6] relative min-h-screen shadow-2xl shadow-black/5 flex flex-col overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <AppLayout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MenuPage />} />
              <Route path="/table/:id" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/orders" element={<OrdersPage />} />

              {/* Admin Auth Routes (Public) */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/forgot-password" element={<ForgotPassword />} />
              <Route path="/admin/reset-password" element={<Navigate to="/admin/forgot-password" replace />} />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="menu" element={<AdminMenu />} />
                <Route path="tables" element={<AdminTables />} />
              </Route>
            </Routes>
          </AppLayout>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
