import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { isEmailConfirmed } from '../utils/authHelpers';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireEmailVerification?: boolean;
}

/**
 * A component to protect routes that require authentication.
 * If requireAuth is true and user is not authenticated, redirects to login with return URL.
 * If requireAuth is false, renders children regardless of authentication status.
 * If requireEmailVerification is true, also checks if email is verified.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true,
  requireEmailVerification = false
}) => {
  const { isAuthenticated, loading, user } = useAuthContext();
  const location = useLocation();
  const [emailVerified, setEmailVerified] = useState<boolean | null>(null);
  const [verificationChecking, setVerificationChecking] = useState(false);

  // Check email verification if required
  useEffect(() => {
    const checkEmailVerification = async () => {
      if (requireEmailVerification && user) {
        setVerificationChecking(true);
        const verified = await isEmailConfirmed(user.id);
        setEmailVerified(verified);
        setVerificationChecking(false);
      }
    };

    checkEmailVerification();
  }, [requireEmailVerification, user]);

  // While checking authentication status, show loading indicator
  if (loading || (requireEmailVerification && verificationChecking)) {
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

  // If email verification is required but not verified, redirect to verification page
  if (requireEmailVerification && !emailVerified && user) {
    return (
      <Navigate 
        to={`/verify-email?returnUrl=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  // Otherwise, render the route's content
  return <>{children}</>;
}; 