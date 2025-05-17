import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { checkUserExists } from '../utils/authHelpers';

export const AuthCallback = () => {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          throw new Error('No session found');
        }

        const user = session.user;
        
        if (!user?.email) {
          throw new Error('No user email found in session');
        }

        // Check if this is a new user
        const userExists = await checkUserExists(user.email);
        
        if (!userExists) {
          setMessage("Welcome! Setting up your account...");
          
          try {
            // Get profile info from OAuth data
            const meta = user.user_metadata || {};
            const fullName = meta.full_name || meta.name || "";
            const [first_name, ...rest] = fullName.split(" ");
            const last_name = rest.join(" ");
            const avatar_url = meta.avatar_url || null;
            
            // Create profile
            await supabase.from("profiles").upsert({
              id: user.id,
              email: user.email,
              first_name: first_name || "",
              last_name: last_name || "",
              avatar_url,
              updated_at: new Date().toISOString(),
            }, {
              onConflict: 'id'
            });
          } catch (profileError) {
            console.error("Error creating profile:", profileError);
            // Continue even if profile creation fails
          }
        }
        
        // Get return URL and clean up
        const returnUrl = localStorage.getItem('authReturnUrl') || '/';
        localStorage.removeItem('authReturnUrl');
        
        // Short delay for new users to see welcome message
        setTimeout(() => {
          navigate(returnUrl, { replace: true });
        }, message ? 2000 : 0);
        
      } catch (error) {
        console.error('Auth callback error:', error);
        setError('Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    handleAuthCallback();
  }, [navigate, message]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-gray-700 dark:text-gray-300">
          {message || "Completing authentication..."}
        </p>
      </div>
    </div>
  );
};

export default AuthCallback; 