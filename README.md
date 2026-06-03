# BookWise

전자책 중심의 디지털 상품 판매 플랫폼. 외부 관리자 페이지에서 등록된 콘텐츠를 실시간으로 노출하고 글로벌 구매자에게 제공하는 SaaS 기반 솔루션입니다.

## 프로젝트 개요

BookWise는 운영자가 외부 관리자 페이지에서 등록한 전자책을 카드 형태로 노출하고, 구매자가 상세 페이지에서 결제까지 진행할 수 있는 간단한 판매 플랫폼입니다.

### 주요 기능

- 📚 Lemon Squeezy API에서 상품 목록을 가져와 카드 형태로 표시
- 🔍 제목·설명 검색 필터 (`?q=`)
- 📄 상세 페이지 (설명, FAQ, 추천 상품) 및 결제 버튼
- 💳 Lemon.js 오버레이 + `createCheckout` 결제

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Package Manager**: pnpm
- **Payment**: Lemonsqueezy JS SDK
- **Code Quality**: ESLint, Prettier

## 시작하기

### 필수 요구사항

- Node.js 18 이상
- pnpm 설치

### 설치

```bash
# 의존성 설치
pnpm install

# 환경 변수 (.env.example 참고)
# LEMON_SQUEEZY_API_KEY=
# LEMON_SQUEEZY_STORE_ID=
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
bookwise/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 메인 상품 목록
│   ├── products/[slug]/   # 상세 페이지
│   └── api/webhooks/      # Lemon Squeezy webhook
├── components/             # ProductCard, CheckoutButton 등
├── lib/
│   ├── products.ts        # Lemon Squeezy 상품 fetch
│   └── lemonsqueezy.ts
├── utils/                  # 유틸리티 함수
│   └── formatCurrency.ts
├── docs/                   # 문서
│   ├── prd/               # Product Requirements Document
│   └── tech-spec/         # Technical Specification
└── public/                 # 정적 파일
```

## 스크립트

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 코드 린팅
pnpm lint

# 코드 포맷팅
pnpm format

# 포맷팅 검사
pnpm format:check
```

## 개발 가이드

### 컴포넌트 추가

shadcn/ui 컴포넌트를 추가하려면:

```bash
npx shadcn@latest add [component-name]
```

예시:

```bash
npx shadcn@latest add button card
```

### 코드 스타일

- Prettier를 사용하여 코드 포맷팅
- ESLint를 사용하여 코드 품질 검사
- 커밋 전에 `pnpm format` 실행 권장

## 배포

Vercel을 사용한 배포를 권장합니다:

1. GitHub 저장소에 코드 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경 변수 설정
4. 자동 배포 완료

자세한 내용은 [Next.js 배포 문서](https://nextjs.org/docs/app/building-your-application/deploying)를 참고하세요.

## 문서

- [PRD](./docs/prd/bookwise-prd.md) - Product Requirements Document
- [Tech Spec](./docs/tech-spec/bookwise-tech-spec.md) - Technical Specification

## 라이선스

이 프로젝트는 비공개 프로젝트입니다.
