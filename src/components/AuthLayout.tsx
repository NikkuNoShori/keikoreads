import React, { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-280px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <div>
          <img
            className="mx-auto h-16 w-auto"
            src="/assets/Keiko_Reads_3.png"
            alt="Keiko Reads Logo"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}; 