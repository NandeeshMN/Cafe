import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const InstructionsModal = ({ isOpen, onClose, onSave, initialInstructions }) => {
  const [instructions, setInstructions] = useState('');

  useEffect(() => {
    if (isOpen) {
      setInstructions(initialInstructions || '');
    }
  }, [isOpen, initialInstructions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#faf9f6] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 duration-300">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#3e2723]">Special Instructions</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-5">
          <p className="text-sm text-gray-600 mb-4">
            Any allergies or dietary preferences? Let the kitchen know!
          </p>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Extra hot, no sugar, dairy allergy..."
            className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5a3a22] resize-none h-32 shadow-sm"
          />
          
          <button
            onClick={() => {
              onSave(instructions);
              onClose();
            }}
            className="w-full py-4 mt-6 rounded-2xl font-bold bg-[#4a2f1d] text-white shadow-md active:scale-95 transition-all"
          >
            Save Instructions
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
