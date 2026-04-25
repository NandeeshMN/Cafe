import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowRight, Info, FileText } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import BottomBar from '../components/BottomBar';
import PaymentModal from '../components/PaymentModal';
import InstructionsModal from '../components/InstructionsModal';
import { placeOrder } from '../services/api';
import { vibrate } from '../utils/haptics';

const CartPage = () => {
  const { cartItems, previousOrder, getCartTotal, placeOrderSuccess } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const hasNewItems = cartItems.length > 0;
  const hasPreviousOrder = previousOrder && previousOrder.items && previousOrder.items.length > 0;
  
  const newItemsTotal = getCartTotal();
  const paidTotal = hasPreviousOrder ? previousOrder.total : 0;
  const [tipPercentage, setTipPercentage] = useState(0);

  // Tax logic (e.g. 8%)
  const newTax = newItemsTotal * 0.08;
  const tipAmount = newItemsTotal * tipPercentage;
  const totalDue = newItemsTotal + newTax + tipAmount;

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const handleOpenPaymentModal = () => {
    if (!hasNewItems) return;
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = async () => {
    try {
      const result = await placeOrder({ 
        items: cartItems, 
        total: totalDue,
        instructions: specialInstructions 
      });
      placeOrderSuccess(result);
      setSpecialInstructions('');
      setIsPaymentModalOpen(false);
      navigate('/success');
    } catch (error) {
      console.error("Payment failed", error);
      setIsPaymentModalOpen(false);
    }
  };

  if (!hasNewItems && !hasPreviousOrder) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col">
        <header className="bg-[#faf9f6] px-5 py-4 flex items-center gap-2 border-b border-gray-100">
          <Coffee className="text-[#5a3a22]" size={24} />
          <h1 className="font-bold text-xl text-[#3e2723]">Artisanal Cafe</h1>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Coffee className="text-gray-400" size={40} />
          </div>
          <h2 className="text-xl font-bold text-[#3e2723] mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-[#5a3a22] text-white px-8 py-3 rounded-full font-bold shadow-md"
          >
            Browse Menu
          </button>
        </div>
        <BottomBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32">
      <header className="bg-[#faf9f6] px-5 py-4 flex items-center justify-between border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Coffee className="text-[#5a3a22]" size={24} />
          <h1 className="font-bold text-xl text-[#3e2723]">Artisanal Cafe</h1>
        </div>
        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User profile" className="w-full h-full" />
        </div>
      </header>

      <main className="px-5 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#3e2723] mb-1">
            {hasPreviousOrder ? 'Your Orders' : 'Your Cart'}
          </h2>
          <p className="text-sm text-gray-500">
            {hasPreviousOrder ? 'Manage your current and additional selections.' : 'Review your artisanal selection'}
          </p>
        </div>

        {/* Previous Order Section */}
        {hasPreviousOrder && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase">Paid Order</h3>
              <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                Preparing
              </span>
            </div>
            <div className="space-y-3 opacity-75">
              {previousOrder.items.map((item, idx) => (
                <CartItem key={`paid-${item.id}-${idx}`} item={item} isEditable={false} />
              ))}
            </div>
          </div>
        )}

        {/* New Cart Section */}
        {hasNewItems && (
          <div className="mb-8">
            {hasPreviousOrder && (
              <h3 className="text-xs font-bold text-[#3e2723] tracking-wider uppercase mb-3">Additional Order</h3>
            )}
            <div className="space-y-3">
              {cartItems.map((item, idx) => (
                <CartItem key={`new-${item.id}-${idx}`} item={item} isEditable={true} />
              ))}
            </div>
            
            <button 
              onClick={() => setIsInstructionsModalOpen(true)}
              className="text-[#8d6e63] flex items-center gap-2 hover:bg-[#f0ebe1]/50 p-2 rounded-xl transition-colors active:scale-95 mt-4"
            >
              <FileText size={20} />
              <span className="text-sm font-semibold">
                {specialInstructions ? 'Edit Instructions' : 'Add Special Instructions'}
              </span>
            </button>
            {specialInstructions && (
              <p className="text-xs text-gray-500 italic mt-1 px-2 line-clamp-2">
                "{specialInstructions}"
              </p>
            )}
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-[#f2efe9] rounded-3xl p-6 mb-6">
          <h3 className="text-sm font-semibold text-[#3e2723] mb-4">Order Summary</h3>
          
          <div className="space-y-3 text-sm mb-4 border-b border-[#e2dcd2] pb-4">
            {hasPreviousOrder && (
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Paid)</span>
                <span>${paidTotal.toFixed(2)}</span>
              </div>
            )}
            {hasNewItems && (
              <div className="flex justify-between text-gray-600">
                <span>New Items</span>
                <span>${newItemsTotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Taxes & Fees (New)</span>
              <span>${newTax.toFixed(2)}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between text-gray-600 mt-3 border-t border-dashed border-gray-200 pt-3">
                <span>Tip ({tipPercentage * 100}%)</span>
                <span>${tipAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          {hasNewItems && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-[#3e2723] mb-2">Show Support</h4>
              <div className="flex gap-2">
                {[0, 0.05, 0.10, 0.15].map(percent => (
                  <button
                    key={percent}
                    onClick={() => {
                      vibrate(50);
                      setTipPercentage(percent);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
                      tipPercentage === percent 
                        ? 'bg-[#5a3a22] text-white border-[#5a3a22] shadow-md' 
                        : 'bg-white text-gray-500 border-gray-200 shadow-sm hover:bg-gray-50'
                    }`}
                  >
                    {percent === 0 ? 'No Tip' : `${percent * 100}%`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasPreviousOrder && hasNewItems && (
            <div className="bg-[#5a3a22] text-white/90 p-3 rounded-xl flex items-start gap-3 mb-4 text-xs">
              <Info size={16} className="flex-shrink-0 mt-0.5 text-[#e6d0b3]" />
              <p>You are paying only for additional items</p>
            </div>
          )}

          <div className="flex justify-between items-end mb-2">
            <span className="font-bold text-xl text-[#3e2723]">Total Due</span>
            <span className="font-extrabold text-3xl text-[#b71c1c] bg-[#ffe8db] px-3 py-1 rounded-lg">${totalDue.toFixed(2)}</span>
          </div>
        </div>
      </main>

      {/* Sticky Payment CTA */}
      <div className="fixed bottom-[65px] left-0 right-0 bg-[#faf9f6]/95 backdrop-blur-md border-t border-gray-200 p-4 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-safe">
        <button
          onClick={handleOpenPaymentModal}
          disabled={!hasNewItems}
          className={`w-full h-14 rounded-2xl font-bold flex justify-center items-center gap-2 shadow-lg transition-all active:scale-95 ${
            !hasNewItems 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none' 
              : 'bg-[#4a2f1d] text-white hover:bg-[#3e2723]'
          }`}
        >
          <span className="text-lg">{hasPreviousOrder ? 'Pay for Additional Order' : 'Pay for Order'}</span>
          <span className="opacity-80">(${totalDue.toFixed(2)})</span>
          <ArrowRight size={20} />
        </button>
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        onConfirm={handleConfirmPayment}
        totalDue={totalDue}
      />

      <InstructionsModal 
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
        initialInstructions={specialInstructions}
        onSave={setSpecialInstructions}
      />

      <BottomBar />
    </div>
  );
};

export default CartPage;
