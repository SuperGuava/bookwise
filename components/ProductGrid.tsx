'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { ProductCard } from '@/components/ProductCard'
import type { BookwiseProduct } from '@/lib/types'

type ProductGridProps = {
  products: BookwiseProduct[]
}

function matchesQuery(product: BookwiseProduct, q: string): boolean {
  const needle = q.toLowerCase().trim()
  if (!needle) return true

  const title = product.name.toLowerCase()
  const description = product.description
    .replace(/<[^>]+>/g, '')
    .toLowerCase()

  return title.includes(needle) || description.includes(needle)
}

export function ProductGrid({ products }: ProductGridProps) {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const filtered = useMemo(
    () => products.filter((p) => matchesQuery(p, q)),
    [products, q],
  )

  if (filtered.length === 0) {
    return (
      <p className="rounded-lg border border-dashed p-8 text-center text-muted-foreground">
        {q
          ? `「${q}」에 맞는 상품이 없습니다.`
          : '표시할 상품이 없습니다. Lemon Squeezy 대시보드에서 상품·가격(Variant)을 만들고 Publish(또는 Draft) 상태인지 확인해 주세요.'}
      </p>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
