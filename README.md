# 베트남어 단어장 (A1 ~ OPIc IM1)

순수 **HTML + CSS + JavaScript + JSON** 기반 정적 웹앱이며, GitHub Pages `https://dalmook.github.io/vietnam_class3/` 하위 경로 배포를 기준으로 동작합니다.

## 현재 폴더 구조

```text
.
├─ index.html
├─ styles.css
├─ app.js
├─ sw.js
├─ manifest.webmanifest
├─ vietnamese_a1_to_opic_im1_starter.json
├─ audio/                 # l0 ~ l15 하위 mp3
├─ icons/
│  ├─ icon-192.png
│  ├─ icon-512.png
│  └─ maskable-icon-512.png
└─ README.md
```

## PWA 설치 방법

- **Android Chrome**: 메뉴 → **앱 설치** 또는 **홈 화면에 추가**
- **iPhone Safari**: 공유 버튼 → **홈 화면에 추가**
- **PC Chrome**: 주소창 설치 아이콘 또는 메뉴 → **설치**

## 설치 버튼이 바로 안 보일 때 확인할 것

- `manifest.webmanifest`의 `icons` 배열이 비어 있지 않은지 확인
- Service Worker가 정상 등록되었는지 확인
- GitHub Pages 배포가 최신 커밋인지 확인
- 기존 캐시가 남아 있으면 **설정 > 앱 캐시 초기화** 실행
- Chrome DevTools → Application → Manifest / Service Workers 확인

## 오프라인 캐시 방식

- 앱 기본 파일(`index.html`, `styles.css`, `app.js`, `manifest`, 실제 사용 JSON): 설치 시 캐시
- JSON 요청: **NetworkFirst**
- mp3 요청: 사용자가 재생한 파일부터 **CacheFirst** 런타임 캐시
- 이미지 요청: **CacheFirst**

## 새 버전 배포 방식

1. `sw.js`의 `APP_VERSION` 증가
2. GitHub push
3. 사용자 접속 시 업데이트 배너 표시
4. **지금 업데이트** 클릭 시 `SKIP_WAITING` 후 새 버전 적용

## 캐시/데이터 초기화

- **설정 > 앱 캐시 초기화**: Service Worker + Cache Storage 삭제 후 새로고침
- **설정 > 학습 기록 초기화**: localStorage의 진도/북마크/오답 기록 삭제
