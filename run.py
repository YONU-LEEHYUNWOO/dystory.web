#!/usr/bin/env python3
"""
도연 Story Streamlit 앱 실행 스크립트
"""

import os
import sys
import subprocess
from pathlib import Path

def check_requirements():
    """필요한 파일들이 존재하는지 확인"""
    required_files = ['app.py', 'requirements.txt']
    missing_files = []
    
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ 누락된 파일들: {', '.join(missing_files)}")
        return False
    
    return True

def check_api_key():
    """Google API 키가 설정되었는지 확인"""
    api_key = os.getenv('GOOGLE_API_KEY')
    if not api_key:
        print("⚠️  GOOGLE_API_KEY 환경변수가 설정되지 않았습니다.")
        print("   Google AI Studio에서 API 키를 발급받아 설정해주세요.")
        print("   https://makersuite.google.com/app/apikey")
        return False
    return True

def install_requirements():
    """필요한 패키지들을 설치"""
    print("📦 필요한 패키지들을 설치합니다...")
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      check=True)
        print("✅ 패키지 설치 완료!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ 패키지 설치 실패: {e}")
        return False

def run_streamlit():
    """Streamlit 앱 실행"""
    print("🚀 Streamlit 앱을 실행합니다...")
    print("   브라우저에서 http://localhost:8501 로 접속하세요.")
    print("   종료하려면 Ctrl+C를 누르세요.")
    
    try:
        subprocess.run(['streamlit', 'run', 'app.py'], check=True)
    except KeyboardInterrupt:
        print("\n👋 앱이 종료되었습니다.")
    except subprocess.CalledProcessError as e:
        print(f"❌ Streamlit 실행 실패: {e}")

def main():
    """메인 함수"""
    print("💌 도연 Story - Streamlit 웹 앱")
    print("=" * 50)
    
    # 파일 존재 확인
    if not check_requirements():
        sys.exit(1)
    
    # API 키 확인
    if not check_api_key():
        print("\n💡 API 키를 설정한 후 다시 실행해주세요.")
        sys.exit(1)
    
    # 패키지 설치
    if not install_requirements():
        sys.exit(1)
    
    # Streamlit 실행
    run_streamlit()

if __name__ == "__main__":
    main()

