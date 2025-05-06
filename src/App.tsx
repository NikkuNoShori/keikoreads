import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppRoutes } from './routes';
import { AuthProvider } from './context/AuthContext';
import { forceSignOut } from './utils/authDebug';
import { DebugMenu } from './components/DebugMenu';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthCleared, setIsAuthCleared] = useState(false);

  // Check for localStorage flag to clear authentication - development only
  useEffect(() => {
    const checkAndClearAuth = async () => {
      const shouldClearAuth = localStorage.getItem('clearAuth') === 'true';
      if (shouldClearAuth && !isAuthCleared) {
        try {
          await forceSignOut();
          console.log('Auth state cleared for development purposes');
          setIsAuthCleared(true);
        } catch (error) {
          console.error('Error clearing auth state:', error);
        }
      }
    };
    
    checkAndClearAuth();
  }, [isAuthCleared]);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      localStorage.setItem('darkMode', (!prev).toString());
      if (!prev) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return !prev;
    });
  };

  return (
    <AuthProvider>
      <Router>
        <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
          <AppRoutes />
        </Layout>
        {/* Show debug menu in development */}
        {process.env.NODE_ENV === 'development' && <DebugMenu />}
      </Router>
    </AuthProvider>
  );
}

export default App;
