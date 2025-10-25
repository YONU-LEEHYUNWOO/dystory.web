
import React, { useState, useMemo, useEffect } from 'react';
import PageWrapper from '../components/PageWrapper';
import SectionHeader from '../components/SectionHeader';
import { Page } from '../types';

interface OrderPageProps {
  selectedDesign: { name: string; imageUrl: string; formatImageUrls?: string[] } | null;
  setCurrentPage: (page: Page) => void;
}

const OrderPage: React.FC<OrderPageProps> = ({ selectedDesign, setCurrentPage }) => {
  const [quantity, setQuantity] = useState(100);
  const [customQuantity, setCustomQuantity] = useState('');
  const [options, setOptions] = useState({
    envelope: null as '기본' | '고급' | null,
    sticker: false,
    mealTicket: false,
    map: false,
    mobile: false,
  });

  const [details, setDetails] = useState({
    groomName: '', brideName: '', date: '', time: '', place: '', message: '', contact: '', address: '',
  });
  
  const [consent, setConsent] = useState(false);

  const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setOptions(prev => ({ ...prev, [name]: checked }));
    } else {
        setOptions(prev => ({ ...prev, [name]: value as '기본' | '고급'}));
    }
  };
  
  const finalQuantity = customQuantity ? parseInt(customQuantity, 10) : quantity;

  const totalCost = useMemo(() => {
    let cost = 0;
    const q = isNaN(finalQuantity) || finalQuantity < 0 ? 0 : finalQuantity;
    
    // Base price per card (volume discount)
    if (q >= 200) cost += q * 500;
    else if (q >= 150) cost += q * 550;
    else if (q >= 100) cost += q * 600;
    else if (q >= 50) cost += q * 700;
    else cost += q * 800;
    
    // Options
    if (options.envelope === '고급') cost += q * 100;
    if (options.sticker) cost += 10000;
    if (options.mealTicket) cost += q * 50;
    if (options.map) cost += 30000;
    if (options.mobile) cost += 50000;
    
    return cost;
  }, [finalQuantity, options]);
  
  if (!selectedDesign) {
    return (
        <PageWrapper>
            <div className="text-center">
                <h2 className="text-2xl font-bold font-serif">디자인을 먼저 선택해주세요.</h2>
                <p className="mt-4 text-gray-600">주문을 계속하려면 청첩장 디자인을 선택해야 합니다.</p>
                <button onClick={() => setCurrentPage(Page.Designs)} className="mt-6 bg-rose-500 text-white font-bold py-3 px-8 rounded-full hover:bg-rose-600 transition-colors">
                    디자인 둘러보기
                </button>
            </div>
        </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <SectionHeader title="청첩장 주문하기" subtitle="선택하신 디자인으로 주문을 진행합니다. 수량과 정보를 정확하게 입력해주세요." />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold font-serif mb-4">선택한 디자인</h3>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <img src={selectedDesign.imageUrl} alt={selectedDesign.name} className="w-full rounded-md mb-4" />
            <p className="text-center font-semibold">{selectedDesign.name}</p>
          </div>
          {selectedDesign.formatImageUrls && selectedDesign.formatImageUrls.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-bold font-serif mb-4">디자인 형식 시안</h3>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-3 gap-2">
                    {selectedDesign.formatImageUrls.map((url, i) => (
                      <img 
                        key={i}
                        src={url} 
                        alt={`형식 시안 ${i + 1}`} 
                        className="rounded-lg w-full object-cover aspect-square" 
                      />
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">제안된 청첩장의 입체적인 형태입니다.</p>
              </div>
            </div>
          )}
        </div>
        <div className="lg:col-span-2">
          <div className="space-y-8">
             {/* Order Form Sections */}
            <div>
              <h3 className="text-xl font-bold font-serif mb-4 border-b pb-2">1. 수량 선택</h3>
              <div className="flex flex-wrap gap-4 items-center">
                {[50, 100, 150, 200].map(q => (
                  <button key={q} onClick={() => { setQuantity(q); setCustomQuantity(''); }} className={`px-4 py-2 rounded-md border ${quantity === q && !customQuantity ? 'bg-rose-500 text-white border-rose-500' : 'bg-white hover:border-rose-400'}`}>
                    {q}매
                  </button>
                ))}
                <input type="number" value={customQuantity} onChange={e => { setCustomQuantity(e.target.value); setQuantity(0); }} placeholder="직접입력" className="w-28 px-4 py-2 border rounded-md focus:ring-rose-500 focus:border-rose-500" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-serif mb-4 border-b pb-2">2. 옵션 선택</h3>
              <div className="space-y-4">
                 <div>
                    <label className="font-semibold">봉투</label>
                    <div className="flex gap-4 mt-2">
                       <label className="flex items-center"><input type="radio" name="envelope" value="기본" onChange={handleOptionChange} className="mr-2"/> 기본</label>
                       <label className="flex items-center"><input type="radio" name="envelope" value="고급" onChange={handleOptionChange} className="mr-2"/> 고급 (+100원/매)</label>
                    </div>
                </div>
                 <label className="flex items-center"><input type="checkbox" name="sticker" checked={options.sticker} onChange={handleOptionChange} className="mr-2" /> 스티커 (+10,000원)</label>
                 <label className="flex items-center"><input type="checkbox" name="mealTicket" checked={options.mealTicket} onChange={handleOptionChange} className="mr-2" /> 식권 (+50원/매)</label>
                 <label className="flex items-center"><input type="checkbox" name="map" checked={options.map} onChange={handleOptionChange} className="mr-2" /> 약도 제작 (+30,000원)</label>
                 <label className="flex items-center"><input type="checkbox" name="mobile" checked={options.mobile} onChange={handleOptionChange} className="mr-2" /> 모바일 청첩장 (+50,000원)</label>
              </div>
            </div>

             <div>
              <h3 className="text-xl font-bold font-serif mb-4 border-b pb-2">3. 정보 입력</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="groomName" placeholder="신랑 이름" onChange={handleDetailChange} className="p-2 border rounded-md" />
                <input type="text" name="brideName" placeholder="신부 이름" onChange={handleDetailChange} className="p-2 border rounded-md" />
                <input type="date" name="date" onChange={handleDetailChange} className="p-2 border rounded-md" />
                <input type="time" name="time" onChange={handleDetailChange} className="p-2 border rounded-md" />
                <input type="text" name="place" placeholder="예식 장소" onChange={handleDetailChange} className="p-2 border rounded-md md:col-span-2" />
                <textarea name="message" placeholder="초대 문구" rows={4} onChange={handleDetailChange} className="p-2 border rounded-md md:col-span-2"></textarea>
                <input type="text" name="contact" placeholder="연락처" onChange={handleDetailChange} className="p-2 border rounded-md" />
                <input type="text" name="address" placeholder="배송지" onChange={handleDetailChange} className="p-2 border rounded-md" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold font-serif mb-4 border-b pb-2">4. 갤러리 공개 동의 (선택)</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={consent} 
                    onChange={(e) => setConsent(e.target.checked)} 
                    className="h-5 w-5 rounded border-gray-300 text-rose-600 shadow-sm focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50" 
                  />
                  <span className="ml-3 text-gray-700">주문하신 디자인과 사연을 '고객 스토리 갤러리'에 익명으로 소개하는 데 동의합니다.</span>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-8">선정된 디자인은 다른 예비 부부에게 좋은 영감이 될 수 있습니다.</p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm py-4 rounded-lg shadow-inner">
                 <div className="flex justify-between items-center text-xl font-bold p-4">
                     <span>총 예상 비용:</span>
                     <span className="text-rose-600">{totalCost.toLocaleString()} 원</span>
                 </div>
                 <button className="w-full bg-rose-500 text-white font-bold py-3 text-lg rounded-md hover:bg-rose-600 transition-colors">
                     결제하기
                 </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default OrderPage;
