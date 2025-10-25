
import React, { useState } from 'react';
import PageWrapper from '../components/PageWrapper';
import SectionHeader from '../components/SectionHeader';
import { ChevronDown, Phone, Mail } from 'lucide-react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b">
      <button
        className="w-full flex justify-between items-center text-left py-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-semibold text-lg">{question}</span>
        <ChevronDown className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 text-gray-700">
          {answer}
        </div>
      )}
    </div>
  );
};

const ContactPage: React.FC = () => {
    const faqs = [
        { q: '청첩장 주문부터 수령까지 얼마나 걸리나요?', a: '주문 접수 후 디자인 시안 확인까지 1~2일, 인쇄 및 제작에 3~5일, 배송에 1~2일이 소요되어 평균적으로 5~9일(영업일 기준)이 소요됩니다.' },
        { q: 'AI 디자인 추천은 어떻게 이루어지나요?', a: '고객님의 사연을 Gemini AI가 분석하여 핵심 키워드와 분위기를 파악한 후, 그에 맞는 독창적인 디자인 컨셉과 이미지를 생성하여 추천해드립니다.' },
        { q: '수량 변경이나 주문 취소는 가능한가요?', a: '인쇄가 시작되기 전까지는 수량 변경 및 주문 취소가 가능합니다. 인쇄가 시작된 후에는 변경 및 취소가 어려우니 1:1 문의 게시판으로 빠르게 연락주세요.' },
    ];
  return (
    <PageWrapper>
      <SectionHeader title="고객 센터" subtitle="궁금한 점이 있으신가요? 무엇이든 물어보세요." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h3 className="text-2xl font-bold font-serif mb-6">자주 묻는 질문 (FAQ)</h3>
          <div className="space-y-2">
            {faqs.map(faq => <FAQItem key={faq.q} question={faq.q} answer={faq.a} />)}
          </div>
          <div className="mt-10 bg-rose-50 p-6 rounded-lg">
             <h3 className="text-xl font-bold font-serif mb-4">전화 상담 안내</h3>
             <div className="flex items-center text-gray-700 mb-2">
                <Phone className="mr-3 h-5 w-5 text-rose-500" />
                <span>02-1234-5678</span>
             </div>
             <div className="flex items-center text-gray-700">
                <Mail className="mr-3 h-5 w-5 text-rose-500" />
                <span>contact@doyeonstory.com</span>
             </div>
             <p className="text-sm text-gray-500 mt-2">평일 10:00 ~ 18:00 (점심시간 12:00 ~ 13:00)</p>
          </div>
        </div>
        <div>
           <h3 className="text-2xl font-bold font-serif mb-6">1:1 문의하기</h3>
           <form className="bg-white p-8 rounded-lg shadow-md space-y-4">
              <input type="text" placeholder="성함" className="w-full p-3 border rounded-md" />
              <input type="email" placeholder="이메일" className="w-full p-3 border rounded-md" />
              <input type="text" placeholder="제목" className="w-full p-3 border rounded-md" />
              <textarea placeholder="문의 내용" rows={6} className="w-full p-3 border rounded-md"></textarea>
              <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3 rounded-md hover:bg-gray-900 transition-colors">
                문의 접수
              </button>
           </form>
        </div>
      </div>
    </PageWrapper>
  );
};

export default ContactPage;
