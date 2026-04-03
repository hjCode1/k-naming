import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white/60 backdrop-blur-sm border-b border-peach/30 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-center">
          <Link to="/" className="text-xl font-serif font-bold text-charcoal hover:text-rose transition-colors">
            K-Naming
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="py-6 text-center text-sm text-charcoal/40">
        <p>&copy; 2026 K-Naming. 우리 아이에게 좋은 이름을.</p>
      </footer>
    </div>
  );
}

export default Layout;
