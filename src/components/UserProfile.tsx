import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

console.log('UserProfile rendered');

export const UserProfile: React.FC = () => {
  const { user, signOut, isAuthenticated, profile, profileLoading } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      setIsMenuOpen(false);
      navigate('/');
    }
  };

  // Toggle menu on click only
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsMenuOpen(prevState => !prevState);
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  // Get avatar
  const getAvatarContent = () => {
    const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
    if (avatarUrl) {
      return (
        <img
          src={avatarUrl}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
      );
    }
    const displayLetter = profile?.first_name
      ? profile.first_name.charAt(0).toUpperCase()
      : (user?.email?.charAt(0).toUpperCase() || '?');
    return (
      <span className="text-sm font-medium text-rose-600 dark:text-gray-200">
        {displayLetter}
      </span>
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 focus:outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-expanded={isMenuOpen}
        aria-haspopup="true"
        data-testid="user-profile-button"
      >
        {isAuthenticated && user ? (
          <>
            <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              {getAvatarContent()}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
              {getUserDisplayName()}
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        ) : (
          <>
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
              Account
            </span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </>
        )}
      </button>
      {isMenuOpen && (
        <div
          className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 border border-gray-200 dark:border-gray-700 origin-top-right"
          style={{ zIndex: 99999, background: '#fff', border: '2px solid #f00' }}
        >
          {profileLoading ? (
            <div className="flex items-center justify-center py-4 text-gray-500">Loading...</div>
          ) : isAuthenticated && user ? (
            <>
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Signed in as</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{profile?.email || user.email}</p>
              </div>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/settings');
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                data-testid="settings-button"
              >
                Settings
              </button>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                data-testid="signout-button"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/login');
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                data-testid="login-button"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/signup');
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                data-testid="signup-button"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}; 