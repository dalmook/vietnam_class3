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
├─ audio/                 # 이미 존재 (l0 ~ l15 하위 mp3)
├─ icons/
│  └─ icon.svg            # 임시 아이콘 (PNG 대체)
└─ README.md
```

- 실제 사용 JSON: `vietnamese_a1_to_opic_im1_starter.json`
- `data/...` 또는 `vietnamese_a1_lessons_1_6_starter.json`는 현재 앱에서 사용하지 않습니다.

## PWA 오프라인 캐시 동작 방식

- 앱 기본 파일(`index.html`, `styles.css`, `app.js`, `manifest`, 실제 사용 JSON, 아이콘)은 설치 시 안전 precache.
- JSON 요청은 **NetworkFirst**:
  - 온라인: 최신 JSON 수신 후 DATA 캐시에 갱신
  - 오프라인: 캐시된 JSON 반환
- mp3/wav/audio 요청은 **CacheFirst**:
  - 사용자가 재생한 오디오만 런타임 캐시 저장
  - install 단계에서 audio 전체 precache 하지 않음
- 이미지 요청은 **CacheFirst**
- JS/CSS/manifest는 **Stale-While-Revalidate**

## 새 버전 배포 시 동작

1. GitHub에 수정사항 push
2. 사용자 앱 재접속
3. 새 Service Worker 감지
4. 하단 업데이트 배너 표시
5. `지금 업데이트` 클릭 시 `SKIP_WAITING` 전송
6. `controllerchange` 후 1회 새로고침으로 최신 버전 반영

## mp3 교체 규칙

- 기존 mp3를 같은 파일명으로 덮어쓰기보다 **새 파일명** 사용을 권장합니다.
- JSON의 `audioSrc`를 새 파일명으로 변경하는 방식이 안전합니다.
- GitHub Pages 캐시 특성상 파일명 버전 전략이 업데이트 반영에 유리합니다.

## 오프라인 테스트 방법

1. 앱을 한 번 온라인으로 접속
2. 학습 화면에서 mp3 몇 개 재생
3. DevTools → Application → Service Workers / Cache Storage 확인
4. 네트워크를 Offline으로 전환 후 재접속
5. 기본 화면/JSON/재생했던 mp3가 동작하는지 확인

## 캐시 초기화 방법

1. 앱 내부: **설정 > 앱 캐시 초기화**
2. 학습 기록만 삭제: **설정 > 학습 기록 초기화**
3. 브라우저 전체 정리 필요 시: 사이트 데이터(쿠키/캐시/저장소) 삭제

## 아이콘 참고

- 현재 저장소에는 `icons/icon.svg`만 포함되어 있습니다.
- 추후 PWA 품질 향상을 위해 아래 PNG 아이콘 생성/추가를 권장합니다.
  - `icons/icon-192.png`
  - `icons/icon-512.png`
  - `icons/maskable-icon-512.png`
- PNG를 추가한 뒤 manifest `icons` 항목도 해당 파일로 교체하세요.
