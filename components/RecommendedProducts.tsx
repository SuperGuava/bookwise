import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { BookwiseProduct } from '@/lib/types'

type RecommendedProductsProps = {
  products: BookwiseProduct[]
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">추천 상품</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base">
                <Link
                  href={`/products/${product.slug}`}
                  className="hover:underline"
                >
                  {product.name}
                </Link>
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {product.description.replace(/<[^>]+>/g, '').slice(0, 80)}
                …
              </CardDescription>
              <Badge variant="outline" className="w-fit">
                {product.priceFormatted}
              </Badge>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
