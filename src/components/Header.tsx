// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { DarkModeToggle } from './DarkModeToggle';
import { SmartLink } from './SmartLink';
import { useAuthContext } from '../context/AuthContext';
import { SimpleDropdown } from './SimpleDropdown';
import { useState } from 'react';
import { Container } from './Container';
// import { useTheme } from '../hooks/useTheme';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

/**
 * Header component with navigation and user dropdown menu
 * 
 * Features:
 * - Main navigation links
 * - Authentication-aware user dropdown menu
 * - Dark mode toggle
 * - Responsive design
 * 
 * The dropdown menu has two states:
 * 1. Authenticated: Shows user avatar/name, Settings, Sign out
 * 2. Unauthenticated: Shows Sign in, Sign up
 */
export const Header = ({ isDarkMode, toggleDarkMode }: HeaderProps) => {
  const { user, signOut, isAuthenticated, profile } = useAuthContext();
  const navigate = useNavigate();
  // Using this to force a refresh after sign out
  const [, setRefresh] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // const [isDarkMode, toggleDarkMode] = useTheme();

  // Sign out handler
  const handleSignOut = async () => {
    try {
      localStorage.setItem('clearAuth', 'true'); // Force clear auth in development
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
        setRefresh(prev => prev + 1); // Force a refresh after signout
        navigate('/');
      }
    } catch (err) {
      console.error('Sign out exception:', err);
    }
  };

  // Get display name from profile or email
  const getDisplayName = () => {
    if (profile?.first_name) {
      return profile.first_name;
    }
    return user?.email?.split('@')[0] || 'User';
  };

  // Get avatar from profile or OAuth
  const getAvatar = () => {
    // First try profile avatar
    if (profile?.avatar_url) {
      return profile.avatar_url;
    }
    
    // Then try user metadata from OAuth
    if (user?.user_metadata?.avatar_url) {
      return user.user_metadata.avatar_url;
    }
    
    return null;
  };

  // Create dropdown button content based on auth state
  const dropdownButtonContent = isAuthenticated ? (
    <div className="flex items-center gap-2 cursor-pointer group">
      {getAvatar() ? (
        <img
          src={getAvatar()!}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
          {getDisplayName().charAt(0).toUpperCase()}
        </div>
      )}
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-300">
        Hi, {getDisplayName()}
      </span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-300"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  ) : (
    <div className="flex items-center gap-2 cursor-pointer group">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-300"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-300">
        Account
      </span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-300"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  );

  // Create dropdown menu content based on auth state
  const dropdownMenuContent = isAuthenticated ? (
    <div className="py-1">
      <button
        onClick={() => navigate('/settings')}
        className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group"
        data-testid="settings-button"
      >
        <span>Settings</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
      </button>
      <button
        onClick={handleSignOut}
        className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group"
        data-testid="signout-button"
      >
        <span>Sign out</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
        </svg>
      </button>
      <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
    </div>
  ) : (
    <div className="py-1">
      <button
        onClick={() => navigate('/login')}
        className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group"
        data-testid="login-button"
      >
        <span>Sign in</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
      </button>
      <button
        onClick={() => navigate('/signup')}
        className="flex items-center justify-between gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group"
        data-testid="signup-button"
      >
        <span>Sign up</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
      </button>
      <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
    </div>
  );

  return (
    <header className="relative w-full flex flex-col items-center justify-center" style={{ minHeight: '220px' }}>
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: "url('/assets/library_photo.avif')" }}>
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-800/60" />
      </div>
      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center pt-6 pb-2 w-full">
        <img
          src="/assets/Keiko_Reads_3.png"
          alt="Keiko Reads Logo"
          className="w-56 max-w-xs h-auto mb-2 mx-auto drop-shadow-lg dark:filter dark:invert"
        />
      </div>
      {/* Hamburger for mobile - now below the logo, edge to edge */}
      <div className="w-full sm:hidden flex flex-col items-stretch">
        <button
          className="w-full block z-30 p-3 bg-white/80 dark:bg-gray-800/80 border-t border-b border-gray-300 dark:border-gray-700 text-left"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Open navigation menu"
        >
          <svg className="w-7 h-7 text-gray-700 dark:text-gray-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu overlay below the button, edge to edge */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 sm:hidden flex items-start justify-center">
          {/* Backdrop that closes menu on click */}
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setMobileMenuOpen(false)} />
          {/* Centered menu container */}
          <div className="relative z-50 w-full flex justify-center mt-[calc(100px+56px)]">
            <Container className="bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col gap-4">
              <nav onClick={e => e.stopPropagation()}>
                <ul className="flex flex-col gap-2 w-full">
                  {['Home', 'About', 'Reviews', 'Contact'].map((label) => (
                    <li key={label} className="w-full">
                      <SmartLink
                        to={label === 'Home' ? '/' : `/${label.toLowerCase()}`}
                        className="block w-full text-lg text-gray-700 dark:text-maroon-text py-2 px-4 rounded hover:bg-rose-100 dark:hover:bg-maroon-accent text-center transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {label}
                      </SmartLink>
                    </li>
                  ))}
                </ul>
                {/* Divider between nav and user menu */}
                <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2" />
                {/* User info and actions for mobile */}
                {isAuthenticated ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      {getAvatar() ? (
                        <img
                          src={getAvatar()!}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                          {getDisplayName().charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-base font-medium text-gray-700 dark:text-gray-300">
                        Hi, {getDisplayName()}
                      </span>
                    </div>
                    <button
                      onClick={() => { setMobileMenuOpen(false); navigate('/settings'); }}
                      className="block w-full text-lg text-gray-700 dark:text-maroon-text py-2 px-4 rounded hover:bg-rose-100 dark:hover:bg-maroon-accent text-center transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); handleSignOut(); }}
                      className="block w-full text-lg text-gray-700 dark:text-maroon-text py-2 px-4 rounded hover:bg-rose-100 dark:hover:bg-maroon-accent text-center transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <button
                      onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                      className="block w-full text-lg text-gray-700 dark:text-maroon-text py-2 px-4 rounded hover:bg-rose-100 dark:hover:bg-maroon-accent text-center transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setMobileMenuOpen(false); navigate('/signup'); }}
                      className="block w-full text-lg text-gray-700 dark:text-maroon-text py-2 px-4 rounded hover:bg-rose-100 dark:hover:bg-maroon-accent text-center transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
                {/* Always show dark mode toggle at the bottom of the mobile menu */}
                <div className="w-full flex justify-center items-center">
                  <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
                </div>
              </nav>
            </Container>
          </div>
        </div>
      )}
      {/* Desktop nav */}
      <nav className="relative z-20 w-full border-t border-b border-rose-gold py-1 bg-white/80 dark:bg-gray-800/80 flex-col sm:flex-row items-center justify-center overflow-x-auto sm:overflow-x-visible hidden sm:flex">
        <ul className="flex flex-row flex-nowrap sm:flex-wrap justify-center items-center gap-0 sm:gap-2 m-0 p-0 list-none flex-1 w-full max-w-full px-0 sm:px-6">
          {['Home', 'About', 'Reviews', 'Contact'].map((label, idx, arr) => (
            <li key={label} className="w-full sm:w-auto text-center">
              <SmartLink
                to={
                  label === 'Home'
                    ? '/' 
                    : `/${label.toLowerCase()}`
                }
                className="block text-gray-700 dark:text-maroon-text no-underline text-base py-2 px-4 sm:py-1 sm:px-6 hover:text-rose-600 dark:hover:text-rose-300 transition-colors duration-300"
              >
                {label}
              </SmartLink>
              {idx < arr.length - 1 && (
                <span className="hidden sm:inline text-gray-400 mx-1 select-none">&bull;</span>
              )}
            </li>
          ))}
        </ul>
        <div className="relative w-full sm:static sm:w-auto flex justify-center sm:justify-end pr-0 sm:pr-4 mt-2 sm:mt-0">
          <div className="sm:static absolute top-0 left-0 right-0 z-50 flex justify-center sm:justify-end">
            <SimpleDropdown
              buttonContent={dropdownButtonContent}
              menuContent={dropdownMenuContent}
              className="z-[999]"
              menuPosition="right"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}; 