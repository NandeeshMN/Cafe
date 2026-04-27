import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Copy, Clock, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onConfirm, totalDue }) => {
  const [step, setStep] = useState('PENDING'); // 'PENDING', 'VERIFYING', 'SUCCESS', 'EXPIRED'
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [orderId] = useState(() => 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase());

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('PENDING');
      setTimeLeft(300);
    }
  }, [isOpen]);

  // 1. Timer Countdown & Auto-Cancel
  useEffect(() => {
    if (!isOpen || step === 'EXPIRED' || step === 'SUCCESS') return;

    if (timeLeft <= 0) {
      setStep('EXPIRED');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, timeLeft, step]);

  // 2. Automatic Payment Detection (Simulation)
  // In a real app, this would poll an API: api.get(`/orders/status/${orderId}`)
  useEffect(() => {
    if (!isOpen || step !== 'PENDING') return;

    // Simulate "Waiting for user to scan and pay"
    // After 8 seconds, it automatically "detects" the payment
    const detectionTimeout = setTimeout(() => {
      setStep('VERIFYING');
    }, 8000); 

    return () => clearTimeout(detectionTimeout);
  }, [isOpen, step]);

  // 3. Verifying -> Success -> Redirect Flow
  useEffect(() => {
    if (step === 'VERIFYING') {
      // Simulate verification duration
      const verifyTimeout = setTimeout(() => {
        setStep('SUCCESS');
      }, 2500);
      return () => clearTimeout(verifyTimeout);
    }

    if (step === 'SUCCESS') {
      // Show success screen then confirm/redirect
      const redirectTimeout = setTimeout(() => {
        onConfirm();
      }, 2000);
      return () => clearTimeout(redirectTimeout);
    }
  }, [step, onConfirm]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const copyOrderId = () => {
    navigator.clipboard.writeText(orderId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-500">
        
        {step === 'PENDING' && (
          <div className="flex flex-col">
            {/* Header */}
            <div className="p-8 pb-0 text-center">
              <h2 className="text-3xl font-black text-[#3e2723] mb-1">Scan & Pay</h2>
              <p className="text-gray-500 text-sm font-semibold">Use any UPI app to pay</p>
            </div>

            {/* QR Section */}
            <div className="p-8">
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative bg-white border-2 border-gray-100 rounded-[2.5rem] p-6 shadow-sm">
                  <img 
                    src="/payment-qr.jpg" 
                    alt="Payment QR" 
                    className="w-full aspect-square object-contain rounded-2xl"
                    onError={(e) => {
                      e.target.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=upi://pay?pa=nehasidnal2003@oksbi&pn=Neha%20Sidnal&am=${totalDue}`;
                    }}
                  />
                  
                  {/* Status Indicator overlaying the QR area */}
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-xs font-bold animate-pulse">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Waiting for payment...
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Info & Timer */}
            <div className="px-8 pb-10 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#3e2723]">{orderId}</span>
                    <button onClick={copyOrderId} className="text-gray-300 hover:text-[#5a3a22] transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200"></div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Expires In</span>
                  <div className="flex items-center gap-1.5 text-[#b71c1c] font-black font-mono">
                    <Clock size={14} />
                    <span>{formatTime(timeLeft)}</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                 <button 
                  onClick={onClose}
                  className="text-gray-400 font-bold text-sm hover:text-red-500 transition-colors"
                >
                  Cancel and go back
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 'VERIFYING' && (
          <div className="p-12 flex flex-col items-center justify-center min-h-[450px]">
            <div className="relative flex items-center justify-center">
              <Loader2 size={100} className="text-green-500 animate-spin opacity-20" strokeWidth={1} />
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck size={48} className="text-green-500 animate-bounce" />
              </div>
            </div>
            <h2 className="text-3xl font-black text-[#3e2723] mt-10 mb-3 text-center">Verifying Payment...</h2>
            <p className="text-gray-500 text-center font-medium leading-relaxed max-w-[200px]">
              We've detected your transaction. Just a moment!
            </p>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="p-12 flex flex-col items-center justify-center min-h-[450px] animate-in zoom-in-95 duration-500">
            <div className="w-28 h-28 bg-green-50 border-4 border-white shadow-xl rounded-full flex items-center justify-center mb-10">
              <CheckCircle2 size={64} className="text-green-500" />
            </div>
            <h2 className="text-4xl font-black text-[#3e2723] mb-4 text-center leading-tight">Payment<br/>Successful!</h2>
            <p className="text-gray-500 text-center font-semibold animate-pulse">
              Finalizing your order...
            </p>
          </div>
        )}

        {step === 'EXPIRED' && (
          <div className="p-12 flex flex-col items-center justify-center min-h-[450px]">
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-8">
              <AlertTriangle size={48} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-black text-[#3e2723] mb-4 text-center">Session Expired</h2>
            <p className="text-gray-500 text-center mb-10 font-medium">The payment window has closed. Please try again.</p>
            <button
              onClick={onClose}
              className="w-full h-16 rounded-[2rem] font-bold bg-[#3e2723] text-white shadow-xl shadow-gray-200 active:scale-95 transition-all text-lg"
            >
              Return to Cart
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
