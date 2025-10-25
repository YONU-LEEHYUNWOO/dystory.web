# 도연 Story - Streamlit 웹 앱

당신의 특별한 이야기를 담은 청첩장을 AI와 함께 만드는 Streamlit 웹 애플리케이션입니다.

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 가상환경 생성 (권장)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp env.example .env

# .env 파일에서 GOOGLE_API_KEY 설정
# Google AI Studio에서 API 키를 발급받아 설정하세요
```

### 3. 앱 실행

```bash
streamlit run app.py
```

브라우저에서 `http://localhost:8501`로 접속하세요.

## 🐳 Docker로 실행

### Docker Compose 사용 (권장)

```bash
# 환경 변수 설정
export GOOGLE_API_KEY=your_api_key_here

# Docker Compose로 실행
docker-compose up --build
```

### Docker 직접 사용

```bash
# 이미지 빌드
docker build -t doyeon-story .

# 컨테이너 실행
docker run -p 8501:8501 -e GOOGLE_API_KEY=your_api_key_here doyeon-story
```

## 🌐 배포 옵션

### 1. Streamlit Cloud (무료)

1. GitHub에 코드 푸시
2. [Streamlit Cloud](https://share.streamlit.io/)에서 배포
3. 환경 변수에서 `GOOGLE_API_KEY` 설정

### 2. Heroku

```bash
# Heroku CLI 설치 후
heroku create your-app-name
heroku config:set GOOGLE_API_KEY=your_api_key_here
git push heroku main
```

### 3. AWS/GCP/Azure

Docker 이미지를 사용하여 클라우드 플랫폼에 배포할 수 있습니다.

## 📁 프로젝트 구조

```
├── app.py                 # 메인 Streamlit 앱
├── requirements.txt       # Python 의존성
├── Dockerfile            # Docker 설정
├── docker-compose.yml    # Docker Compose 설정
├── .streamlit/           # Streamlit 설정
│   └── config.toml
├── env.example           # 환경 변수 예시
└── README_STREAMLIT.md   # 이 파일
```

## 🔧 주요 기능

- **AI 기반 청첩장 디자인**: Gemini AI를 사용한 맞춤형 디자인 생성
- **스토리 기반 디자인**: 커플의 이야기를 바탕으로 한 개인화된 디자인
- **디자인 갤러리**: 다양한 테마의 미리 제작된 디자인들
- **주문 시스템**: 간편한 주문 및 옵션 선택
- **반응형 디자인**: 모바일과 데스크톱 모두 지원

## 🛠️ 개발

### 로컬 개발 환경

```bash
# 개발 모드로 실행
streamlit run app.py --server.runOnSave true
```

### 코드 스타일

- Python PEP 8 스타일 가이드 준수
- Type hints 사용
- 함수별 주석 작성

## 📝 API 키 설정

1. [Google AI Studio](https://makersuite.google.com/app/apikey)에서 API 키 발급
2. 환경 변수에 설정:
   ```bash
   export GOOGLE_API_KEY=your_api_key_here
   ```

## 🐛 문제 해결

### 일반적인 문제들

1. **API 키 오류**: `GOOGLE_API_KEY` 환경 변수가 올바르게 설정되었는지 확인
2. **포트 충돌**: 8501 포트가 사용 중인 경우 다른 포트 사용
3. **의존성 오류**: `pip install -r requirements.txt` 재실행

### 로그 확인

```bash
# Streamlit 로그 확인
streamlit run app.py --logger.level debug
```

## 📞 지원

문제가 발생하면 GitHub Issues에 문의해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

