import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppRoutes } from './routes';
import { AuthProvider } from './context/AuthContext';
import { forceSignOut } from './utils/authDebug';
import { DebugMenu } from './components/DebugMenu';
import { useTheme } from './hooks/useTheme';

function App() {
  const [isDarkMode, toggleDarkMode] = useTheme();
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

  return (
    <AuthProvider>
      <Router>
        <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
          <AppRoutes />
        </Layout>
        {/* DebugMenu removed for security */}
      </Router>
    </AuthProvider>
  );
}

export default App;
