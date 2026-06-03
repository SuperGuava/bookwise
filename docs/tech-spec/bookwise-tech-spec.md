# BookWise - Technical Specification

## Source Tree Structure

```
app/
  ├─ page.tsx                           # 메인 상품 카드 + 검색
  ├─ products/[slug]/page.tsx           # 상세 + FAQ + 추천 + 결제
  ├─ actions/checkout.ts                # createCheckout Server Action
  ├─ api/webhooks/lemonsqueezy/route.ts # 결제 webhook (로그만)
  └─ layout.tsx                         # Lemon.js Script Provider
components/
  ├─ ProductCard.tsx
  ├─ ProductFilters.tsx
  ├─ ProductGrid.tsx
  ├─ CheckoutButton.tsx
  ├─ ProductFAQ.tsx
  ├─ RecommendedProducts.tsx
  ├─ LemonSqueezyProvider.tsx
  └─ ui/ (button, card, input, badge)
lib/
  ├─ lemonsqueezy.ts                    # SDK setup (LEMON_SQUEEZY_*)
  ├─ products.ts                        # listProducts 매핑
  ├─ faq.ts
  └─ types.ts
utils/
  └─ formatCurrency.ts
types/
  └─ lemonsqueezy.d.ts
```

---

## Technical Approach

- Next.js 16 App Router Server Component에서 `@lemonsqueezy/lemonsqueezy.js`로 상품 목록을 가져오고 `revalidate: 60`으로 ISR한다.
- 검색/필터는 클라이언트에서 `?q=` query param과 동기화한다.
- 결제는 Server Action `createCheckout`으로 URL을 생성한 뒤 Lemon.js `LemonSqueezy.Url.Open(url)` 오버레이를 연다.
- Webhook은 `app/api/webhooks/lemonsqueezy/route.ts`에서 수신 후 로그만 남기고 204를 반환한다.

---

## Implementation Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui 스타일 컴포넌트
- `@lemonsqueezy/lemonsqueezy.js` (서버 API)
- Lemon.js CDN (`https://app.lemonsqueezy.com/js/lemon.js`)
- pnpm

---

## Technical Details

- `lib/products.ts`: `listProducts({ filter: { storeId }, include: ['variants'] })` → `BookwiseProduct`
- 메인: `getProducts()` + `ProductGrid` 클라이언트 필터
- 상세: `/products/[slug]`, 설명 + `getFaqForProduct` + `getRecommendedProducts`
- 결제: `getCheckoutUrl(variantId)` → embed checkout

---

## Development Setup

- `pnpm install`
- `.env.local`: `LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_STORE_ID` (필수)
- `pnpm dev` → http://localhost:3000
- `pnpm lint`

---

## Deployment Strategy

- Vercel 배포
- Env: `LEMON_SQUEEZY_API_KEY`, `LEMON_SQUEEZY_STORE_ID`, (선택) `LEMON_SQUEEZY_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`
- ISR 60초
