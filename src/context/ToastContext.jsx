import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 left-0 right-0 z-[300] flex flex-col items-center pointer-events-none px-4 space-y-2">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="bg-[#3e2723] text-white px-6 py-3 rounded-full shadow-lg font-bold text-sm animate-in slide-in-from-top-10 fade-in duration-300"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
