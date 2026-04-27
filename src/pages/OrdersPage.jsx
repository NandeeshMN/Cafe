import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ArrowLeft, ShoppingBag, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import BottomBar from '../components/BottomBar';

const OrdersPage = () => {
  const { userOrders } = useCart();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#faf9f6] pb-32">
      {/* Header */}
      <header className="bg-white px-5 py-6 flex items-center justify-between shadow-sm sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 -ml-2 text-gray-400 hover:text-[#3e2723] hover:bg-gray-100 rounded-full transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-black text-2xl text-[#3e2723]">My Orders</h1>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-[#5a3a22] text-white px-4 py-2 rounded-full text-sm font-bold shadow-md active:scale-95 transition-all"
        >
          Order More
        </button>
      </header>

      <main className="px-5 py-6">
        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={40} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-[#3e2723] mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8 max-w-[250px]">Once you place an order, it will appear here for you to track.</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-[#3e2723] text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
            >
              Go to Menu
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order, idx) => (
              <div 
                key={order.id || idx} 
                className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 animate-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Order ID</span>
                    <span className="font-bold text-[#3e2723]">{order.id}</span>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-tighter flex items-center gap-1.5 ${
                    order.status === 'Completed' 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {order.status === 'Completed' ? <CheckCircle2 size={12} /> : <Clock size={12} className="animate-pulse" />}
                    {order.status || 'Preparing'}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items && order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        <span className="font-bold text-[#3e2723]">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="font-medium text-gray-400">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-dashed border-gray-100 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Total Paid</span>
                    <span className="text-xl font-black text-[#b71c1c]">${parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                  <button className="text-gray-300 hover:text-[#5a3a22] transition-colors">
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomBar />
    </div>
  );
};

export default OrdersPage;
