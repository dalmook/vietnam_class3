# 베트남어 단어장 (A1 듣기·말하기 1~6과)

순수 **HTML + CSS + JavaScript + JSON**으로 만든 GitHub Pages용 정적 학습 웹앱입니다.

## 1) 앱 소개
- 모바일 퍼스트 카드형 UI
- 하단 탭 네비게이션(홈/학습/퀴즈/검색/북마크/설정)
- 레슨 기반 단어/문장/회화/문법/발음 학습
- 다양한 퀴즈(객관식, 듣기, 순서, 성조, 매칭, 오답복습)
- `localStorage` 기반 학습 상태 저장
- mp3가 없을 때 Web Speech API(`vi-VN`) 음성 fallback
- 정답/학습 완료 시 토스트·축하 이펙트(🐳🎉)로 동기부여 강화
- 학습 카드 조작 간소화: 우측 상단 아이콘(알아요/몰라요/북마크), 카드 탭으로 뜻 표시/숨김
- 0단계(Bài 0) 추가: 자음·모음·숫자 기초를 다른 레슨과 동일한 카드 구조로 학습
- 발음은 과도한 한글 분해 대신 문장 단위 `발음 느낌` 표기로 제공

- 기본 포함 데이터셋 규모: 레슨 7개, 단어 140개, 문장 60개
- 한글 유사 발음 사전 매핑: 자주 쓰는 베트남어 표현 255개 내장

## 2) 폴더 구조
```text
.
├─ index.html
├─ styles.css
├─ app.js
├─ sw.js
├─ manifest.webmanifest
├─ vietnamese_a1_to_opic_im1_starter.json
├─ vietnamese_a1_lessons_1_6_starter.json
└─ README.md
```

## 3) 실행 방법
### 로컬 실행
1. 저장소를 클론합니다.
2. `index.html`을 브라우저에서 직접 열거나(간단 확인), 권장: 정적 서버로 실행합니다.
   - 예) `python -m http.server 5500`
3. 브라우저에서 `http://localhost:5500` 접속

## 4) GitHub Pages 배포 방법
1. GitHub 저장소 → **Settings**
2. **Pages** 메뉴
3. **Deploy from a branch** 선택
4. Branch: `main`, Folder: `/ (root)` 선택 후 Save
5. 배포 URL 예시: `https://dalmook.github.io/vietnam_class3/`

> 경로 안정성을 위해 JSON 로딩은 아래 순서로 시도합니다.
> 1) `./vietnamese_a1_to_opic_im1_starter.json`  
> 2) `./data/vietnamese_a1_to_opic_im1_starter.json`  
> 3) `./vietnamese_a1_lessons_1_6_starter.json`  
> 4) `./data/vietnamese_a1_lessons_1_6_starter.json`

## 5) JSON 데이터 구조 설명

기본 포함 데이터셋 `vietnamese_a1_to_opic_im1_starter.json`은 **기초 인사 → 자기소개 → 일상 루틴 → 취미 → 여행/길찾기 → 집/동네(OPIC IM1 주제)** 순서로 설계되어 있습니다.
이 앱은 **기존 JSON 구조를 변경하지 않고** 읽어서 사용합니다.
- `lessons[]`
  - `vocabCards[]`
  - `sentenceCards[]`
  - `dialogues[]`
  - `grammarPoints[]`
  - `pronunciationTargets[]`
  - `quizSeeds[]`

앱은 위 배열들을 레슨 단위로 표시하고, 내부적으로 집계하여 검색/퀴즈/통계에 재사용합니다.

## 6) 오디오 파일 추가 방법
JSON의 `audioSrc`가 `/audio/...` 형식이면, 저장소 루트 기준 `audio/` 폴더를 추가해 파일을 배치하세요.

예)
```text
/audio/lesson-1/a.mp3
/audio/lesson-2/dialogue-1.mp3
```

GitHub Pages에서 재생 경로 이슈가 있으면 상대경로로 관리하거나, JSON `audioSrc`를 배포 경로에 맞게 조정하세요.

## 7) Web Speech API fallback
- 오디오 mp3 재생 실패 시 자동으로 `SpeechSynthesisUtterance`를 사용합니다.
- 언어: `vi-VN`
- 속도: 설정 탭에서 조절 가능

## 8) JSON 로딩 실패 시 해결
1. 파일명이 정확히 `vietnamese_a1_lessons_1_6_starter.json`인지 확인
2. `index.html`과 같은 폴더(또는 `data/` 폴더) 배치 확인
3. GitHub Pages 브랜치/폴더 설정 확인
4. 브라우저 캐시 삭제 후 재시도
5. 로컬에서는 정적 서버(`python -m http.server`)로 열기 권장
6. 앱 내부 **설정 > 오류 복구(캐시 초기화)** 버튼으로 Service Worker/Cache Storage 초기화 후 새로고침
7. 특히 삼성 인터넷에서 이전 오류 캐시가 남아있는 경우, 브라우저 앱 설정에서 사이트 데이터 삭제 후 재접속
8. 브라우저별 오디오 차이가 있으면 **설정 > 음성 테스트**를 눌러 권한/자동재생 정책 해제 여부를 먼저 확인

## 9) 향후 개선 아이디어
- spaced repetition(SM-2) 알고리즘 적용
- 마이크 입력 기반 따라 말하기 평가
- PWA 오프라인 캐시 고도화
- 레슨별 목표(일일 10개) 알림
- 학습 데이터 내보내기/가져오기
