# HAN BI SCHEDULE

HAN BI SCHEDULE는 월별 비행 일정을 정리하고, 결과를 배경화면 이미지로 생성할 수 있는 React 기반 웹앱입니다.

## Overview

- 월별 비행 일정 입력 및 관리
- Firebase Firestore 기반 일정 저장
- 배경 색상, 이벤트 색상, 썸네일 이미지 커스터마이징
- Canvas 기반 배경화면 생성 및 다운로드
- Excel 내보내기 지원
- 한국어 / 영어 전환 지원

## Roles

- Cloudflare: 정적 프론트엔드 배포
- Firebase Firestore: 일정 데이터 저장소

즉, 현재 구조는 "배포는 Cloudflare, 데이터는 Firebase"입니다.

## Core Features

### 1. Monthly schedule workflow

- 월별 비행 일정을 입력하고 저장할 수 있습니다.
- 저장된 일정은 정렬, 삭제, 재조회가 가능합니다.
- 저장된 월을 다시 열어 이어서 작업할 수 있습니다.

### 2. Wallpaper customization

- 배경 색상 선택
- 이벤트 타입별 색상 조정
- 사용자 이미지 업로드 및 미리보기
- 생성 전 설정 검토

### 3. Canvas-based wallpaper generation

- 입력된 일정 데이터를 바탕으로 배경화면 이미지를 생성합니다.
- 결과 이미지를 PNG로 다운로드할 수 있습니다.

### 4. Data persistence

- Firebase Firestore를 사용해 일정 데이터를 저장하고 불러옵니다.
- 배포 환경에서는 Cloudflare에 설정된 `VITE_FIREBASE_*` 환경변수로 Firebase에 연결합니다.

### 5. Export and accessibility

- 일정 데이터를 Excel 파일로 내보낼 수 있습니다.
- 한국어와 영어 인터페이스를 지원합니다.

## Tech Stack

| Category | Stack |
| --- | --- |
| Frontend | `React 19`, `React DOM` |
| Build Tool | `Vite` |
| Styling | `Tailwind CSS`, `PostCSS`, `Autoprefixer` |
| State Management | `Zustand` |
| Backend / Database | `Firebase`, `Cloud Firestore` |
| Internationalization | `i18next`, `react-i18next` |
| Export | `xlsx` |
| Image Generation | `HTML Canvas API` |
| Deployment | `Cloudflare` |

## Directory Structure

```text
airplaneSchedule/
├─ public/                    # og-image, sitemap, robots 등 정적 SEO 자산
├─ src/
│  ├─ app/                    # 공통 UI, i18n, 상태, 유틸
│  ├─ assets/                 # 정적 이미지 자산
│  ├─ features/               # 기능별 모듈
│  ├─ App.jsx                 # 최상위 앱 컴포넌트
│  └─ firebaseConfig.js       # Firebase 초기화 및 환경변수 검증
├─ index.html                 # 문서 메타, inline SVG favicon, OG 설정
├─ firebase.json              # 예전 Firebase Hosting 설정 파일
├─ .firebaserc                # 예전 Firebase 프로젝트 연결 정보
├─ wrangler.toml              # Cloudflare Workers 배포 설정
└─ vite.config.js             # Vite 설정
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Create environment variables

프로젝트 루트에 `.env.local` 파일을 만들고 아래 값을 설정합니다.

```env
VITE_FIREBASE_API_KEY=your_value
VITE_FIREBASE_AUTH_DOMAIN=your_value
VITE_FIREBASE_PROJECT_ID=your_value
VITE_FIREBASE_STORAGE_BUCKET=your_value
VITE_FIREBASE_MESSAGING_SENDER_ID=your_value
VITE_FIREBASE_APP_ID=your_value
```

### 3. Run the app

```bash
npm run dev
```

기본 개발 서버 포트는 `3000`입니다.

## Build

```bash
npm run build
```

빌드 결과물은 `dist/`에 생성됩니다.

## Deployment

현재 배포 기준은 Cloudflare Workers입니다.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Assets directory: `dist`

Cloudflare 프로젝트 설정에서 아래 환경변수를 등록해야 Firestore가 정상 동작합니다.

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

Cloudflare 설정 경로:

`Settings > Variables and Secrets`

## Firebase Notes

- `firebase.json`과 `.firebaserc`는 예전 Firebase Hosting 설정 흔적입니다.
- 현재 앱의 실제 배포는 Cloudflare에서 이루어집니다.
- Firebase 프로젝트 자체는 Firestore 데이터 저장 때문에 계속 필요합니다.

## SEO Assets

현재 `public/`에는 아래 SEO 관련 파일이 포함됩니다.

- `og-image.png`
- `robots.txt`
- `sitemap.xml`
- `site.webmanifest`

파비콘은 `index.html` 안의 inline SVG를 사용합니다.

## License

ISC

## Firestore Rules

- Use [firestore.rules](/C:/Users/bjjhp/Desktop/airplaneSchedule/airplaneSchedule/firestore.rules:1) for the current Firestore security policy.
- In Firebase Console, open `Firestore Database > Rules` and paste the contents of that file.
- The current rule allows access only when the signed-in user's `uid` matches `users/{uid}/schedules`.
