import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to orders list after 2 seconds
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8 animate-in zoom-in-50 duration-500 shadow-inner">
        <CheckCircle2 size={56} className="text-green-600" />
      </div>
      
      <h1 className="text-4xl font-black text-[#3e2723] mb-4 leading-tight">Payment<br/>Successful!</h1>
      <p className="text-gray-500 font-medium mb-12 max-w-[280px]">
        Your artisanal selection is being prepared with care.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-4">
        <button 
          onClick={() => navigate('/orders')}
          className="w-full h-16 bg-[#3e2723] text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all group"
        >
          <span>View My Orders</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        
        <button 
          onClick={() => navigate('/')}
          className="w-full h-16 bg-white text-[#3e2723] border-2 border-gray-100 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          <ShoppingBag size={20} />
          <span>Order More Items</span>
        </button>
      </div>

      <div className="mt-12 flex items-center gap-2 text-gray-400 text-sm font-semibold">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
        Redirecting to tracking in 2s...
      </div>
    </div>
  );
};

export default SuccessPage;
