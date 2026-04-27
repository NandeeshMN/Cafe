import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <div className="w-full min-h-screen bg-[#faf9f6] relative overflow-x-hidden">
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
              {/* Legacy token-based reset route — redirect to OTP flow */}
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
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
