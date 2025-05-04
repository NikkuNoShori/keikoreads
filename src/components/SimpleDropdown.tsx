import React, { useState, useRef, useEffect } from 'react';

interface SimpleDropdownProps {
  buttonContent: React.ReactNode;
  menuContent: React.ReactNode;
  className?: string;
}

/**
 * A simple, reliable dropdown component
 */
export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  buttonContent,
  menuContent,
  className = '',
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
    console.log('SimpleDropdown toggled, new state:', !isOpen);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger button */}
      <div onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
        {buttonContent}
      </div>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700"
          style={{ 
            zIndex: 9999,
            minWidth: '200px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
            border: process.env.NODE_ENV === 'development' ? '2px solid green' : undefined
          }}
        >
          {menuContent}
        </div>
      )}
    </div>
  );
}; 