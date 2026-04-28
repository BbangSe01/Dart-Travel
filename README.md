# 🎯 다트 여행

> 지도에 다트를 던져 랜덤 국내 여행지를 결정하세요

**[→ 서비스 바로가기](https://dart-travel.vercel.app)**

SNS에서 유행하는 "다트로 지도 찍어 여행지 정하기"에서 영감을 받아 만든 서비스예요.  
실제 다트나 지도 없이도 랜덤 국내 여행을 떠날 수 있어요.

---

## ✨ 주요 기능

- **랜덤 여행지 추천** — 전국 135개 여행지 중 랜덤 선택
- **다트 던지기 애니메이션** — D3.js 기반 정밀 한국 지도 + 베지어 곡선 다트 애니메이션
- **여행지 상세 정보** — 한국관광공사 공식 사진, 여행지 소개, 꿀팁 제공
- **여행 맛보기** — 네이버 블로그 검색 API 연동으로 관련 블로그 5개 제공
- **결과 공유** — URL 파라미터로 결과 고정, 링크 복사로 간편 공유
- **반응형 UI** — 모바일 / 태블릿 / PC 환경별 최적화 레이아웃

---

## 🛠 기술 스택

| 분류       | 기술                                   |
| ---------- | -------------------------------------- |
| Framework  | Next.js 16 (App Router)                |
| Language   | TypeScript                             |
| Animation  | Framer Motion                          |
| Map        | D3.js + GeoJSON                        |
| API        | 한국관광공사 Tour API, 네이버 검색 API |
| Deployment | Vercel                                 |

---

## 📁 프로젝트 구조

```
dart-travel/
├── app/
│   ├── page.tsx                    # 메인 페이지 (state 관리)
│   ├── layout.tsx                  # 메타데이터 + OG 태그
│   ├── globals.css
│   └── api/
│       └── destination/route.ts    # 여행지 데이터 API
├── components/
│   ├── layout/
│   │   ├── MobileLayout.tsx
│   │   ├── TabletLayout.tsx
│   │   └── DesktopLayout.tsx
│   ├── panels/
│   │   ├── MapPanel.tsx            # 지도 + 다시던지기 버튼
│   │   └── ResultSet.tsx           # CourseCard + 스프링 + BlogPreview
│   ├── KoreaMap.tsx                # D3.js SVG 지도 + 다트 애니메이션
│   ├── CourseCard.tsx              # 여행지 정보 카드
│   ├── BlogPreview.tsx             # 네이버 블로그 미리보기
│   ├── InfoPanel.tsx               # 안내 패널
│   └── RevealOverlay.tsx           # 결과 공개 오버레이
├── data/
│   ├── destinations-client.ts      # 클라이언트용 여행지 데이터
│   └── destinations.json           # 서버 전용 상세 데이터 (gitignore)
├── hooks/
│   └── useMediaQuery.ts            # 반응형 분기 hook
├── public/
│   └── korea.json                  # 한국 행정구역 GeoJSON
└── scripts/
    ├── fetch-images.ts             # 한국관광공사 이미지 수집
    └── fetch-blogs.ts              # 네이버 블로그 수집
```

---

## 🚀 로컬 실행

```bash
# 패키지 설치
yarn install

# 개발 서버 실행
yarn dev
```

### 환경 변수 설정

`.env` 파일을 생성하고 아래 값을 입력하세요.

```env
TOUR_API_KEY=한국관광공사_인증키
NAVER_CLIENT_ID=네이버_클라이언트_아이디
NAVER_CLIENT_SECRET=네이버_시크릿
```

> `destinations.json`은 민감한 데이터가 포함되어 있어 gitignore 처리되어 있습니다.  
> 아래 스크립트로 직접 수집할 수 있어요.

```bash
# 한국관광공사 이미지 수집
yarn fetch-images

# 네이버 블로그 수집
yarn fetch-blogs
```

---
