'use client'

import Image from 'next/image'
import Link from 'next/link'

import { CheckoutButton } from '@/components/CheckoutButton'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { BookwiseProduct } from '@/lib/types'

function truncate(text: string, max = 120): string {
  const plain = text.replace(/<[^>]+>/g, '').trim()
  if (plain.length <= max) return plain
  return `${plain.slice(0, max)}…`
}

type ProductCardProps = {
  product: BookwiseProduct
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
      {product.thumbUrl ? (
        <div className="relative aspect-[4/3] w-full bg-muted">
          <Image
            src={product.thumbUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      ) : null}
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2">
            <Link
              href={`/products/${product.slug}`}
              className="hover:underline"
            >
              {product.name}
            </Link>
          </CardTitle>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge variant="secondary">{product.priceFormatted}</Badge>
            {product.status === 'draft' ? (
              <Badge variant="outline" className="text-xs">
                Draft
              </Badge>
            ) : null}
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {truncate(product.description)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter className="flex flex-col gap-2 sm:flex-row">
        <Link
          href={`/products/${product.slug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          상세 보기
        </Link>
        <CheckoutButton
          variantId={product.variantId}
          label="구매"
          className="w-full sm:ml-auto sm:w-auto"
        />
      </CardFooter>
    </Card>
  )
}
