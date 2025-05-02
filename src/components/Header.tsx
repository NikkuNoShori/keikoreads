import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DarkModeToggle } from './DarkModeToggle';

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="relative w-full flex flex-col items-center justify-center overflow-hidden" style={{ minHeight: '220px' }}>
      {/* Background image with overlay */}
      <div className="absolute inset-0 w-full h-full bg-cover bg-center z-0" style={{ backgroundImage: "url('/assets/library_photo.avif')" }}>
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/70" />
      </div>
      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center pt-6 pb-2 w-full">
        <img
          src="/assets/Keiko_Reads_3.png"
          alt="Keiko Reads Logo"
          className="w-56 max-w-xs h-auto mb-2 mx-auto drop-shadow-lg"
        />
      </div>
      {/* Navigation with dark mode toggle on right */}
      <nav className="relative z-10 w-full border-t border-b border-rose-gold py-1 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center">
        <ul className="flex flex-row justify-center items-center gap-2 m-0 p-0 list-none flex-1">
          {['Home', 'About', 'Reviews', 'Contact'].map((label, idx, arr) => (
            <li key={label} className="flex flex-row items-center">
              <Link
                to={
                  label === 'Home'
                    ? '/' : `/${label.toLowerCase()}`
                }
                className="text-gray-700 dark:text-gray-200 no-underline text-base py-1 px-6 block hover:text-rose-600 dark:hover:text-rose-300 transition-colors duration-300"
              >
                {label}
              </Link>
              {idx < arr.length - 1 && (
                <span className="text-gray-400 mx-1 select-none">&bull;</span>
              )}
            </li>
          ))}
        </ul>
        <div className="flex items-center pr-4">
          <DarkModeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} />
        </div>
      </nav>
    </header>
  );
}; 