# Base Camp

Base 생태계를 위한 온체인 커뮤니티 허브입니다. 사용자는 EOA 지갑으로 로그인해 Base 기반 게임, dApp, 포럼, 백서 등을 탐색하고 소통할 수 있습니다.

## 🚀 시작하기

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

1. 의존성 설치
```bash
npm install
# 또는
yarn install
```

2. 개발 서버 실행
```bash
npm run dev
# 또는
yarn dev
```

3. 브라우저에서 열기
```
http://localhost:3000
```

## 📁 프로젝트 구조

```
base_hackerthon/
├── app/
│   ├── globals.css      # 전역 스타일
│   ├── layout.tsx       # 루트 레이아웃
│   └── page.tsx         # 메인 페이지
├── components/
│   └── ui/              # UI 컴포넌트
│       ├── card.tsx
│       ├── button.tsx
│       ├── input.tsx
│       ├── badge.tsx
│       └── separator.tsx
├── lib/
│   └── utils.ts         # 유틸리티 함수
└── package.json
```

## 🛠 기술 스택

- **Next.js 14** - React 프레임워크
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링
- **Framer Motion** - 애니메이션
- **shadcn/ui** - UI 컴포넌트
- **Recharts** - 차트 라이브러리
- **Lucide React** - 아이콘

## 📝 주요 기능

- ✅ 커뮤니티 홈 대시보드
- ✅ 공지사항 목록
- ✅ 최신 게시물 목록
- ✅ Base 시세 차트 (데모)
- ✅ 주요 링크 모음
- ✅ 반응형 디자인

## 🎯 다음 단계

- [ ] 지갑 연결 기능 (Web3)
- [ ] 온체인 게시글 작성/조회
- [ ] 경험치 및 Developer Level 시스템
- [ ] NFT 보상 시스템
- [ ] $BATO 토큰 통합
- [ ] 후원 및 프리미엄 열람 기능

## 📄 라이선스

MIT


