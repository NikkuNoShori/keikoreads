import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

/**
 * A component to protect routes that require authentication.
 * If requireAuth is true and user is not authenticated, redirects to login with return URL.
 * If requireAuth is false, renders children regardless of authentication status.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { isAuthenticated, loading } = useAuthContext();
  const location = useLocation();

  // While checking authentication status, show nothing or a loading indicator
  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return (
      <Navigate 
        to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  // Otherwise, render the route's content
  return <>{children}</>;
}; 