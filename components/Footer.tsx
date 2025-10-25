
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h3 className="text-xl font-bold font-serif text-gray-800">도연 Story</h3>
            <p className="mt-2 text-sm">당신의 특별한 이야기를 담은 청첩장</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm">© {new Date().getFullYear()} Doyeon Story. All rights reserved.</p>
            <p className="text-sm mt-1">사업자등록번호: 123-45-67890 | 통신판매업신고: 제2024-서울강남-01234호</p>
            <p className="text-sm mt-1">문의: 02-1234-5678</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
