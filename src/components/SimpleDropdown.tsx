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
    console.log('SimpleDropdown toggled, new state:', !isOpen);
  };

  // Calculate dropdown position when opened
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const dropdown = dropdownRef.current.querySelector('[role="menu"]') as HTMLElement;
      if (dropdown) {
        // Ensure the dropdown is visible within the viewport
        const rect = dropdownRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - rect.bottom;
        
        // If not enough space below, position above
        if (spaceBelow < 200 && rect.top > 200) {
          dropdown.style.bottom = "calc(100% + 5px)";
          dropdown.style.top = "auto";
        } else {
          dropdown.style.top = "calc(100% + 5px)";
          dropdown.style.bottom = "auto";
        }
      }
    }
  }, [isOpen]);

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
      
      {/* Dropdown menu - absolute position with high z-index */}
      {isOpen && (
        <div 
          className={`!absolute ${menuPosition === 'right' ? 'right-0' : 'left-0'} bg-white dark:bg-gray-800 rounded-lg shadow-xl py-1 border-4 border-green-500`}
          style={{ 
            zIndex: 10000,
            minWidth: '250px',
            width: "max-content",
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)', 
            top: "calc(100% + 5px)",
            maxHeight: 'calc(100vh - 100px)', 
            overflowY: 'auto',
            position: 'absolute',
            display: 'block',
            visibility: 'visible',
            opacity: 1
          }}
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