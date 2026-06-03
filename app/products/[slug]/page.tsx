import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CheckoutButton } from '@/components/CheckoutButton'
import { ProductFAQ } from '@/components/ProductFAQ'
import { RecommendedProducts } from '@/components/RecommendedProducts'
import { StoreHeader } from '@/components/StoreHeader'
import { Badge } from '@/components/ui/badge'
import { getFaqForProduct } from '@/lib/faq'
import {
  getProductBySlug,
  getRecommendedProducts,
} from '@/lib/products'

export const revalidate = 60

type PageProps = {
  params: Promise<{ slug: string }>
}

function ProductDescription({ html }: { html: string }) {
  const hasHtml = /<[a-z][\s\S]*>/i.test(html)

  if (hasHtml) {
    return (
      <div
        className="prose prose-neutral max-w-none text-sm leading-relaxed dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
      {html || '상품 설명이 없습니다.'}
    </p>
  )
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const [recommended, faq] = await Promise.all([
    getRecommendedProducts(product.id),
    Promise.resolve(getFaqForProduct(slug)),
  ])

  return (
    <div className="min-h-screen bg-background">
      <StoreHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← 상품 목록
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            {product.thumbUrl ? (
              <Image
                src={product.thumbUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.priceFormatted}</Badge>
              <h1 className="text-3xl font-bold tracking-tight">
                {product.name}
              </h1>
            </div>

            <CheckoutButton variantId={product.variantId} />

            <section>
              <h2 className="mb-3 text-lg font-semibold">상품 설명</h2>
              <ProductDescription html={product.description} />
            </section>
          </div>
        </div>

        <section className="mt-12">
          <h2 className="mb-4 text-lg font-semibold">자주 묻는 질문</h2>
          <ProductFAQ items={faq} />
        </section>

        <div className="mt-12">
          <RecommendedProducts products={recommended} />
        </div>
      </main>
    </div>
  )
}
