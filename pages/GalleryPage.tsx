import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import SectionHeader from '../components/SectionHeader';
import { GalleryItem } from '../types';
import { X } from 'lucide-react';

const gallerySamples: GalleryItem[] = [
    { id: 'g01', title: '벚꽃 아래에서의 약속', imageUrl: 'https://picsum.photos/id/10/600/800', story: '벚꽃이 만개한 날 처음 만나, 벚꽃잎이 흩날리는 강가에서 프러포즈를 받았어요. 저희의 사랑을 벚꽃처럼 화사하게 담아냈습니다.' },
    { id: 'g02', title: '여행의 시작', imageUrl: 'https://picsum.photos/id/12/600/800', story: '함께 떠난 첫 유럽 여행에서 저희는 평생을 함께하기로 결심했습니다. 여행 티켓 컨셉의 청첩장으로 저희의 새로운 여정을 알립니다.' },
    { id: 'g03', title: '고양이와 함께', imageUrl: 'https://picsum.photos/id/200/600/800', story: '저희를 이어준 건 길에서 데려온 작은 고양이였습니다. 이제는 세 식구가 되어 새로운 출발을 하려 합니다. 저희의 소중한 반려묘를 디자인에 담았어요.' },
    { id: 'g04', title: '밤하늘의 별처럼', imageUrl: 'https://picsum.photos/id/1041/600/800', story: '천문대에서 별을 보며 사랑을 키워온 저희 커플. 밤하늘의 은하수와 별자리를 모티브로 신비롭고 아름다운 청첩장을 만들었습니다.' },
    { id: 'g05', title: '제주 바다의 추억', imageUrl: 'https://picsum.photos/id/1053/600/800', story: '푸른 제주 바다 앞에서 찍은 웨딩 스냅 사진을 일러스트로 재해석하여 청첩장에 담았습니다. 시원하고 청량한 저희의 사랑 이야기입니다.' },
    { id: 'g06', title: '가을 숲의 동화', imageUrl: 'https://picsum.photos/id/1035/600/800', story: '단풍이 아름답게 물든 가을 숲에서 저희는 작은 결혼식을 올립니다. 따뜻하고 포근한 숲의 느낌을 청첩장에 가득 담았습니다.' },
];

const GalleryPage: React.FC = () => {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    return (
        <PageWrapper>
            <SectionHeader 
                title="고객 스토리 갤러리"
                subtitle="도연 Story와 함께한 다른 커플들의 특별한 이야기를 만나보세요. 당신의 이야기도 아름다운 청첩장이 될 수 있습니다."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {gallerySamples.map(item => (
                    <div 
                        key={item.id} 
                        className="group cursor-pointer"
                        onClick={() => setSelectedItem(item)}
                    >
                        <div className="overflow-hidden rounded-lg shadow-lg transform group-hover:shadow-xl group-hover:-translate-y-2 transition-all duration-300">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-auto object-cover aspect-[3/4]" />
                            <div className="p-4 bg-white">
                                <h3 className="font-semibold font-serif text-gray-800">{item.title}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedItem && (
                <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
                    <div 
                        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full md:w-1/2 object-cover" />
                        <div className="p-8 flex flex-col relative overflow-y-auto">
                           <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
                               <X size={24} />
                           </button>
                           <h2 className="text-3xl font-bold font-serif text-gray-800 mb-4">{selectedItem.title}</h2>
                           <p className="text-gray-600 leading-relaxed">{selectedItem.story}</p>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </PageWrapper>
    );
};

export default GalleryPage;
