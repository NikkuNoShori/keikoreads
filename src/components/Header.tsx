// import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { DarkModeToggle } from './DarkModeToggle';
import { SmartLink } from './SmartLink';
import { useAuthContext } from '../context/AuthContext';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Header = ({ isDarkMode, toggleDarkMode }: HeaderProps) => {
  const { user, signOut, isAuthenticated, profile } = useAuthContext();
  const navigate = useNavigate();

  // Sign out handler
  const handleSignOut = async () => {
    try {
      localStorage.setItem('clearAuth', 'true'); // Force clear auth in development
      const { error } = await signOut();
      if (error) {
        console.error('Sign out error:', error);
      } else {
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

  return (
    <header className="relative w-full flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: '220px' }}>
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
      {/* Navigation with dark mode toggle and user profile on right */}
      <nav className="relative z-10 w-full border-t border-b border-rose-gold py-1 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center">
        <ul className="flex flex-row justify-center items-center gap-2 m-0 p-0 list-none flex-1">
          {['Home', 'About', 'Reviews', 'Contact'].map((label, idx, arr) => (
            <li key={label} className="flex flex-row items-center">
              <SmartLink
                to={
                  label === 'Home'
                    ? '/' 
                    : `/${label.toLowerCase()}`
                }
                className="text-gray-700 dark:text-maroon-text no-underline text-base py-1 px-6 block hover:text-rose-600 dark:hover:text-rose-300 transition-colors duration-300"
              >
                {label}
              </SmartLink>
              {idx < arr.length - 1 && (
                <span className="text-gray-400 mx-1 select-none">&bull;</span>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4 pr-4">
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {getAvatar() && (
                <img
                  src={getAvatar()!}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                />
              )}
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Hi, {getDisplayName()}
              </span>
              <button
                onClick={() => navigate('/settings')}
                className="text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-300 transition-colors text-sm"
                data-testid="settings-button"
              >
                Settings
              </button>
              <button
                onClick={handleSignOut}
                className="text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-300 transition-colors text-sm"
                data-testid="signout-button"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/login')}
                className="text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-300 transition-colors text-sm"
                data-testid="login-button"
              >
                Log in
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-gray-700 dark:text-gray-300 hover:text-rose-600 dark:hover:text-rose-300 transition-colors text-sm"
                data-testid="signup-button"
              >
                Sign up
              </button>
            </div>
          )}
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        </div>
      </nav>
    </header>
  );
}; 