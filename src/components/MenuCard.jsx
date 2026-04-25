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
    <div className="flex flex-col">
      <div className="relative rounded-[2rem] overflow-hidden mb-3 aspect-square shadow-sm">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-[10px] font-bold text-[#5a3a22] uppercase tracking-wider">{item.category}</span>
        </div>
      </div>
      
      <div className="px-1 flex-1 flex flex-col">
        <h3 className="font-semibold text-[#3e2723] text-[17px] leading-tight mb-1">{item.name}</h3>
        {/* <p className="text-gray-500 text-xs mb-2 line-clamp-1">{item.description}</p> */}
        
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-bold text-[#b71c1c] text-lg">${item.price.toFixed(2)}</span>
          
          {quantity > 0 ? (
            <div className="flex items-center bg-[#f0ebe1] rounded-full p-1 shadow-sm border border-[#e8dfd1]">
              <button 
                onClick={() => {
                  vibrate(50);
                  updateQuantity(item.id, -1);
                }}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full text-[#5a3a22] shadow-sm active:scale-95 transition-transform"
              >
                <Minus size={18} strokeWidth={3} />
              </button>
              <span className="w-8 text-center font-bold text-[#5a3a22] text-sm">{quantity}</span>
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
            <button 
              onClick={() => {
                vibrate(50);
                addToCart(item);
                addToast(`${item.name} added to cart`);
              }}
              className="w-12 h-12 flex items-center justify-center bg-[#5a3a22] rounded-full text-white shadow-md active:scale-95 transition-transform hover:bg-[#4a2f1d]"
            >
              <Plus size={24} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
