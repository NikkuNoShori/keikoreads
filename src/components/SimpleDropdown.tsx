import React, { useState, useRef, useEffect } from 'react';

interface SimpleDropdownProps {
  buttonContent: React.ReactNode;
  menuContent: React.ReactNode;
  className?: string;
  menuPosition?: 'right' | 'left';
}

/**
 * A simple, reliable dropdown component
 */
export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  buttonContent,
  menuContent,
  className = '',
  menuPosition = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(prev => !prev);
  };

  // Calculate dropdown position when opened (for portal)
  useEffect(() => {
    if (!isOpen || !dropdownRef.current) return;
    const updatePosition = () => {
      // No-op: positioning handled by CSS classes now
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, menuPosition]);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      {/* Trigger button */}
      <div 
        onClick={toggleDropdown} 
        className="cursor-pointer flex items-center"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {buttonContent}
      </div>
      {/* Dropdown menu - in-card absolute positioning */}
      {isOpen && (
        <div
          className={[
            'absolute right-0 top-full mt-2 z-[10000] min-w-[140px] max-w-[200px] w-max',
            'bg-white/95 dark:bg-gray-800/95',
            'border border-white dark:border-white',
            'shadow-xl',
            'max-h-[calc(100vh-100px)] overflow-y-auto',
            'text-gray-700 dark:text-maroon-text',
            'rounded-lg',
            'transition-all',
          ].join(' ')}
          aria-orientation="vertical"
          role="menu"
        >
          <div className="p-1">
            {menuContent}
          </div>
        </div>
      )}
    </div>
  );
}; 