import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import SuccessPage from './pages/SuccessPage';
import { ToastProvider } from './context/ToastContext';

// Admin Pages
import AdminLogin from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminOrders from './pages/admin/Orders';
import AdminMenu from './pages/admin/Menu';
import AdminTables from './pages/admin/Tables';
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
              <Route path="/success" element={<SuccessPage />} />

              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />

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
