export enum Page {
  Home = 'Home',
  StoryBased = 'StoryBased',
  Designs = 'Designs',
  Gallery = 'Gallery',
  Standard = 'Standard',
  Order = 'Order',
  Contact = 'Contact'
}

export interface DesignConcept {
  title: string;
  description: string;
  imagePrompt: string;
  formatSuggestion?: string;
  imageUrl?: string;
  formatImageUrls?: string[];
}

export interface PreMadeDesign {
  id: string;
  name: string;
  imageUrl: string;
  style: '모던' | '빈티지' | '로맨틱' | '미니멀' | '전통' | '캐주얼';
  theme: '꽃' | '자연' | '일러스트' | '사진' | '캘리그라피';
  color: '웜톤' | '쿨톤' | '파스텔' | '비비드';
}

export interface Order {
  design: {
    name: string;
    imageUrl: string;
  };
  quantity: number;
  options: {
    envelope: '기본' | '고급' | null;
    sticker: boolean;
    mealTicket: boolean;
    map: boolean;
    mobile: boolean;
  };
  details: {
    groomName: string;
    brideName: string;
    date: string;
    time: string;
    place: string;
    message: string;
    contact: string;
    address: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  story: string;
}