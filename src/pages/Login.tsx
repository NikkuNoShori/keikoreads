import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { SmartLink } from '../components/SmartLink';
import { AuthLayout } from '../components/AuthLayout';
import { OAuthButton } from '../components/OAuthButton';
import { supabase } from '../utils/supabaseClient';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOAuthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [oauthNotice, setOauthNotice] = useState(false);
  
  const { signIn, signInWithOAuth, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the returnUrl from query params or default to home
  const searchParams = new URLSearchParams(location.search);
  const returnUrl = searchParams.get('returnUrl') || '/';
  
  // Check for auth errors/warnings from OAuth on component mount
  useEffect(() => {
    const authError = localStorage.getItem('authError');
    if (authError) {
      setError(authError);
      localStorage.removeItem('authError');
    }
    
    const authWarning = localStorage.getItem('authWarning');
    if (authWarning) {
      setWarning(authWarning);
      localStorage.removeItem('authWarning');
    }
  }, []);
  
  // Detect OAuth signup
  useEffect(() => {
    const oauthFlag = localStorage.getItem('oauthSignup');
    if (oauthFlag) {
      setOauthNotice(true);
      localStorage.removeItem('oauthSignup');
    }
  }, []);
  
  // If already authenticated, redirect to the returnUrl
  if (isAuthenticated) {
    return <Navigate to={returnUrl} replace />;
  }

  // Check if user exists before signing in
  const checkUserExists = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // PGRST116 means no rows returned - user doesn't exist
        return false;
      } else if (error) {
        console.error('Error checking user:', error);
        // If there's another error, we'll proceed with sign in attempt
        // and let Supabase handle the error properly
        return true;
      }
      
      return !!data;
    } catch (err) {
      console.error('Error in checkUserExists:', err);
      return true; // Proceed with sign in attempt if check fails
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // First check if user exists
      const userExists = await checkUserExists(email);
      
      if (!userExists) {
        setError("No account found with this email address. Please sign up first.");
        setLoading(false);
        return;
      }
      
      const { data, error } = await signIn(email, password);
      
      if (error) {
        // Type assertion for error object
        const errorObj = error as { message?: string };
        throw new Error(errorObj.message || 'Failed to sign in');
      }
      
      if (data) {
        // Redirect to the returnUrl after successful login
        navigate(returnUrl);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to sign in';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setOAuthLoading(true);
    setError(null);
    
    try {
      // Store the returnUrl in localStorage so we can access it after the OAuth redirect
      localStorage.setItem('authReturnUrl', returnUrl);
      
      const { error } = await signInWithOAuth('google', false);
      
      if (error) {
        throw error;
      }
      
      // No need to navigate as OAuth will redirect the browser
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to sign in with Google';
      setError(errorMessage);
      setOAuthLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Welcome back"
      subtitle="Sign in to your account to continue"
    >
      {oauthNotice && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded dark:bg-blue-900 dark:text-blue-200">
          You signed up with Google. Please use "Sign in with Google" to log in.
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}
      {warning && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded dark:bg-yellow-900 dark:text-yellow-200">
          {warning}
        </div>
      )}
      <div className="mt-6">
        <OAuthButton 
          provider="google" 
          onClick={handleGoogleLogin}
          disabled={oauthLoading || loading}
        />
      </div>
      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>
      {!oauthNotice && (
        <form className="mt-6 space-y-6" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="off"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="••••••••"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400">
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-maroon-card dark:hover:bg-maroon-accent transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <SmartLink to="/signup" className="font-medium text-rose-600 hover:text-rose-500 dark:text-rose-400">
            Sign up
          </SmartLink>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login; 