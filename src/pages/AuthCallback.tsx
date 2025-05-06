import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { checkUserExists } from '../utils/authHelpers';

export const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      // Get the hash from the URL
      const hash = window.location.hash;
      
      try {
        if (hash) {
          // Process the callback with Supabase
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }

          // Check if this is a new user or an existing one
          if (data.session?.user?.email) {
            const userExists = await checkUserExists(data.session.user.email);
            
            // If new user, show welcome message
            if (!userExists) {
              setMessage("Welcome! Creating your account...");
              
              // Automatically upsert profile based on OAuth data
              try {
                // Attempt to get any profile info from the OAuth data
                const user = data.session.user;
                const meta = user?.user_metadata || {};
                const fullName = meta.full_name || meta.name || "";
                const [first_name, ...rest] = fullName.split(" ");
                const last_name = rest.join(" ");
                const avatar_url = meta.avatar_url || null;
                
                // Create profile for the new user
                await supabase.from("profiles").upsert({
                  id: user.id,
                  email: user.email,
                  first_name: first_name || "",
                  last_name: last_name || "",
                  avatar_url,
                  updated_at: new Date().toISOString(),
                });
              } catch (profileError) {
                console.error("Error creating profile:", profileError);
                // Continue even if profile creation fails
              }
            }
          }
          
          // Redirect to home or stored returnUrl
          const returnUrl = localStorage.getItem('authReturnUrl') || '/';
          localStorage.removeItem('authReturnUrl'); // Clean up
          
          // Short delay to show the welcome message for new users
          setTimeout(() => {
            navigate(returnUrl);
          }, message ? 2000 : 0);
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

  if (message) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded dark:bg-green-900 dark:text-green-200">
          <p>{message}</p>
          <div className="mt-4 flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-600 dark:border-green-400 mr-2"></div>
            <p className="text-sm">Redirecting...</p>
          </div>
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