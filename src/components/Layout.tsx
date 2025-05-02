import { ReactNode } from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-rose-gold min-h-screen flex flex-col">
      <div className="container mx-auto max-w-4xl bg-white shadow-lg min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-10 flex flex-col gap-5 min-h-0">
          {children}
        </main>
        <footer className="footer bg-rose-gold text-gray-600 text-center py-2 text-sm mt-auto">
          <div className="divider"></div>
          <p>&copy; 2024 Keiko Reads. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}; 