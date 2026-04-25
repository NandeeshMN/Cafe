import React from 'react';
import { Clock, ChefHat, CheckCircle2, UtensilsCrossed, XCircle } from 'lucide-react';

const OrderTracker = ({ status }) => {
  const isCancelled = status === 'Cancelled';
  
  const steps = [
    { id: 'Pending', label: 'Order Confirmed', description: 'Sending to kitchen', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-500' },
    { id: 'Preparing', label: 'Preparing Order', description: 'Brewing with care', icon: ChefHat, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-500' },
    { id: 'Ready', label: 'Ready for Pickup', description: 'Waiting at the counter', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-500' },
    { id: 'Served', label: 'Order Served', description: 'Enjoy your meal!', icon: UtensilsCrossed, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-500' }
  ];

  if (isCancelled) {
    return (
      <div className="w-full bg-red-50 border border-red-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <XCircle size={24} className="text-red-500" />
        </div>
        <div>
          <h4 className="font-bold text-red-700">Order Cancelled</h4>
          <p className="text-sm text-red-600/80 mt-0.5">This order has been voided.</p>
        </div>
      </div>
    );
  }

  // Find the index of the current status
  const currentIndex = steps.findIndex(s => s.id === status);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full px-2 py-2">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isPast = index < activeIndex;
        const isLast = index === steps.length - 1;

        let iconColor = 'text-gray-400';
        let iconBg = 'bg-[#f0ebe1] border-[#d8cbb8]';
        let lineClass = 'border-transparent';
        let titleColor = 'text-gray-400';
        let descColor = 'text-gray-400/70';

        if (isPast) {
          iconColor = 'text-[#d84315]';
          iconBg = 'bg-white border-[#d84315] border-2';
          lineClass = 'border-[#d84315]';
          titleColor = 'text-[#3e2723] font-bold';
          descColor = 'text-gray-500';
        } else if (isActive) {
          iconColor = step.color;
          iconBg = `${step.bg} border-2 ${step.border} shadow-sm`;
          titleColor = 'text-[#3e2723] font-bold';
          descColor = 'text-gray-600';
        }

        const Icon = step.icon;

        return (
          <div key={step.id} className={`relative pl-12 ${!isLast ? 'pb-8' : ''}`}>
            {/* The line connecting nodes */}
            {!isLast && (
              <div className={`absolute left-[19px] top-8 bottom-0 border-l-2 ${lineClass} transition-colors duration-500`} />
            )}
            
            {/* The Node */}
            <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 z-10 ${iconBg}`}>
              {isActive && (
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping" />
              )}
              <Icon size={18} className={`${iconColor}`} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            {/* Text Content */}
            <div className={`pt-2 transition-all duration-300 ${isActive ? 'scale-105 origin-left' : ''}`}>
              <h4 className={`text-base ${titleColor}`}>{step.label}</h4>
              <span className={`text-xs block mt-0.5 ${descColor}`}>{step.description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderTracker;
