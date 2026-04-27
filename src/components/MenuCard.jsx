import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { vibrate } from '../utils/haptics';

const MenuCard = ({ item }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();
  const { addToast } = useToast();
  
  const cartItem = cartItems.find(i => i.id === item.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full border border-gray-100">
      {/* Compact Image */}
      <div className="relative h-28 w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm">
          <span className="text-[9px] font-black text-[#5a3a22] uppercase tracking-wider">{item.category}</span>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div className="mb-2">
          <h3 className="font-bold text-[#3e2723] text-sm leading-tight line-clamp-1">{item.name}</h3>
          <span className="font-bold text-[#b71c1c] text-sm">${parseFloat(item.price).toFixed(2)}</span>
        </div>
        
        {/* Compact Action Button(s) */}
        <div className="mt-1">
          {quantity > 0 ? (
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-100">
              <button 
                onClick={() => {
                  vibrate(50);
                  updateQuantity(item.id, -1);
                }}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-md text-[#5a3a22] shadow-sm active:scale-90 transition-all"
              >
                <Minus size={14} strokeWidth={3} />
              </button>
              <span className="text-xs font-black text-[#5a3a22]">{quantity}</span>
              <button 
                onClick={() => {
                  vibrate(50);
                  updateQuantity(item.id, 1);
                }}
                className="w-7 h-7 flex items-center justify-center bg-[#5a3a22] rounded-md text-white shadow-sm active:scale-90 transition-all"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => {
                vibrate(50);
                addToCart(item);
                addToast(`${item.name} added to cart`);
              }}
              className="w-full bg-[#5a3a22] text-white text-[11px] font-bold py-1.5 rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1 shadow-sm"
            >
              <Plus size={12} strokeWidth={3} />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
