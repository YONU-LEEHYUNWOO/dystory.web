#!/usr/bin/env python3
"""
도연 Story Streamlit 앱 테스트 스크립트
"""

import os
import sys
import subprocess
from pathlib import Path

def test_imports():
    """필요한 모듈들이 import되는지 테스트"""
    print("🔍 모듈 import 테스트...")
    
    try:
        import streamlit as st
        print("✅ streamlit import 성공")
    except ImportError as e:
        print(f"❌ streamlit import 실패: {e}")
        return False
    
    try:
        import google.generativeai as genai
        print("✅ google.generativeai import 성공")
    except ImportError as e:
        print(f"❌ google.generativeai import 실패: {e}")
        return False
    
    try:
        from PIL import Image
        print("✅ PIL import 성공")
    except ImportError as e:
        print(f"❌ PIL import 실패: {e}")
        return False
    
    return True

def test_app_structure():
    """앱 파일 구조 테스트"""
    print("🔍 앱 파일 구조 테스트...")
    
    required_files = [
        'app.py',
        'requirements.txt',
        'Dockerfile',
        'docker-compose.yml'
    ]
    
    all_exist = True
    for file in required_files:
        if Path(file).exists():
            print(f"✅ {file} 존재")
        else:
            print(f"❌ {file} 누락")
            all_exist = False
    
    return all_exist

def test_environment():
    """환경 설정 테스트"""
    print("🔍 환경 설정 테스트...")
    
    # API 키 확인
    api_key = os.getenv('GOOGLE_API_KEY')
    if api_key:
        print("✅ GOOGLE_API_KEY 설정됨")
        return True
    else:
        print("⚠️  GOOGLE_API_KEY가 설정되지 않음")
        print("   환경변수를 설정하거나 .env 파일을 생성해주세요.")
        return False

def main():
    """메인 테스트 함수"""
    print("🧪 도연 Story Streamlit 앱 테스트")
    print("=" * 50)
    
    tests = [
        ("모듈 Import", test_imports),
        ("파일 구조", test_app_structure),
        ("환경 설정", test_environment)
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 {test_name} 테스트:")
        result = test_func()
        results.append((test_name, result))
    
    print("\n" + "=" * 50)
    print("📊 테스트 결과:")
    
    all_passed = True
    for test_name, result in results:
        status = "✅ 통과" if result else "❌ 실패"
        print(f"   {test_name}: {status}")
        if not result:
            all_passed = False
    
    if all_passed:
        print("\n🎉 모든 테스트가 통과했습니다!")
        print("   이제 'python run.py' 또는 'streamlit run app.py'로 앱을 실행할 수 있습니다.")
    else:
        print("\n⚠️  일부 테스트가 실패했습니다.")
        print("   requirements.txt의 패키지들을 설치하고 환경변수를 설정해주세요.")
    
    return all_passed

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

