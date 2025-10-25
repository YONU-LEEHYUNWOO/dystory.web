
import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import SectionHeader from '../components/SectionHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { DesignConcept, Page } from '../types';
import { generateInvitationConcepts, generateInvitationImage, generateFormatImages } from '../services/geminiService';
import { UploadCloud, XCircle, X } from 'lucide-react';

interface StoryBasedPageProps {
  setCurrentPage: (page: Page) => void;
  setSelectedDesign: (design: { name: string; imageUrl: string; formatImageUrls?: string[] } | null) => void;
}

const StoryBasedPage: React.FC<StoryBasedPageProps> = ({ setCurrentPage, setSelectedDesign }) => {
  const [story, setStory] = useState('');
  const [color, setColor] = useState('');
  const [mood, setMood] = useState('');
  const [elements, setElements] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [designs, setDesigns] = useState<DesignConcept[]>([]);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setUploadedImagePreview(null);
    const fileInput = document.getElementById('image') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!story) {
      setError('우리의 이야기를 들려주세요.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setDesigns([]);

    try {
      const concepts = await generateInvitationConcepts(story, color, mood, elements, uploadedImagePreview);
      const conceptsWithImages = await Promise.all(
        concepts.map(async (concept) => {
          try {
             const [imageUrl, formatImageUrls] = await Promise.all([
              generateInvitationImage(concept.imagePrompt),
              concept.formatSuggestion 
                ? generateFormatImages(concept.formatSuggestion) 
                : Promise.resolve(undefined)
            ]);
            return { ...concept, imageUrl, formatImageUrls };
          } catch (imgError) {
            console.error(`Failed to generate image for concept: ${concept.title}`, imgError);
            return { 
              ...concept, 
              imageUrl: 'https://picsum.photos/600/800?grayscale',
              formatImageUrls: [
                `https://picsum.photos/seed/${concept.title}1/400/400?grayscale`,
                `https://picsum.photos/seed/${concept.title}2/400/400?grayscale`,
                `https://picsum.photos/seed/${concept.title}3/400/400?grayscale`
              ]
            };
          }
        })
      );
      setDesigns(conceptsWithImages);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOrder = (design: DesignConcept) => {
    if (design.imageUrl) {
        setSelectedDesign({ 
          name: design.title, 
          imageUrl: design.imageUrl,
          formatImageUrls: design.formatImageUrls
        });
        setCurrentPage(Page.Order);
    }
  };

  return (
    <PageWrapper>
      <SectionHeader 
        title="우리의 특별한 이야기, 한 장의 예술로" 
        subtitle="고객님의 소중한 사연을 바탕으로 세상에 단 하나뿐인 청첩장을 디자인해 드립니다. 처음 만난 순간, 잊지 못할 프러포즈, 둘만의 비밀스러운 추억 등 모든 이야기가 디자인의 영감이 됩니다."
      />
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="story" className="block text-xl font-serif text-gray-700 font-semibold mb-2">
              우리의 이야기 들려주세요
            </label>
            <textarea
              id="story"
              rows={8}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 transition"
              placeholder="저희는 벚꽃이 만개한 날, 처음 만났어요. 서로 첫눈에 반했고, 그는 저에게 벚꽃잎이 흩날리는 강가에서 기타를 치며 프러포즈를 했답니다. 저희를 상징하는 동물은 고양이이고, 둘 다 여행을 좋아해요."
            ></textarea>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">사진 추가 (선택)</label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <UploadCloud size={16} />
                  <span>파일 선택</span>
                  <input id="image" name="image" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                </label>
                {uploadedImagePreview && (
                  <div className="relative">
                    <img src={uploadedImagePreview} alt="Preview" className="h-16 w-16 object-cover rounded-md" />
                    <button type="button" onClick={removeImage} className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 hover:text-red-700">
                      <XCircle size={20} />
                    </button>
                  </div>
                )}
              </div>
               <p className="text-xs text-gray-500 mt-1">청첩장 디자인에 영감을 줄 사진을 첨부해보세요.</p>
            </div>
             <div>
              <label htmlFor="elements" className="block text-gray-700 font-medium mb-2">특별히 넣고 싶은 요소 (선택)</label>
              <input type="text" id="elements" value={elements} onChange={(e) => setElements(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 transition" placeholder="예: 벚꽃, 고양이" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="color" className="block text-gray-700 font-medium mb-2">원하는 색상 계열 (선택)</label>
              <input type="text" id="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 transition" placeholder="예: 핑크, 골드" />
            </div>
            <div>
              <label htmlFor="mood" className="block text-gray-700 font-medium mb-2">선호하는 분위기 (선택)</label>
              <input type="text" id="mood" value={mood} onChange={(e) => setMood(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-rose-500 focus:border-rose-500 transition" placeholder="예: 따뜻한, 시크한, 발랄한" />
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-rose-500 text-white font-bold py-3 px-8 rounded-full hover:bg-rose-600 transition-colors duration-300 disabled:bg-gray-400"
            >
              {isLoading ? '디자인 생성 중...' : '나만의 청첩장 디자인 추천받기'}
            </button>
          </div>
        </form>
        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </div>

      {isLoading && (
        <div className="mt-16 text-center">
            <LoadingSpinner />
            <p className="mt-4 text-gray-600">AI가 당신의 이야기를 바탕으로 디자인을 만들고 있어요. 잠시만 기다려주세요.</p>
        </div>
      )}
      
      {designs.length > 0 && (
        <div className="mt-16">
          <h3 className="text-2xl font-bold font-serif text-center mb-8">당신의 이야기를 담은 디자인 시안</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {designs.map((design, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 flex flex-col">
                <img src={design.imageUrl} alt={design.title} className="w-full h-auto object-cover aspect-[3/4]" />
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-bold font-serif text-gray-800">{design.title}</h4>
                  <p className="mt-2 text-gray-600 text-sm flex-grow">{design.description}</p>
                   {design.formatSuggestion && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <h5 className="font-semibold text-gray-700">✨ 디자인 형식 제안</h5>
                        <p className="text-sm text-gray-600 mt-1">{design.formatSuggestion}</p>
                        {design.formatImageUrls && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {design.formatImageUrls.map((url, i) => (
                              <button 
                                key={i}
                                onClick={() => setZoomedImage(url)} 
                                className="block rounded-lg shadow-sm overflow-hidden focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 group"
                              >
                                <img 
                                  src={url} 
                                  alt={`${design.title} 형식 제안 ${i + 1}`} 
                                  className="w-full object-cover aspect-square transition-transform duration-300 group-hover:scale-110" 
                                />
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  )}
                  <button onClick={() => handleOrder(design)} className="mt-6 w-full bg-gray-800 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-900 transition-colors">
                    이 디자인으로 주문하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {zoomedImage && (
        <div 
            className="fixed inset-0 bg-black/70 z-[100] flex justify-center items-center p-4 animate-fade-in" 
            onClick={() => setZoomedImage(null)}
        >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
                <img src={zoomedImage} alt="Zoomed format" className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl" />
                <button onClick={() => setZoomedImage(null)} className="absolute -top-3 -right-3 bg-white rounded-full text-gray-800 p-1.5 shadow-lg hover:scale-110 transition-transform">
                    <X size={24} />
                </button>
            </div>
        </div>
      )}
      <style>{`
          @keyframes fade-in {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
              animation: fade-in 0.3s ease-out forwards;
          }
      `}</style>
    </PageWrapper>
  );
};

export default StoryBasedPage;
