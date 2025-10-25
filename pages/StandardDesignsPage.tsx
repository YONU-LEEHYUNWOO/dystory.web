
import React from 'react';
import PageWrapper from '../components/PageWrapper';
import SectionHeader from '../components/SectionHeader';
import { PreMadeDesign, Page } from '../types';

const standardDesigns: PreMadeDesign[] = [
    { id: 's01', name: '화이트 린넨', imageUrl: 'https://picsum.photos/id/326/600/800', style: '미니멀', theme: '캘리그라피', color: '파스텔' },
    { id: 's02', name: '골든 프레임', imageUrl: 'https://picsum.photos/id/431/600/800', style: '모던', theme: '사진', color: '웜톤' },
    { id: 's03', name: '단아한 매듭', imageUrl: 'https://picsum.photos/id/435/600/800', style: '전통', theme: '일러스트', color: '웜톤' },
    { id: 's04', name: '은은한 수채화', imageUrl: 'https://picsum.photos/id/565/600/800', style: '로맨틱', theme: '꽃', color: '쿨톤' },
    { id: 's05', name: '클래식 모노그램', imageUrl: 'https://picsum.photos/id/659/600/800', style: '미니멀', theme: '캘리그라피', color: '쿨톤' },
    { id: 's06', name: '싱그러운 잎사귀', imageUrl: 'https://picsum.photos/id/200/600/800', style: '캐주얼', theme: '자연', color: '파스텔' },
];

interface StandardDesignsPageProps {
  setCurrentPage: (page: Page) => void;
  setSelectedDesign: (design: { name: string; imageUrl: string; formatImageUrls?: string[] } | null) => void;
}

const StandardDesignsPage: React.FC<StandardDesignsPageProps> = ({ setCurrentPage, setSelectedDesign }) => {

  const handleOrder = (design: PreMadeDesign) => {
    setSelectedDesign({ name: design.name, imageUrl: design.imageUrl });
    setCurrentPage(Page.Order);
  };
  
  return (
    <PageWrapper>
      <SectionHeader 
        title="간결하고 아름다운, 기본에 충실한 청첩장"
        subtitle="복잡한 디자인보다는 깔끔하고 정돈된 스타일을 선호하는 분들을 위한 페이지입니다. 클래식하면서도 세련된 다양한 디자인을 만나보세요."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {standardDesigns.map(design => (
          <div key={design.id} className="group bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
            <div className="relative">
              <img src={design.imageUrl} alt={design.name} className="w-full h-auto object-cover aspect-[3/4]" />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 <button onClick={() => handleOrder(design)} className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full">
                    이 디자인으로 주문
                </button>
              </div>
            </div>
            <div className="p-4 text-center">
              <h3 className="font-semibold text-gray-800">{design.name}</h3>
              <p className="text-sm text-gray-500">{design.style} / {design.theme}</p>
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
};

export default StandardDesignsPage;
