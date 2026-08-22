import { useState, useEffect } from 'react';
import { Bot, X, MessageSquarePlus, Minus } from 'lucide-react';
import { ChatInterface } from './ChatInterface';

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  // Handle escape key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center justify-center gap-2 px-5 h-14 rounded-full shadow-[0_4px_20px_rgba(139,92,246,0.3)] transition-all duration-300 ease-in-out bg-gradient-to-r from-accent-gradientStart to-accent-gradientEnd text-white hover:shadow-[0_4px_25px_rgba(139,92,246,0.5)] hover:-translate-y-1 cursor-pointer border-none"
            aria-label="Open UbiqAI Assistant"
          >
            <Bot className="w-5 h-5" />
            <span className="font-semibold text-sm tracking-wide">UbiqAI</span>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 w-full h-full sm:bottom-6 sm:right-6 sm:w-[420px] sm:h-[650px] sm:max-h-[calc(100vh-40px)] bg-zinc-900/95 backdrop-blur-2xl sm:rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.5)] z-[100] flex flex-col overflow-hidden border-t sm:border border-zinc-800 animate-slide-up sm:animate-in sm:slide-in-from-bottom-5 sm:fade-in duration-300">
          {/* Header */}
          <div className="bg-black/40 px-5 py-4 flex items-center justify-between border-b border-zinc-800/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-white font-bold m-0 text-base tracking-wide">UbiqAI</h3>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                </div>
                <p className="text-zinc-400 text-xs m-0 font-medium">« Your civic intelligence assistant »</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-transparent border-none text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Minimize"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-transparent border-none text-zinc-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden relative">
            <ChatInterface onAction={() => {}} />
          </div>
        </div>
      )}
    </>
  );
}
