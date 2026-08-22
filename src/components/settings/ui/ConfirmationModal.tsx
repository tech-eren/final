import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', isDestructive = false }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-accent/10 text-accent'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white bg-transparent border-none cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <h3 className="text-xl font-bold text-white m-0 mb-2">{title}</h3>
          <p className="text-zinc-400 text-sm leading-relaxed m-0 mb-8">{message}</p>
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="flex-1 px-4 py-3 rounded-xl border border-zinc-700 bg-transparent text-white font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={() => { onConfirm(); onClose(); }} 
              className={`flex-1 px-4 py-3 rounded-xl border-none text-white font-medium cursor-pointer transition-colors ${
                isDestructive 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-accent hover:bg-accent-hover'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
