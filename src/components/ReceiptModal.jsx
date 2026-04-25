import React from 'react';
import { X, Receipt, Download, Coffee } from 'lucide-react';

const ReceiptModal = ({ isOpen, onClose, orderInfo, previousOrder }) => {
  if (!isOpen || !previousOrder) return null;

  // Assume order type based on whether previousOrder items count doesn't match cart if we tracked it,
  // For simplicity, we just check if it's rendered
  const isAdditional = orderInfo?.type === 'Additional';
  const taxRate = 0.08;
  const subtotal = previousOrder.total;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const dateStr = new Date(orderInfo?.createdAt || Date.now()).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true
  });

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-[#faf9f6] animate-in slide-in-from-bottom-full duration-300">
      {/* Header Bar */}
      <div className="bg-[#4a2f1d] text-white px-5 py-4 flex items-center justify-between sticky top-0 z-10 shadow-md pb-safe-top">
        <div className="flex items-center gap-2">
          <Receipt size={20} />
          <h2 className="font-bold text-lg">Digital Receipt</h2>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-8 pb-safe bg-[url('https://www.transparenttextures.com/patterns/rice-paper-2.png')] bg-[#faf9f6] bg-blend-multiply">
        {/* Receipt Ticket UI */}
        <div className="bg-white mx-auto max-w-sm rounded-t-xl rounded-b-sm shadow-[0_10px_20px_rgba(0,0,0,0.08)] overflow-hidden relative pb-8">
          
          {/* Jagged Bottom Edge */}
          <div className="absolute bottom-0 w-full h-3 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDUsMCAxMCwxMCIgZmlsbD0iI2ZhZjlmNiIvPjwvc3ZnPg==')] bg-repeat-x z-10" />

          {/* Header */}
          <div className="p-6 text-center border-b border-dashed border-gray-300">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 bg-[#5a3a22] text-white rounded-full flex items-center justify-center">
                <Coffee size={24} />
              </div>
            </div>
            <h1 className="font-extrabold text-2xl text-[#3e2723] uppercase tracking-widest mb-1">Artisanal Brew</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Premium Coffee & Pastries</p>
            
            <div className="mt-6 text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono font-bold text-[#3e2723]">{orderInfo?.id || '#AC-00000'}</span>
              </div>
              <div className="flex justify-between">
                <span>Table No:</span>
                <span className="font-bold text-[#3e2723]">12</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{dateStr}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 border-b border-dashed border-gray-300">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {previousOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm">
                  <div className="pr-4">
                    <p className="font-semibold text-[#3e2723]">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-[#3e2723]">${(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 bg-gray-50/50">
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Fees (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-3 border-t border-b border-gray-200 mb-4">
              <span className="font-bold text-lg text-[#3e2723] uppercase">Total</span>
              <span className="font-extrabold text-2xl text-[#b71c1c]">${total.toFixed(2)}</span>
            </div>

            <div className="text-xs text-gray-500 space-y-1 bg-white p-3 rounded-lg border border-gray-100">
              <div className="flex justify-between">
                <span>Payment Status</span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Paid via QR</span>
              </div>
              <div className="flex justify-between">
                <span>Order Type</span>
                <span className="font-bold text-gray-700">{isAdditional ? 'Additional Order' : 'Main Order'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Download Action */}
        <div className="mt-8 mb-4 max-w-sm mx-auto">
          <button className="w-full py-4 rounded-xl font-bold bg-[#f0ebe1] text-[#4a2f1d] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all">
            <Download size={20} />
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
