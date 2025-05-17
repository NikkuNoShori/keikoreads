import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  className = ''
}) => {
  // Close modal on escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-hidden">
      <div className={`bg-white dark:bg-gray-800 shadow-2xl rounded-2xl max-w-4xl w-full p-6 relative max-h-[90vh] overflow-y-auto ${className}`}>
        {title && (
          <>
            <h2 className="text-2xl font-semibold font-serif italic text-center bg-transparent dark:bg-gray-800 py-2 rounded-t-2xl">
              {title}
            </h2>
            <div className="h-1 w-24 bg-maroon-card rounded-full mx-auto mb-4"></div>
          </>
        )}
        {children}
      </div>
    </div>
  );
}; 