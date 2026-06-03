import { Suspense } from 'react'

import { CheckoutSuccessBanner } from '@/components/CheckoutSuccessBanner'
import { ProductFilters } from '@/components/ProductFilters'
import { ProductGrid } from '@/components/ProductGrid'
import { StoreHeader } from '@/components/StoreHeader'
import { getProducts } from '@/lib/products'
import type { BookwiseProduct } from '@/lib/types'

export const revalidate = 60

export default async function HomePage() {
  let products: BookwiseProduct[] = []
  let error: string | null = null

  try {
    products = await getProducts()
  } catch (e) {
    error =
      e instanceof Error
        ? e.message
        : '상품 목록을 불러오지 못했습니다.'
  }

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">전자책 스토어</h1>
          <p className="text-muted-foreground">
            Lemon Squeezy에 등록된 상품을 둘러보고 바로 구매하세요.
          </p>
        </div>

        <Suspense fallback={null}>
          <CheckoutSuccessBanner />
        </Suspense>

        <div className="mb-8">
          <Suspense fallback={null}>
            <ProductFilters />
          </Suspense>
        </div>

        {error ? (
          <div
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive"
            role="alert"
          >
            <p className="font-medium">상품을 불러올 수 없습니다</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-muted-foreground">
              API 키 오류라면{' '}
              <a
                href="https://app.lemonsqueezy.com/settings/api"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lemon Squeezy API 설정
              </a>
              에서 새 키를 발급해 `.env.local`을 수정한 뒤 `pnpm dev`를
              재시작하세요.
            </p>
          </div>
        ) : (
          <Suspense
            fallback={
              <p className="text-muted-foreground">상품 목록 로딩 중…</p>
            }
          >
            <ProductGrid products={products} />
          </Suspense>
        )}
      </main>
    </div>
  )
}
