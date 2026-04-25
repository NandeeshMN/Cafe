import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';

const CancelModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  if (!isOpen) return null;

  const reasons = [
    'Ordered by mistake',
    'Wrong item selected',
    'Long waiting time',
    'Other'
  ];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!reason) return;
    onConfirm({ reason, details, image: imagePreview });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/40 backdrop-blur-sm p-4">
      <div 
        className="bg-[#faf9f6] w-full max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-[#3e2723]">Why are you cancelling?</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-5 overflow-y-auto max-h-[70vh]">
          <p className="text-sm text-gray-600 mb-5">
            We're sorry to see you go. Let us know what went wrong so we can improve.
          </p>

          <div className="space-y-3 mb-6">
            {reasons.map((r) => (
              <label key={r} className="flex items-center justify-between cursor-pointer">
                <span className={`text-sm ${reason === r ? 'text-[#3e2723] font-semibold' : 'text-gray-600'}`}>{r}</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${reason === r ? 'border-[#3e2723]' : 'border-gray-300'}`}>
                  {reason === r && <div className="w-2.5 h-2.5 bg-[#3e2723] rounded-full" />}
                </div>
                <input 
                  type="radio" 
                  name="cancel_reason" 
                  value={r} 
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="hidden" 
                />
              </label>
            ))}
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold text-[#3e2723] mb-2">Add more details</label>
            <textarea
              className="w-full bg-white border border-gray-200 rounded-2xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#5a3a22] resize-none h-24 shadow-sm"
              placeholder="Tell us more about your experience..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-[#3e2723] mb-2">Upload photo (optional)</label>
            
            <div className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-white hover:bg-gray-50 transition-colors overflow-hidden h-32 flex flex-col items-center justify-center">
              {imagePreview ? (
                <>
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-white/80 backdrop-blur text-gray-800 p-1.5 rounded-full shadow-md"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <Camera size={28} className="text-[#3e2723] mb-2" />
                  <span className="text-xs font-medium text-gray-500">Tap to add an image</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </>
              )}
            </div>
          </div>

          <p className="text-xs text-center text-red-500 font-medium mb-3">
            This action cannot be undone.
          </p>
          <button
            onClick={handleSubmit}
            disabled={!reason || isLoading}
            className={`w-full py-3.5 rounded-full font-bold text-white shadow-md transition-all ${
              !reason || isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#b71c1c] hover:bg-[#9a1717] active:scale-[0.98]'
            }`}
          >
            {isLoading ? 'Cancelling...' : 'Confirm Cancellation'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-3 mt-2 rounded-full font-bold text-[#3e2723] hover:bg-gray-100 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelModal;
