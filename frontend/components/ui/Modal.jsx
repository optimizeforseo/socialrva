"use client";

import { createContext, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

const ModalContext = createContext();

const Modal = ({ children, isOpen, onClose, size = "md", ...props }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl"
  };

  return (
    <ModalContext.Provider value={{ onClose }}>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className={cn(
                "relative w-full bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl",
                sizeClasses[size]
              )}
              {...props}
            >
              {children}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};

const ModalHeader = ({ children, className, ...props }) => (
  <div
    className={cn("flex items-center justify-between p-6 border-b border-slate-700/50", className)}
    {...props}
  >
    {children}
  </div>
);

const ModalTitle = ({ children, className, ...props }) => (
  <h2
    className={cn("text-xl font-semibold text-white", className)}
    {...props}
  >
    {children}
  </h2>
);

const ModalBody = ({ children, className, ...props }) => (
  <div
    className={cn("p-6", className)}
    {...props}
  >
    {children}
  </div>
);

const ModalFooter = ({ children, className, ...props }) => (
  <div
    className={cn("flex items-center justify-end space-x-3 p-6 border-t border-slate-700/50", className)}
    {...props}
  >
    {children}
  </div>
);

const ModalClose = ({ children, className, ...props }) => {
  const { onClose } = useContext(ModalContext);
  
  return (
    <button
      onClick={onClose}
      className={cn(
        "text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-700/50",
        className
      )}
      {...props}
    >
      {children || (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
    </button>
  );
};

Modal.Header = ModalHeader;
Modal.Title = ModalTitle;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Close = ModalClose;

export { Modal };