
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ setCurrentPage }) => {
  const navItems = [
    { label: '나만의 청첩장 만들기', page: Page.StoryBased },
    { label: '디자인 시안 둘러보기', page: Page.Designs },
    { label: '일반 청첩장', page: Page.Standard },
    { label: '고객 스토리 갤러리', page: Page.Gallery },
    { label: '가격 안내 및 주문', page: Page.Order },
    { label: '고객센터', page: Page.Contact },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div 
          className="text-2xl font-bold font-serif text-gray-800 cursor-pointer"
          onClick={() => setCurrentPage(Page.Home)}
        >
          도연 Story
        </div>
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className="text-gray-600 hover:text-rose-500 transition-colors duration-300"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="md:hidden">
          {/* Mobile menu button can be added here */}
        </div>
      </nav>
    </header>
  );
};

export default Header;