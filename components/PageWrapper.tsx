
import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <main className="container mx-auto px-6 py-12 md:py-20 min-h-[calc(100vh-200px)]">
      {children}
    </main>
  );
};

export default PageWrapper;
