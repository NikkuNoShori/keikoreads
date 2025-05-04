import { useState } from 'react';
import { clearAuthData, forceSignOut } from '../utils/authDebug';

/**
 * Debug menu for development only - provides easy access to auth debug functions
 */
export const DebugMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[10000]">
      {/* Debug Button */}
      <button
        onClick={toggleMenu}
        className="bg-red-600 text-white p-2 rounded-full shadow-lg"
        style={{ width: '40px', height: '40px' }}
      >
        <span className="font-mono font-bold">D</span>
      </button>

      {/* Debug Menu */}
      {isOpen && (
        <div 
          className="absolute bottom-12 right-0 bg-white rounded-md shadow-lg py-2 border border-gray-200 w-48"
          style={{ 
            border: '2px solid #f00',
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <h3 className="text-xs font-bold px-3 py-1 border-b border-gray-200">Debug Tools</h3>
          
          <button
            onClick={() => {
              forceSignOut();
              setIsOpen(false);
            }}
            className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
          >
            Force Sign Out
          </button>
          
          <button
            onClick={() => {
              clearAuthData();
              setIsOpen(false);
              window.location.reload();
            }}
            className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
          >
            Clear Auth & Reload
          </button>
          
          <button
            onClick={() => {
              localStorage.setItem('clearAuth', 'true');
              window.location.reload();
            }}
            className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
          >
            Set clearAuth Flag
          </button>
          
          <button
            onClick={() => {
              console.log('Current localStorage:', { ...localStorage });
              setIsOpen(false);
            }}
            className="block w-full text-left px-3 py-1 text-sm text-gray-700 hover:bg-gray-100"
          >
            Log localStorage
          </button>
        </div>
      )}
    </div>
  );
}; 