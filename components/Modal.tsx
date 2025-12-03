import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, fullScreen = false }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Lock body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
        setMounted(false);
        document.body.style.overflow = 'unset';
    };
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className={`relative bg-slate-900 shadow-2xl overflow-hidden flex flex-col ${
            fullScreen 
            ? 'fixed inset-0 w-full h-full rounded-none border-none' 
            : 'w-full max-w-5xl max-h-[90vh] rounded-2xl border border-slate-700'
        }`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-red-600 rounded-full text-white transition-all backdrop-blur-md group shadow-lg border border-white/10"
        >
          <X size={24} className="group-hover:scale-110 transition-transform" />
        </button>
        <div className={`flex-1 overflow-auto custom-scrollbar ${fullScreen ? 'bg-black' : ''}`}>
            {children}
        </div>
      </div>
    </div>,
    document.body
  );
};