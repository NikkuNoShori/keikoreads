interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle = ({ isDarkMode, onToggle }: DarkModeToggleProps) => {
  return (
    <button
      onClick={onToggle}
      type="button"
      className="flex items-center justify-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 group transition-colors appearance-none border-0 bg-transparent focus:outline-none focus:ring-0 rounded"
      aria-label="Toggle dark mode"
    >
      <span>{isDarkMode ? 'Dark' : 'Light'}</span>
      <svg className="w-5 h-5 text-gray-400 group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          className={isDarkMode ? 'hidden' : ''}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
        <path
          className={!isDarkMode ? 'hidden' : ''}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}; 