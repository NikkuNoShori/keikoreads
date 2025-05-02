import { BrowserRouter as Router } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppRoutes } from './routes';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <Router>
      <Layout isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}>
        <AppRoutes />
      </Layout>
    </Router>
  );
}

export default App;
