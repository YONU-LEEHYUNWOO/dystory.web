import streamlit as st
import os
import base64
from io import BytesIO
from PIL import Image
import json
from typing import List, Dict, Any
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

# 페이지 설정
st.set_page_config(
    page_title="도연 Story - 당신의 특별한 이야기를 담은 청첩장",
    page_icon="💌",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Gemini API 설정
if not os.getenv("GOOGLE_API_KEY"):
    st.error("GOOGLE_API_KEY 환경변수를 설정해주세요.")
    st.stop()

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# 세션 상태 초기화
if 'current_page' not in st.session_state:
    st.session_state.current_page = 'home'
if 'selected_design' not in st.session_state:
    st.session_state.selected_design = None
if 'designs' not in st.session_state:
    st.session_state.designs = []

# 디자인 컨셉 데이터 구조
class DesignConcept:
    def __init__(self, title: str, description: str, image_prompt: str, 
                 format_suggestion: str = None, image_url: str = None, 
                 format_image_urls: List[str] = None):
        self.title = title
        self.description = description
        self.image_prompt = image_prompt
        self.format_suggestion = format_suggestion
        self.image_url = image_url
        self.format_image_urls = format_image_urls or []

# AI 서비스 함수들
def generate_invitation_concepts(story: str, color: str, mood: str, 
                                elements: str, image_data: str = None) -> List[DesignConcept]:
    """AI를 사용하여 청첩장 디자인 컨셉을 생성하는 함수 (데모용)"""
    try:
        # 데모용 디자인 컨셉 생성
        concepts = []
        
        # 스토리에서 키워드 추출
        keywords = []
        if "벚꽃" in story or "벚꽃잎" in story:
            keywords.append("벚꽃")
        if "여행" in story:
            keywords.append("여행")
        if "고양이" in story:
            keywords.append("고양이")
        if "강" in story or "강가" in story:
            keywords.append("강")
        
        # 색상과 분위기에 따른 컨셉 생성
        color_theme = color if color else "로맨틱한"
        mood_theme = mood if mood else "따뜻한"
        
        # 첫 번째 컨셉
        concept1 = DesignConcept(
            title=f"{mood_theme} {color_theme} 이야기",
            description=f"'{story[:50]}...'의 이야기를 담은 {color_theme} 색조의 {mood_theme} 분위기 청첩장입니다. " + 
                       ("벚꽃" if "벚꽃" in story else "자연") + "을 모티브로 한 우아한 디자인으로, " +
                       "커플의 특별한 순간을 아름답게 표현합니다.",
            image_prompt=f"Wedding invitation design with {color_theme} colors, {mood_theme} mood, romantic style, elegant typography, floral elements",
            format_suggestion="벚꽃 모양으로 따낸 다이컷 카드 형태의 청첩장"
        )
        concepts.append(concept1)
        
        # 두 번째 컨셉
        concept2 = DesignConcept(
            title=f"우리의 {mood_theme} 순간",
            description=f"커플의 소중한 추억을 담은 {color_theme} 톤의 디자인입니다. " +
                       "미니멀하면서도 감성적인 레이아웃으로, " +
                       "결혼식의 특별함을 강조합니다.",
            image_prompt=f"Minimalist wedding invitation, {color_theme} color palette, clean design, modern typography, elegant layout",
            format_suggestion="펼치면 입체적인 팝업이 나타나는 형식의 청첩장"
        )
        concepts.append(concept2)
        
        # 세 번째 컨셉
        concept3 = DesignConcept(
            title=f"{color_theme} 꿈의 시작",
            description=f"커플만의 독특한 이야기를 반영한 {mood_theme} 분위기의 청첩장입니다. " +
                       "창의적인 레이아웃과 세심한 디테일로 " +
                       "특별한 순간을 더욱 빛나게 합니다.",
            image_prompt=f"Creative wedding invitation design, {color_theme} tones, {mood_theme} atmosphere, artistic layout, unique format",
            format_suggestion="여행 티켓 모양의 청첩장으로 커플의 여행 취향을 반영"
        )
        concepts.append(concept3)
        
        return concepts
        
    except Exception as e:
        st.error(f"디자인 컨셉 생성 중 오류가 발생했습니다: {str(e)}")
        return []

def generate_invitation_image(prompt: str) -> str:
    """AI를 사용하여 청첩장 이미지를 생성하는 함수 (데모용)"""
    try:
        # API 사용량 제한으로 인해 데모용 이미지 사용
        # 실제 서비스에서는 Google Imagen API 사용
        import random
        
        # 프롬프트에 따른 다양한 데모 이미지 생성
        if "벚꽃" in prompt or "cherry" in prompt.lower():
            return "https://picsum.photos/seed/cherry/600/800"
        elif "minimalist" in prompt.lower() or "미니멀" in prompt:
            return "https://picsum.photos/seed/minimal/600/800"
        elif "creative" in prompt.lower() or "창의" in prompt:
            return "https://picsum.photos/seed/creative/600/800"
        elif "romantic" in prompt.lower() or "로맨틱" in prompt:
            return "https://picsum.photos/seed/romantic/600/800"
        else:
            # 랜덤한 아름다운 이미지
            seeds = ["wedding", "invitation", "elegant", "beautiful", "love"]
            seed = random.choice(seeds)
            return f"https://picsum.photos/seed/{seed}/600/800"
            
    except Exception as e:
        st.error(f"이미지 생성 중 오류가 발생했습니다: {str(e)}")
        return "https://picsum.photos/600/800?grayscale"

# 헤더 컴포넌트
def render_header():
    """헤더 렌더링 함수"""
    st.markdown("""
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                padding: 2rem 0; text-align: center; color: white; margin-bottom: 2rem;">
        <h1 style="font-size: 3rem; font-weight: bold; margin: 0;">
            💌 도연 Story
        </h1>
        <p style="font-size: 1.2rem; margin: 0.5rem 0 0 0; opacity: 0.9;">
            당신의 특별한 이야기를 담은 청첩장
        </p>
    </div>
    """, unsafe_allow_html=True)

# 홈페이지 렌더링
def render_home_page():
    """홈페이지 렌더링 함수"""
    st.markdown("""
    <div style="text-align: center; padding: 3rem 0;">
        <h2 style="font-size: 2.5rem; color: #333; margin-bottom: 1rem;">
            당신의 이야기가 청첩장이 됩니다
        </h2>
        <p style="font-size: 1.2rem; color: #666; margin-bottom: 3rem;">
            도연 Story와 함께 가장 특별한 순간을 알려보세요.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # 메뉴 아이템들
    col1, col2 = st.columns(2)
    
    with col1:
        if st.button("✨ 나만의 청첩장 만들기", use_container_width=True, 
                    help="AI와 함께 당신의 이야기를 세상에 단 하나뿐인 디자인으로 만드세요."):
            st.session_state.current_page = 'story_based'
            st.rerun()
        
        if st.button("🎨 디자인 시안 둘러보기", use_container_width=True,
                    help="다양한 테마와 스타일의 감성적인 디자인들을 만나보세요."):
            st.session_state.current_page = 'designs'
            st.rerun()
    
    with col2:
        if st.button("💌 일반 청첩장", use_container_width=True,
                    help="클래식하고 세련된, 기본에 충실한 디자인을 선택하세요."):
            st.session_state.current_page = 'standard'
            st.rerun()
        
        if st.button("🛒 가격 안내 및 주문", use_container_width=True,
                    help="옵션을 선택하고 간편하게 주문을 완료하세요."):
            st.session_state.current_page = 'order'
            st.rerun()

# 스토리 기반 페이지 렌더링
def render_story_based_page():
    """스토리 기반 청첩장 생성 페이지"""
    st.markdown("""
    <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; color: #333;">우리의 특별한 이야기, 한 장의 예술로</h2>
        <p style="color: #666; font-size: 1.1rem;">
            고객님의 소중한 사연을 바탕으로 세상에 단 하나뿐인 청첩장을 디자인해 드립니다.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    with st.form("story_form"):
        # 우리의 이야기 입력
        story = st.text_area(
            "우리의 이야기 들려주세요",
            placeholder="저희는 벚꽃이 만개한 날, 처음 만났어요. 서로 첫눈에 반했고, 그는 저에게 벚꽃잎이 흩날리는 강가에서 기타를 치며 프러포즈를 했답니다. 저희를 상징하는 동물은 고양이이고, 둘 다 여행을 좋아해요.",
            height=150
        )
        
        # 사진 업로드
        uploaded_file = st.file_uploader("사진 추가 (선택)", type=['png', 'jpg', 'jpeg'])
        
        col1, col2 = st.columns(2)
        with col1:
            color = st.text_input("원하는 색상 계열 (선택)", placeholder="예: 핑크, 골드")
            mood = st.text_input("선호하는 분위기 (선택)", placeholder="예: 따뜻한, 시크한, 발랄한")
        
        with col2:
            elements = st.text_input("특별히 넣고 싶은 요소 (선택)", placeholder="예: 벚꽃, 고양이")
        
        submitted = st.form_submit_button("나만의 청첩장 디자인 추천받기", use_container_width=True)
        
        if submitted:
            if not story:
                st.error("우리의 이야기를 들려주세요.")
            else:
                with st.spinner("AI가 당신의 이야기를 바탕으로 디자인을 만들고 있어요. 잠시만 기다려주세요..."):
                    # 이미지 데이터 처리
                    image_data = None
                    if uploaded_file:
                        image_bytes = uploaded_file.read()
                        image_data = base64.b64encode(image_bytes).decode()
                        image_data = f"data:image/{uploaded_file.type.split('/')[1]};base64,{image_data}"
                    
                    # AI 디자인 컨셉 생성
                    concepts = generate_invitation_concepts(story, color, mood, elements, image_data)
                    
                    if concepts:
                        st.session_state.designs = concepts
                        st.success("디자인 컨셉이 생성되었습니다!")
                        st.rerun()
                    else:
                        st.error("디자인 생성에 실패했습니다. 다시 시도해주세요.")

# 디자인 결과 표시
def render_design_results():
    """생성된 디자인 결과 표시"""
    if st.session_state.designs:
        st.markdown("### 당신의 이야기를 담은 디자인 시안")
        
        for i, design in enumerate(st.session_state.designs):
            with st.expander(f"🎨 {design.title}", expanded=True):
                col1, col2 = st.columns([1, 2])
                
                with col1:
                    # 이미지 생성 (실제로는 AI 이미지 생성)
                    image_url = generate_invitation_image(design.image_prompt)
                    st.image(image_url, caption=design.title, use_column_width=True)
                
                with col2:
                    st.markdown(f"**설명:** {design.description}")
                    
                    if design.format_suggestion:
                        st.markdown(f"**디자인 형식 제안:** {design.format_suggestion}")
                    
                    if st.button(f"이 디자인으로 주문하기", key=f"order_{i}"):
                        st.session_state.selected_design = {
                            'name': design.title,
                            'image_url': image_url
                        }
                        st.session_state.current_page = 'order'
                        st.rerun()

# 디자인 갤러리 페이지
def render_designs_page():
    """디자인 갤러리 페이지"""
    st.markdown("""
    <div style="text-align: center; margin-bottom: 2rem;">
        <h2 style="font-size: 2rem; color: #333;">도연 Story가 제안하는 아름다운 디자인</h2>
        <p style="color: #666; font-size: 1.1rem;">
            다양한 테마와 스타일로 미리 제작된 청첩장 디자인 시안들을 만나보세요.
        </p>
    </div>
    """, unsafe_allow_html=True)
    
    # 필터 옵션
    col1, col2, col3 = st.columns(3)
    with col1:
        style_filter = st.selectbox("스타일", ["전체", "모던", "빈티지", "로맨틱", "미니멀", "전통", "캐주얼"])
    with col2:
        theme_filter = st.selectbox("테마", ["전체", "꽃", "자연", "일러스트", "사진", "캘리그라피"])
    with col3:
        color_filter = st.selectbox("색상", ["전체", "웜톤", "쿨톤", "파스텔", "비비드"])
    
    # 샘플 디자인들
    designs = [
        {"name": "봄날의 속삭임", "style": "로맨틱", "theme": "꽃", "color": "파스텔", "image": "https://picsum.photos/id/1025/300/400"},
        {"name": "숲속의 왈츠", "style": "빈티지", "theme": "자연", "color": "웜톤", "image": "https://picsum.photos/id/1043/300/400"},
        {"name": "도시의 야경", "style": "모던", "theme": "사진", "color": "쿨톤", "image": "https://picsum.photos/id/1050/300/400"},
        {"name": "순수한 서약", "style": "미니멀", "theme": "캘리그라피", "color": "파스텔", "image": "https://picsum.photos/id/1060/300/400"},
    ]
    
    # 필터링
    filtered_designs = [d for d in designs if 
                       (style_filter == "전체" or d["style"] == style_filter) and
                       (theme_filter == "전체" or d["theme"] == theme_filter) and
                       (color_filter == "전체" or d["color"] == color_filter)]
    
    # 디자인 그리드 표시
    cols = st.columns(2)
    for i, design in enumerate(filtered_designs):
        with cols[i % 2]:
            st.image(design["image"], caption=design["name"])
            st.write(f"**{design['name']}**")
            st.write(f"스타일: {design['style']} | 테마: {design['theme']}")
            if st.button(f"이 디자인으로 주문", key=f"design_{i}"):
                st.session_state.selected_design = {
                    'name': design['name'],
                    'image_url': design['image']
                }
                st.session_state.current_page = 'order'
                st.rerun()

# 주문 페이지
def render_order_page():
    """주문 페이지"""
    if not st.session_state.selected_design:
        st.error("선택된 디자인이 없습니다.")
        st.button("홈으로 돌아가기", on_click=lambda: setattr(st.session_state, 'current_page', 'home'))
        return
    
    st.markdown("### 주문하기")
    st.write(f"선택된 디자인: **{st.session_state.selected_design['name']}**")
    
    col1, col2 = st.columns(2)
    with col1:
        st.image(st.session_state.selected_design['image_url'], caption=st.session_state.selected_design['name'])
    
    with col2:
        st.markdown("#### 주문 정보")
        
        with st.form("order_form"):
            quantity = st.number_input("수량", min_value=1, max_value=100, value=10)
            
            st.markdown("#### 옵션 선택")
            envelope = st.selectbox("봉투", ["기본", "고급"])
            sticker = st.checkbox("스티커 추가")
            meal_ticket = st.checkbox("식권 추가")
            map_option = st.checkbox("지도 추가")
            mobile = st.checkbox("모바일 청첩장")
            
            st.markdown("#### 청첩장 내용")
            groom_name = st.text_input("신랑 이름")
            bride_name = st.text_input("신부 이름")
            date = st.date_input("결혼 날짜")
            time = st.time_input("결혼 시간")
            place = st.text_input("결혼 장소")
            message = st.text_area("메시지")
            contact = st.text_input("연락처")
            address = st.text_area("배송 주소")
            
            if st.form_submit_button("주문 완료", use_container_width=True):
                st.success("주문이 완료되었습니다! 곧 연락드리겠습니다.")
                st.session_state.current_page = 'home'
                st.rerun()

# 메인 앱
def main():
    """메인 앱 함수"""
    render_header()
    
    # 사이드바 네비게이션
    with st.sidebar:
        st.markdown("### 🧭 메뉴")
        if st.button("🏠 홈", use_container_width=True):
            st.session_state.current_page = 'home'
            st.rerun()
        if st.button("✨ 나만의 청첩장", use_container_width=True):
            st.session_state.current_page = 'story_based'
            st.rerun()
        if st.button("🎨 디자인 갤러리", use_container_width=True):
            st.session_state.current_page = 'designs'
            st.rerun()
        if st.button("🛒 주문하기", use_container_width=True):
            st.session_state.current_page = 'order'
            st.rerun()
    
    # 페이지 렌더링
    if st.session_state.current_page == 'home':
        render_home_page()
    elif st.session_state.current_page == 'story_based':
        render_story_based_page()
        render_design_results()
    elif st.session_state.current_page == 'designs':
        render_designs_page()
    elif st.session_state.current_page == 'order':
        render_order_page()

if __name__ == "__main__":
    main()
