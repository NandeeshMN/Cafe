import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import SuccessPage from './pages/SuccessPage';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <ToastProvider>
      <CartProvider>
        <Router>
          <div className="w-full min-h-screen bg-[#faf9f6] relative overflow-x-hidden">
            <Routes>
              <Route path="/" element={<MenuPage />} />
              {/* Realistically, table ID routing might be /table/:id */}
              <Route path="/table/:id" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/success" element={<SuccessPage />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
