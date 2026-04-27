import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { vibrate } from '../utils/haptics';

const CartItem = ({ item, isEditable = true }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center bg-white p-3 rounded-2xl mb-3 shadow-sm border border-gray-100">
      <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden mr-4">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-semibold text-[#3e2723] text-base truncate pr-2">{item.name}</h4>
          {isEditable && (
            <button 
              onClick={() => {
                vibrate(50);
                removeFromCart(item.id);
              }}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
        
        <p className="text-xs text-gray-500 mb-2 truncate">{item.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#b71c1c]">${parseFloat(item.price).toFixed(2)}</span>
          
          {isEditable ? (
            <div className="flex items-center bg-[#f0ebe1] rounded-full p-1 border border-[#e8dfd1]">
              <button 
                onClick={() => {
                  vibrate(50);
                  updateQuantity(item.id, -1);
                }}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-[#5a3a22] shadow-sm active:scale-95 transition-transform"
              >
                <Minus size={18} strokeWidth={3} />
              </button>
              <span className="w-8 text-center font-bold text-[#5a3a22] text-sm">{item.quantity}</span>
              <button 
                onClick={() => {
                  vibrate(50);
                  updateQuantity(item.id, 1);
                }}
                className="w-10 h-10 flex items-center justify-center bg-[#5a3a22] rounded-full text-white shadow-sm active:scale-95 transition-transform"
              >
                <Plus size={18} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <span className="text-sm font-semibold text-gray-500">Qty: {item.quantity}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;
