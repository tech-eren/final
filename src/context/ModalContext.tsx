import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface ModalConfig {
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ModalContextType {
  showModal: (config: ModalConfig) => void;
  hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const showModal = useCallback((config: ModalConfig) => {
    setModalConfig(config);
  }, []);

  const hideModal = useCallback(() => {
    setModalConfig(null);
    setIsProcessing(false);
  }, []);

  const handleConfirm = async () => {
    if (modalConfig?.onConfirm) {
      setIsProcessing(true);
      try {
        await modalConfig.onConfirm();
      } finally {
        setIsProcessing(false);
        hideModal();
      }
    } else {
      hideModal();
    }
  };

  const handleCancel = () => {
    if (modalConfig?.onCancel) {
      modalConfig.onCancel();
    }
    hideModal();
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      {modalConfig && (
        <div className="relative z-[200]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="fixed inset-0 transition-opacity bg-slate-900 bg-opacity-75"></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
              <div className="relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg">
                
                {/* Close Button */}
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button
                    type="button"
                    className="text-slate-400 bg-white rounded-md hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                    onClick={handleCancel}
                  >
                    <span className="sr-only">Close</span>
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-slate-900" id="modal-title">
                        {modalConfig.title}
                      </h3>
                      <div className="mt-2">
                        {typeof modalConfig.message === 'string' ? (
                          <p className="text-sm text-slate-500">{modalConfig.message}</p>
                        ) : (
                          modalConfig.message
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-slate-50 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                  <Button
                    variant={modalConfig.variant === 'danger' ? 'danger' : 'primary'}
                    onClick={handleConfirm}
                    isLoading={isProcessing}
                    className="w-full sm:w-auto sm:ml-3"
                  >
                    {modalConfig.confirmText || 'Confirm'}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isProcessing}
                    className="w-full mt-3 sm:w-auto sm:mt-0"
                  >
                    {modalConfig.cancelText || 'Cancel'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
