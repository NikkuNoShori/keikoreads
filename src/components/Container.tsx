import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * A reusable container for centering content with consistent max width and padding.
 * Applies max-w-4xl, mx-auto, w-full, and px-4.
 */
export const Container = ({ children, className = '' }: ContainerProps) => (
  <div className={`max-w-4xl mx-auto w-full px-4 ${className}`}>
    {children}
  </div>
); 