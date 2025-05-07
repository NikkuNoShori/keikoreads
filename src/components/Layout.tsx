import { ReactNode } from 'react';
import { Header } from './Header';

export const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-rose-gold dark:bg-maroon-outer min-h-screen flex flex-col">
      <div className="container mx-auto max-w-4xl bg-white dark:bg-maroon-container shadow-lg min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-3 flex flex-col gap-4 min-h-0 text-gray-900 dark:text-maroon-text">
          {children}
        </main>
        <footer className="footer bg-rose-gold dark:bg-gray-800 text-gray-600 dark:text-maroon-text text-center py-2 text-sm mt-auto">
          <div className="divider"></div>
          <p>&copy; 2024 Keiko Reads. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}; 