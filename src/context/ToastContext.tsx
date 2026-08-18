import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-0 right-0 z-[100] p-4 flex flex-col gap-2 pointer-events-none w-full sm:w-96">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex w-full flex-col overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-300 transform translate-y-0 opacity-100 ${
              toast.type === 'error' ? 'border-l-4 border-semantic-error' :
              toast.type === 'success' ? 'border-l-4 border-semantic-success' :
              toast.type === 'warning' ? 'border-l-4 border-semantic-warning' :
              'border-l-4 border-semantic-info'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-semantic-success" />}
                  {toast.type === 'error' && <XCircle className="w-5 h-5 text-semantic-error" />}
                  {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-semantic-warning" />}
                  {toast.type === 'info' && <Info className="w-5 h-5 text-semantic-info" />}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                  <p className="text-sm font-medium text-slate-900">{toast.title}</p>
                  {toast.message && <p className="mt-1 text-sm text-slate-500">{toast.message}</p>}
                </div>
                <div className="flex flex-shrink-0 ml-4">
                  <button
                    type="button"
                    className="inline-flex text-slate-400 bg-white rounded-md hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={() => removeToast(toast.id)}
                  >
                    <span className="sr-only">Close</span>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
