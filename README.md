# 🚗 Parking Map & Realtime Service (Frontend)

전국 공영주차장 표준 데이터와 서울시 실시간 주차장 현황을 결합하여, 지도 기반으로 주차장 위치와 실시간 잔여 주차면수를 제공하는 크로스 플랫폼(React Native / Web) 모바일 앱 서비스입니다.

---

## 🛠 Tech Stack

*   **Core:** React Native (v0.81.5), Expo (v54), Expo Router (v6)
*   **Language:** TypeScript
*   **Styling:** NativeWind (Tailwind CSS for React Native)
*   **State Management:** Zustand
*   **Form & Validation:** React Hook Form, Zod
*   **Map Integration:** Kakao Maps SDK / React Native WebView
*   **Network:** Axios, Async Storage

---

## ✨ Key Features

1.  **위치 기반 지도 및 마커 클러스터링**
*   Expo Location을 활용한 사용자 현재 위치 탐색 및 초기 중심 좌표 설정
*   카카오맵 연동을 통한 영역 기반(Bounding Box) 주차장 마커 동적 렌더링 및 클러스터링
2.  **실시간 주차 현황 및 상세 정보 제공**
*   마커 클릭 시 바텀 시트(Bottom Sheet) 패널을 통해 요금 정보, 운영 시간, 관리기관 등 상세 정보 제공
*   서울시 실시간 연동 주차장의 경우 최신 잔여 대수 및 혼잡도(`NORMAL`, `CROWDED` 등) 하이라이트
3.  **사용자 인증 (Authentication)**
*   JWT 기반 로그인 및 회원가입 (`react-hook-form` + `zod` 스키마 검증)
*   전역 상태(`Zustand`) 및 `AsyncStorage`를 활용한 세션 관리
4.  **즐겨찾기 (Favorites)**
*   마커 상세 패널에서 별 모양 버튼을 통한 빠른 즐겨찾기 토글 (낙관적 업데이트 적용)
*   로그인 사용자 전용 즐겨찾기 목록 화면(`/favorites`) 제공 및 주차장 이름 검색 기능
*   즐겨찾기 목록에서 항목 클릭 시 해당 주차장 위치로 지도 탭 이동 및 상세 패널 자동 오픈

---

## 📂 Project Structure

```text
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         # 바텀 탭 네비게이션 설정
│   │   ├── index.tsx           # 지도 및 메인 화면 (MapScreen)
│   │   ├── favorite            # 즐겨찾기 화면
│   │   └── my                  # 마이페이지 화면
│   ├── auth/
│   │   ├── login           # 로그인 화면
│   │   └── signup          # 회원가입 화면
│   └── _layout.tsx             # 루트 레이아웃 및 프로바이더 설정
├── api/
│   ├── axiosInstance.ts        # Axios 공통 인스턴스 및 인터셉터
│   └── general/
│       ├── parkingApi.ts       # 주차장 목록/상세 API
│       ├── favoriteApi.ts      # 즐겨찾기 토글 및 목록 API
│       └── userApi.ts          # 인증 관련 API
├── components/
│   ├── common/
│   │   ├── map                 # 카카오맵 래퍼 컴포넌트 (WebView 기반)
│   │   ├── button              # 공통 버튼
│   │   ├── input               # 공통 입력 필드
│   │   └── modal/ParkingLotDetailPanel.tsx # 주차장 상세 정보 모달
│   └── layout/MainHeader.tsx   # 메인헤더 컴포넌트
├── schemas/
│   └── user                    # 사용자 관련 스키마 정의
├── stores/
│   └── user/
│       └── useUserStore.ts     # 사용자 세션 상태 관리 (Zustand)
└── types/
    ├── parking.ts              # 주차장 및 바운더리 관련 타입 정의
    └── user.ts                 # 사용자 관련 타입 정의
```

---

## 🚀 Getting Started
### 1. Prerequisite
- Node.js (LTS version recommended)
- pnpm (or npm / yarn)
- Expo Go app (mobile testing) or Web Browser

### 2. Installation
- 프로젝트 디렉토리로 이동하여 필요한 패키지를 설치합니다.

```bash
pnpm install
```

### 3. Environment Variables
- 프로젝트 루트에 .env 파일을 생성하고 카카오맵 API 키를 설정합니다.

```dotenv
EXPO_PUBLIC_KAKAO_APP_KEY=your_kakao_javascript_key_here
```

### 4. Run Development Server
- 엑스포 개발 서버를 실행합니다.

```Bash
# 기본 실행
pnpm start

# 플랫폼별 개별 실행
pnpm android
pnpm ios
pnpm web
```