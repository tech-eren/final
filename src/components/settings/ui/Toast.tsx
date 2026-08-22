import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

export function Toast({ message, isVisible, onClose }: any) {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
    if (isVisible) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-zinc-900 border border-zinc-800 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-xl p-4 flex items-center gap-3 min-w-[250px]">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="text-white text-sm font-medium flex-1">{message}</span>
        <button onClick={() => { setShow(false); if (onClose) onClose(); }} className="text-zinc-500 hover:text-white bg-transparent border-none p-1 cursor-pointer">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
