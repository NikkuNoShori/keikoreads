import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from './components/Layout';
import { AppRoutes } from './routes';
import { AuthProvider } from './context/AuthContext';
import { useTheme } from './hooks/useTheme';

function App() {
  const [isDarkMode, toggleDarkMode] = useTheme();

  return (
    <AuthProvider>
      <Router>
        <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
          <AppRoutes />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
