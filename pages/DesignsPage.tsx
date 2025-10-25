
import React, { useState, useMemo } from 'react';
import PageWrapper from '../components/PageWrapper';
import SectionHeader from '../components/SectionHeader';
import { PreMadeDesign, Page } from '../types';

const designSamples: PreMadeDesign[] = [
    { id: 'd01', name: '봄날의 속삭임', imageUrl: 'https://picsum.photos/id/1025/600/800', style: '로맨틱', theme: '꽃', color: '파스텔' },
    { id: 'd02', name: '숲속의 왈츠', imageUrl: 'https://picsum.photos/id/1043/600/800', style: '빈티지', theme: '자연', color: '웜톤' },
    { id: 'd03', name: '도시의 야경', imageUrl: 'https://picsum.photos/id/1050/600/800', style: '모던', theme: '사진', color: '쿨톤' },
    { id: 'd04', name: '순수한 서약', imageUrl: 'https://picsum.photos/id/1060/600/800', style: '미니멀', theme: '캘리그라피', color: '파스텔' },
    { id: 'd05', name: '전통의 미', imageUrl: 'https://picsum.photos/id/1080/600/800', style: '전통', theme: '일러스트', color: '웜톤' },
    { id: 'd06', name: '우리들의 파티', imageUrl: 'https://picsum.photos/id/21/600/800', style: '캐주얼', theme: '일러스트', color: '비비드' },
    { id: 'd07', name: '가을 편지', imageUrl: 'https://picsum.photos/id/211/600/800', style: '빈티지', theme: '자연', color: '웜톤' },
    { id: 'd08', name: '푸른 바다의 전설', imageUrl: 'https://picsum.photos/id/219/600/800', style: '모던', theme: '사진', color: '쿨톤' },
];

interface DesignsPageProps {
  setCurrentPage: (page: Page) => void;
  setSelectedDesign: (design: { name: string; imageUrl: string; formatImageUrls?: string[] } | null) => void;
}

const DesignsPage: React.FC<DesignsPageProps> = ({ setCurrentPage, setSelectedDesign }) => {
  const [filters, setFilters] = useState({ style: '', theme: '', color: '' });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleOrder = (design: PreMadeDesign) => {
    setSelectedDesign({ name: design.name, imageUrl: design.imageUrl });
    setCurrentPage(Page.Order);
  };

  const filteredDesigns = useMemo(() => {
    return designSamples.filter(design => {
      return (filters.style ? design.style === filters.style : true) &&
             (filters.theme ? design.theme === filters.theme : true) &&
             (filters.color ? design.color === filters.color : true);
    });
  }, [filters]);

  const filterOptions = {
    style: ['모던', '빈티지', '로맨틱', '미니멀', '전통', '캐주얼'],
    theme: ['꽃', '자연', '일러스트', '사진', '캘리그라피'],
    color: ['웜톤', '쿨톤', '파스텔', '비비드'],
  };

  return (
    <PageWrapper>
      <SectionHeader 
        title="도연 Story가 제안하는 아름다운 디자인"
        subtitle="다양한 테마와 스타일로 미리 제작된 청첩장 디자인 시안들을 만나보세요. 마음에 드는 디자인을 선택하고 우리만의 청첩장을 완성할 수 있습니다."
      />

      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="style" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">스타일 (전체)</option>
            {filterOptions.style.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select name="theme" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">테마 (전체)</option>
            {filterOptions.theme.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <select name="color" onChange={handleFilterChange} className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">색상 (전체)</option>
            {filterOptions.color.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredDesigns.map(design => (
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

export default DesignsPage;
