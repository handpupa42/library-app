import React from 'react';
import type { ReactNode } from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';

interface LayoutProps {
  children: ReactNode;
  activePage: 'books' | 'readers' | 'profile';
  onNavigate: (page: 'books' | 'readers' | 'profile') => void;
  booksCount: number;
  readersCount: number;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activePage,
  onNavigate,
  booksCount,
  readersCount,
}) => {
  return (
    <div className="page-wrapper">
      <Header
        activePage={activePage}
        onNavigate={onNavigate}
        booksCount={booksCount}
        readersCount={readersCount}
      />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;