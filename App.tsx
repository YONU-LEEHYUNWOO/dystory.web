
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import StoryBasedPage from './pages/StoryBasedPage';
import DesignsPage from './pages/DesignsPage';
import StandardDesignsPage from './pages/StandardDesignsPage';
import OrderPage from './pages/OrderPage';
import ContactPage from './pages/ContactPage';
import GalleryPage from './pages/GalleryPage';
import { Page } from './types';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Home);
  const [selectedDesign, setSelectedDesign] = useState<{ name: string; imageUrl: string; formatImageUrls?: string[] } | null>(null);
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Home:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />;
      case Page.StoryBased:
        return <StoryBasedPage setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />;
      case Page.Designs:
        return <DesignsPage setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />;
      case Page.Gallery:
        return <GalleryPage />;
      case Page.Standard:
        return <StandardDesignsPage setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />;
      case Page.Order:
        return <OrderPage selectedDesign={selectedDesign} setCurrentPage={setCurrentPage} />;
      case Page.Contact:
        return <ContactPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} setSelectedDesign={setSelectedDesign} />;
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen flex flex-col">
      <Header setCurrentPage={setCurrentPage} />
      <div className="flex-grow">
        {renderPage()}
      </div>
      <Footer />
    </div>
  );
};

export default App;
