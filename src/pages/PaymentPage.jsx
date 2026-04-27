import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ShieldCheck, CheckCircle2, Loader2, Clock, Copy, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, tableId, placeOrderSuccess } = useCart();
  const [status, setStatus] = useState('PENDING'); // 'PENDING', 'VERIFYING', 'SUCCESS'
  const [orderId] = useState(() => 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase());
  const totalAmount = getCartTotal();

  useEffect(() => {
    // If cart is empty and we haven't started payment, user shouldn't be here
    if (cartItems.length === 0 && status === 'PENDING') {
      navigate('/');
      return;
    }

    // 1. After 3 seconds → Verifying Payment
    const t1 = setTimeout(() => {
      setStatus('VERIFYING');
      
      // 2. After 2 more seconds → Payment Successful
      const t2 = setTimeout(() => {
        setStatus('SUCCESS');
        
        // Finalize order on the backend during success state
        const finalizeOrder = async () => {
          try {
            const result = await placeOrder({
              table_id: tableId,
              items: cartItems,
              total_amount: totalAmount,
              instructions: localStorage.getItem('specialInstructions') || ''
            });
            placeOrderSuccess(result);
            localStorage.removeItem('specialInstructions');
          } catch (err) {
            console.warn("Backend order placement failed, saving to local history only.", err);
            // Fallback: Save locally even if server is down for simulation purposes
            placeOrderSuccess({ order_number: `SIM-${Math.floor(Math.random() * 10000)}` });
            localStorage.removeItem('specialInstructions');
          }
        };
        finalizeOrder();

        // 3. After 2 seconds → Redirect to /success
        const t3 = setTimeout(() => {
          navigate('/success');
        }, 2000);
        return () => clearTimeout(t3);
      }, 2000);
      return () => clearTimeout(t2);
    }, 3000);

    return () => clearTimeout(t1);
  }, [navigate, cartItems.length, placeOrderSuccess, tableId, totalAmount]);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full flex items-center justify-between mb-10">
        <button onClick={() => navigate('/cart')} className="p-2 -ml-2 text-gray-400">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2">
          <Coffee className="text-[#5a3a22]" size={24} />
          <span className="font-black text-xl text-[#3e2723]">Cafe Pay</span>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="w-full max-w-sm flex flex-col items-center">
        {status === 'PENDING' && (
          <div className="w-full animate-in fade-in zoom-in-95 duration-500">
            <h1 className="text-3xl font-black text-[#3e2723] text-center mb-2">Scan & Pay</h1>
            <p className="text-gray-500 text-center font-semibold mb-8">Use any UPI app to complete the payment</p>
            
            <div className="relative group mb-10">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-[3rem] blur opacity-10"></div>
              <div className="relative bg-white border-2 border-gray-100 rounded-[3rem] p-8 shadow-sm">
                <img 
                  src="/payment-qr.jpg" 
                  alt="Payment QR" 
                  className="w-full aspect-square object-contain"
                  onError={(e) => {
                    e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=nehasidnal2003@oksbi&pn=Neha%20Sidnal&am=${totalAmount}`;
                  }}
                />
                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 px-5 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold animate-pulse">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                    Waiting for payment...
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Amount Due</span>
                <span className="text-2xl font-black text-[#b71c1c]">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Order ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#3e2723]">{orderId}</span>
                  <Copy size={14} className="text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        )}

        {status === 'VERIFYING' && (
          <div className="flex flex-col items-center justify-center pt-20 animate-in fade-in duration-500">
            <div className="relative flex items-center justify-center">
              <Loader2 size={120} className="text-green-500 animate-spin opacity-20" strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={56} className="text-green-500 animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-[#3e2723] mt-12 mb-3 text-center">Verifying Payment...</h2>
            <p className="text-gray-500 text-center font-medium max-w-[200px]">We've detected your transaction. Just a moment!</p>
          </div>
        )}

        {status === 'SUCCESS' && (
          <div className="flex flex-col items-center justify-center pt-20 animate-in zoom-in-95 duration-500">
            <div className="w-28 h-28 bg-green-100 border-4 border-white shadow-xl rounded-full flex items-center justify-center mb-10">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <h2 className="text-4xl font-black text-[#3e2723] mb-4 text-center leading-tight">Payment<br/>Successful!</h2>
            <p className="text-gray-500 text-center font-semibold animate-pulse">Finalizing your order...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentPage;
