
import React from 'react';
import { Page } from '../types';
import { ArrowRight } from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: Page) => void;
  setSelectedDesign: (design: { name: string; imageUrl: string; formatImageUrls?: string[] } | null) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setCurrentPage, setSelectedDesign }) => {
  
  const menuItems = [
    { title: '나만의 청첩장 만들기', description: 'AI와 함께 당신의 이야기를 세상에 단 하나뿐인 디자인으로 만드세요.', page: Page.StoryBased, icon: '✨' },
    { title: '디자인 시안 둘러보기', description: '다양한 테마와 스타일의 감성적인 디자인들을 만나보세요.', page: Page.Designs, icon: '🎨' },
    { title: '일반 청첩장', description: '클래식하고 세련된, 기본에 충실한 디자인을 선택하세요.', page: Page.Standard, icon: '💌' },
    { title: '가격 안내 및 주문', description: '옵션을 선택하고 간편하게 주문을 완료하세요.', page: Page.Order, icon: '🛒' },
  ];

  const handleMenuClick = (page: Page) => {
    if(page === Page.Order) {
      setSelectedDesign(null);
    }
    setCurrentPage(page);
  }

  return (
    <div>
      <section 
        className="h-[60vh] md:h-[70vh] bg-cover bg-center flex items-center justify-center text-white relative"
        style={{ backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="text-center z-10 p-4">
          <h1 className="text-4xl md:text-6xl font-extrabold font-serif leading-tight">
            당신의 이야기가<br />청첩장이 됩니다
          </h1>
          <p className="mt-4 text-lg md:text-xl font-light">
            도연 Story와 함께 가장 특별한 순간을 알려보세요.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {menuItems.map((item) => (
              <div 
                key={item.title} 
                onClick={() => handleMenuClick(item.page)}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold font-serif text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 flex-grow">{item.description}</p>
                 <div className="mt-6 text-rose-500 font-semibold flex items-center">
                  바로가기 <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
