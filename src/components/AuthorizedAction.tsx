import React, { ReactNode } from 'react';
import { useAuthContext } from '../context/AuthContext';

interface AuthorizedActionProps {
  children: ReactNode;
  fallback?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * A component to conditionally render UI elements based on authentication status.
 * This is especially useful for showing/hiding edit buttons, delete controls, etc.
 * 
 * @param children The content to show when user is authenticated
 * @param fallback Optional content to show when user is not authenticated
 * @param onClick Optional click handler that only works when authenticated (redirects to login if not)
 */
export const AuthorizedAction: React.FC<AuthorizedActionProps> = ({ 
  children, 
  fallback = null,
  onClick 
}) => {
  const { isAuthenticated } = useAuthContext();

  // If we have an onClick handler and the action requires authentication
  const handleClick = (e: React.MouseEvent) => {
    if (onClick && isAuthenticated) {
      onClick(e);
    } else if (onClick) {
      e.preventDefault();
      // You can add a redirect to login here if needed
      // Alternative: show a login modal or toast notification
      alert('You need to log in to perform this action.');
    }
  };

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  if (onClick) {
    return <div onClick={handleClick}>{children}</div>;
  }

  return <>{children}</>;
}; 