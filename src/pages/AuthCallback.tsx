import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

export const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      // Get the hash from the URL
      const hash = window.location.hash;
      
      try {
        if (hash) {
          // Process the callback with Supabase
          const { error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          // Redirect to home or stored returnUrl
          const returnUrl = localStorage.getItem('authReturnUrl') || '/';
          localStorage.removeItem('authReturnUrl'); // Clean up
          navigate(returnUrl);
        }
      } catch (error: unknown) {
        console.error('Auth callback error:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Authentication failed';
        setError(errorMessage);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
          <p>Authentication error: {error}</p>
          <p className="mt-2 text-sm">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-280px)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}; 