import Link from 'next/link'

import { StoreHeader } from '@/components/StoreHeader'

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">상품을 찾을 수 없습니다</h1>
        <p className="mt-2 text-muted-foreground">
          요청하신 상품이 없거나 판매가 중단되었을 수 있습니다.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-sm font-medium text-primary hover:underline"
        >
          상품 목록으로 돌아가기
        </Link>
      </main>
    </div>
  )
}
