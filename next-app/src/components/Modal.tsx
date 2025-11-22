'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
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

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick} />
      <div
        ref={modalRef}
        className={`modal ${sizeClasses[size]} w-full p-6`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-planner-border">
            {title && (
              <h2
                id="modal-title"
                className="text-2xl font-playfair font-semibold text-planner-text"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-planner-text-muted hover:text-planner-text transition-colors p-1 rounded-lg hover:bg-planner-hover"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        )}
        <div className="overflow-auto max-h-[70vh]">{children}</div>
      </div>
    </>
  );
};

export const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-planner-border">
      {children}
    </div>
  );
};

export const ModalBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="py-4">{children}</div>;
};
