import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Search, Check, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BottomBar from '../components/BottomBar';
import CancelModal from '../components/CancelModal';
import ReceiptModal from '../components/ReceiptModal';
import OrderTracker from '../components/OrderTracker';
import { cancelOrder, fetchOrderStatus } from '../services/api';

const SuccessPage = () => {
  const { previousOrder, orderInfo, cancelCurrentOrder } = useCart();
  const navigate = useNavigate();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // If no order info is available, fallback or redirect
  if (!previousOrder) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#3e2723] mb-4">No active orders found</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#5a3a22] text-white px-8 py-3 rounded-full font-bold"
        >
          Go to Menu
        </button>
        <BottomBar />
      </div>
    );
  }

  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(orderInfo?.status || 'Pending');

  // Poll for order status
  React.useEffect(() => {
    if (!orderInfo?.id || currentStatus === 'Cancelled' || currentStatus === 'Served') return;

    const interval = setInterval(async () => {
      try {
        const { status } = await fetchOrderStatus(orderInfo.id);
        if (status && status !== 'Unknown') {
          setCurrentStatus(status);
        }
      } catch (err) {
        console.error("Failed to fetch status");
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [orderInfo?.id, currentStatus]);

  const handleCancelOrder = async (cancelData) => {
    setIsCancelling(true);
    try {
      await cancelOrder(orderInfo?.id || 'TEST-ID', cancelData);
      setIsCancelModalOpen(false);
      setCurrentStatus('Cancelled');
      
      // Show cancelled state for a few seconds before clearing and redirecting
      setTimeout(() => {
        cancelCurrentOrder();
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error("Cancel failed", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32">
      <header className="bg-[#faf9f6] px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Coffee className="text-[#5a3a22]" size={24} />
          <h1 className="font-bold text-xl text-[#3e2723]">Artisanal Cafe</h1>
        </div>
        <button className="text-[#3e2723]">
          <Search size={24} />
        </button>
      </header>

      <main className="px-5 py-6 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#ffe8db] rounded-full flex items-center justify-center mb-4 relative z-10">
          <div className="w-14 h-14 bg-[#d84315] rounded-full flex items-center justify-center">
            <Check size={32} className="text-white" strokeWidth={3} />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-[#3e2723] mb-2">Order placed!</h2>
        <p className="text-gray-600 text-center text-sm mb-8 max-w-[250px]">
          Your order is being prepared with care by our baristas.
        </p>

        {/* Order Details Card */}
        <div className="w-full bg-[#f2efe9] rounded-3xl p-5 mb-8">
          <div className="flex justify-between items-center border-b border-[#e2dcd2] pb-4 mb-4">
            <div>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">ORDER ID</span>
              <span className="font-bold text-[#3e2723] text-lg">{orderInfo?.id || '#AC-123456'}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Est. pickup</span>
              <span className="font-bold text-[#b71c1c] text-lg">15-20 mins</span>
            </div>
          </div>

          <div className="mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-3">ITEMS</span>
            <div className="space-y-4">
              {previousOrder.items.slice(0, 2).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-white p-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-[#3e2723]">{item.name}</h4>
                      <span className="text-xs text-[#b71c1c] font-medium">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsCancelModalOpen(true)}
                    className="text-xs font-semibold text-[#b71c1c] bg-white border border-[#e2dcd2] px-3 py-1.5 rounded-full"
                  >
                    Cancel
                  </button>
                </div>
              ))}
              {previousOrder.items.length > 2 && (
                <div className="text-xs font-semibold text-gray-500 pt-1 text-center">
                  +{previousOrder.items.length - 2} more items
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="w-full mb-8">
          <OrderTracker status={currentStatus} />
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button className="w-full h-14 rounded-full font-bold bg-[#4a2f1d] text-white shadow-md active:scale-95 transition-all">
            Track in Real-time
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="w-full h-14 rounded-full font-bold bg-transparent border border-[#d8cbb8] text-[#4a2f1d] flex items-center justify-center gap-2 hover:bg-[#f0ebe1]/30 active:scale-95 transition-all"
          >
            <Plus size={20} strokeWidth={3} />
            Add More Items
          </button>

          {(currentStatus === 'Pending' || currentStatus === 'Preparing') && (
            <button 
              onClick={() => setIsCancelModalOpen(true)}
              className="w-full h-14 rounded-full font-bold bg-transparent border-2 border-red-100 text-[#b71c1c] flex items-center justify-center hover:bg-red-50 active:scale-95 transition-all"
            >
              Cancel Order
            </button>
          )}
        </div>

        <button 
          onClick={() => setIsReceiptModalOpen(true)}
          className="mt-6 text-sm font-bold text-[#8d6e63] active:scale-95 transition-transform px-4 py-2"
        >
          View Receipt Details
        </button>
      </main>

      <CancelModal 
        isOpen={isCancelModalOpen} 
        onClose={() => setIsCancelModalOpen(false)} 
        onConfirm={handleCancelOrder}
        isLoading={isCancelling}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        orderInfo={orderInfo}
        previousOrder={previousOrder}
      />
      
      <BottomBar />
    </div>
  );
};

export default SuccessPage;
