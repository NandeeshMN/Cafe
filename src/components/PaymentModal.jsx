import React, { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onConfirm, totalDue }) => {
  const [selectedMethod, setSelectedMethod] = useState('UPI');
  const [step, setStep] = useState('SELECT'); // 'SELECT', 'PROCESSING', 'SUCCESS'

  useEffect(() => {
    if (isOpen) {
      setStep('SELECT');
      setSelectedMethod('UPI');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePay = () => {
    setStep('PROCESSING');
    
    // Simulate payment processing time
    setTimeout(() => {
      setStep('SUCCESS');
      
      // Wait a moment on success before calling onConfirm
      setTimeout(() => {
        onConfirm();
      }, 1000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#faf9f6] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        
        {step === 'SELECT' && (
          <>
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-[#3e2723]">Payment Method</h2>
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="bg-[#ffe8db] text-[#b71c1c] text-center p-4 rounded-2xl mb-6 border border-[#ffccb3]">
                <p className="text-sm font-bold uppercase tracking-wider mb-1">Amount to Pay</p>
                <p className="text-3xl font-extrabold">${totalDue.toFixed(2)}</p>
              </div>

              <div className="space-y-3 mb-8">
                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-colors ${selectedMethod === 'UPI' ? 'border-[#5a3a22] bg-white shadow-sm' : 'border-transparent bg-gray-100 hover:bg-gray-200'}`}>
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-4">
                    <Smartphone size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#3e2723]">UPI / Mobile Wallet</h4>
                    <p className="text-xs text-gray-500">Google Pay, Apple Pay</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'UPI' ? 'border-[#5a3a22]' : 'border-gray-300'}`}>
                    {selectedMethod === 'UPI' && <div className="w-3 h-3 bg-[#5a3a22] rounded-full" />}
                  </div>
                  <input type="radio" name="payment" value="UPI" checked={selectedMethod === 'UPI'} onChange={() => setSelectedMethod('UPI')} className="hidden" />
                </label>

                <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-colors ${selectedMethod === 'CARD' ? 'border-[#5a3a22] bg-white shadow-sm' : 'border-transparent bg-gray-100 hover:bg-gray-200'}`}>
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mr-4">
                    <CreditCard size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#3e2723]">Credit / Debit Card</h4>
                    <p className="text-xs text-gray-500">Visa, MasterCard</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'CARD' ? 'border-[#5a3a22]' : 'border-gray-300'}`}>
                    {selectedMethod === 'CARD' && <div className="w-3 h-3 bg-[#5a3a22] rounded-full" />}
                  </div>
                  <input type="radio" name="payment" value="CARD" checked={selectedMethod === 'CARD'} onChange={() => setSelectedMethod('CARD')} className="hidden" />
                </label>
              </div>

              <button
                onClick={handlePay}
                className="w-full h-14 rounded-2xl font-bold bg-[#4a2f1d] text-white shadow-lg active:scale-95 transition-all text-lg"
              >
                Pay ${totalDue.toFixed(2)}
              </button>
            </div>
          </>
        )}

        {step === 'PROCESSING' && (
          <div className="p-10 flex flex-col items-center justify-center min-h-[350px]">
            <div className="w-20 h-20 border-4 border-[#f0ebe1] border-t-[#5a3a22] rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-bold text-[#3e2723] mb-2">Processing Payment</h2>
            <p className="text-gray-500 text-center">Please don't close this screen or press back...</p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="p-10 flex flex-col items-center justify-center min-h-[350px] animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={48} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#3e2723] mb-2">Payment Successful!</h2>
            <p className="text-gray-500 text-center">Redirecting to your order status...</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
