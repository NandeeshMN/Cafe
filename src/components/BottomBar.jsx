import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Utensils, ShoppingBag, ReceiptText } from 'lucide-react';
import { useCart } from '../context/CartContext';

const BottomBar = () => {
  const { getCartCount, getCartTotal, previousOrder } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = getCartCount();
  const cartTotal = getCartTotal();

  // If we are on the menu page and there are items in the cart, show the floating checkout bar above the nav
  const isMenuPage = location.pathname.startsWith('/table') || location.pathname === '/';
  const showFloatingCart = isMenuPage && cartCount > 0;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50 pointer-events-none">
      {/* Floating Cart Summary on Menu */}
      {showFloatingCart && (
        <div className="px-4 pb-4 pointer-events-auto">
          <div className="bg-[#4a2f1d] text-white rounded-2xl p-4 flex items-center justify-between shadow-xl min-h-[64px]">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag size={28} />
                <span className="absolute -top-2 -right-2 bg-[#d84315] text-white text-[11px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md">
                  {cartCount}
                </span>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-[10px] text-white/80 uppercase font-bold tracking-wider leading-none mb-1">{cartCount} Items</span>
                <span className="font-bold text-lg leading-none">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={() => navigate('/cart')}
              className="bg-white text-[#4a2f1d] px-5 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-100 active:scale-95 transition-all shadow-sm"
            >
              {previousOrder ? 'Add More Items' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Main Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-2 flex justify-around items-center pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pointer-events-auto">
        <NavLink 
          to="/" 
          className={({ isActive }) => `flex flex-col items-center justify-center min-h-[64px] min-w-[64px] flex-1 transition-colors ${isActive ? 'text-[#b71c1c]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <Utensils size={26} strokeWidth={2.5} className="mb-1" />
          <span className="text-[11px] font-bold">Menu</span>
        </NavLink>
        
        <NavLink 
          to="/cart" 
          className={({ isActive }) => `flex flex-col items-center justify-center min-h-[64px] min-w-[64px] flex-1 transition-colors ${isActive ? 'text-[#b71c1c]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <div className="relative mb-1">
             <ShoppingBag size={26} strokeWidth={2.5} />
             {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#d84315] text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full border-2 border-white">
                  {cartCount}
                </span>
             )}
          </div>
          <span className="text-[11px] font-bold">Cart</span>
        </NavLink>
        
        <NavLink 
          to="/orders" 
          className={({ isActive }) => `flex flex-col items-center justify-center min-h-[64px] min-w-[64px] flex-1 transition-colors ${isActive ? 'text-[#b71c1c]' : 'text-gray-400 hover:text-gray-600'}`}
        >
          <ReceiptText size={26} strokeWidth={2.5} className="mb-1" />
          <span className="text-[11px] font-bold">Orders</span>
        </NavLink>
      </div>
    </div>
  );
};

export default BottomBar;
