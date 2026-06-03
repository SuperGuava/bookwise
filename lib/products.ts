import { cache } from 'react'
import {
  getAuthenticatedUser,
  getProduct,
  getStore,
  listProducts,
  listStores,
  listVariants,
} from '@lemonsqueezy/lemonsqueezy.js'

import { configureLemonSqueezy, getStoreId } from '@/lib/lemonsqueezy'
import type { BookwiseProduct } from '@/lib/types'
import { formatCurrency } from '@/utils/formatCurrency'

/** listProducts / listVariants 응답의 JSON:API 리소스 항목 */
type ListProductsPayload = NonNullable<
  Awaited<ReturnType<typeof listProducts>>['data']
>
type ListVariantsPayload = NonNullable<
  Awaited<ReturnType<typeof listVariants>>['data']
>

type ProductResource = NonNullable<ListProductsPayload['data']>[number]
type VariantResource = NonNullable<ListVariantsPayload['data']>[number]

const SELLABLE_PRODUCT_STATUSES = new Set(['published', 'draft'])

function pickSellableVariant(
  variants: VariantResource[],
): VariantResource | undefined {
  if (!variants.length) return undefined

  const priority = ['published', 'pending', 'draft'] as const
  for (const status of priority) {
    const match = variants.find((v) => v.attributes.status === status)
    if (match) return match
  }

  return variants[0]
}

function resolvePriceFormatted(
  product: ProductResource,
  variant: VariantResource,
  storeCurrency: string,
): string {
  const variantCount = product.relationships?.variants?.data?.length ?? 0
  const singleVariant = variantCount <= 1

  if (singleVariant && product.attributes.price_formatted) {
    return product.attributes.price_formatted
  }

  return formatCurrency(variant.attributes.price, storeCurrency)
}

function mapProduct(
  product: ProductResource,
  variants: VariantResource[],
  storeCurrency: string,
): BookwiseProduct | null {
  if (!SELLABLE_PRODUCT_STATUSES.has(product.attributes.status)) {
    return null
  }

  const variant = pickSellableVariant(variants)
  if (!variant) {
    return null
  }

  const price = variant.attributes.price

  return {
    id: product.id,
    slug: product.attributes.slug,
    name: product.attributes.name,
    description: product.attributes.description ?? '',
    price,
    priceFormatted: resolvePriceFormatted(product, variant, storeCurrency),
    currency: storeCurrency,
    variantId: Number(variant.id),
    status: product.attributes.status,
    thumbUrl:
      product.attributes.large_thumb_url ??
      product.attributes.thumb_url ??
      null,
  }
}

function variantsFromIncluded(
  product: ProductResource,
  included: VariantResource[] | undefined,
): VariantResource[] {
  if (!included?.length) return []

  const variantIds = new Set(
    product.relationships?.variants?.data?.map((v) => v.id) ?? [],
  )

  const matched = included.filter(
    (v) => v.type === 'variants' && variantIds.has(v.id),
  )

  return matched.length > 0 ? matched : []
}

async function loadVariantsForProduct(
  product: ProductResource,
  listIncluded: VariantResource[] | undefined,
): Promise<VariantResource[]> {
  const fromList = variantsFromIncluded(product, listIncluded)
  if (fromList.length > 0) return fromList

  const { data: detail, error } = await getProduct(product.id, {
    include: ['variants'],
  })

  if (!error && detail?.data) {
    const fromDetail = variantsFromIncluded(
      detail.data,
      (detail.included ?? []) as VariantResource[],
    )
    if (fromDetail.length > 0) return fromDetail
  }

  const { data: variantList, error: variantError } = await listVariants({
    filter: { productId: product.id },
  })

  if (!variantError && variantList?.data?.length) {
    return variantList.data
  }

  return []
}

async function assertApiAccess(): Promise<void> {
  configureLemonSqueezy()

  const { error: userError } = await getAuthenticatedUser()
  if (userError) {
    const msg = userError.message ?? 'Unauthorized'
    if (/unauthorized/i.test(msg)) {
      throw new Error(
        'Lemon Squeezy API 키가 유효하지 않습니다. app.lemonsqueezy.com/settings/api 에서 새 API 키를 발급한 뒤 .env.local의 LEMON_SQUEEZY_API_KEY를 교체하고 dev 서버를 재시작하세요.',
      )
    }
    throw new Error(msg)
  }

  const storeId = getStoreId()
  const { data: storesData, error: storesError } = await listStores()

  if (storesError) {
    throw new Error(storesError.message ?? 'Failed to list stores')
  }

  const storeIds = storesData?.data?.map((s) => s.id) ?? []

  if (storeIds.length > 0 && !storeIds.includes(storeId)) {
    throw new Error(
      `LEMON_SQUEEZY_STORE_ID(${storeId})가 계정의 스토어 목록과 일치하지 않습니다. 사용 가능한 Store ID: ${storeIds.join(', ')}`,
    )
  }
}

const getStoreCurrency = cache(async (): Promise<string> => {
  configureLemonSqueezy()
  const storeId = getStoreId()
  const { data, error } = await getStore(storeId)

  if (error || !data?.data?.attributes.currency) {
    return 'USD'
  }

  return data.data.attributes.currency
})

async function fetchAllProducts(): Promise<BookwiseProduct[]> {
  await assertApiAccess()
  const storeId = getStoreId()
  const storeCurrency = await getStoreCurrency()

  const { data, error } = await listProducts({
    filter: { storeId },
    include: ['variants'],
  })

  if (error) {
    const msg = error.message ?? 'Failed to fetch products'
    if (/unauthorized/i.test(msg)) {
      throw new Error(
        'Lemon Squeezy API 키가 유효하지 않습니다. settings/api에서 새 키를 발급해 .env.local을 갱신하세요.',
      )
    }
    throw new Error(msg)
  }

  if (!data?.data) {
    return []
  }

  const included = (data.included ?? []) as VariantResource[]
  const products: BookwiseProduct[] = []

  for (const product of data.data) {
    const variants = await loadVariantsForProduct(product, included)
    const mapped = mapProduct(product, variants, storeCurrency)
    if (mapped) products.push(mapped)
  }

  return products.sort((a, b) => a.name.localeCompare(b.name, 'ko'))
}

export const getProducts = cache(async (): Promise<BookwiseProduct[]> => {
  return fetchAllProducts()
})

export const getProductBySlug = cache(
  async (slug: string): Promise<BookwiseProduct | null> => {
    const products = await getProducts()
    return products.find((p) => p.slug === slug) ?? null
  },
)

export const getRecommendedProducts = cache(
  async (currentId: string, limit = 3): Promise<BookwiseProduct[]> => {
    const products = await getProducts()
    return products.filter((p) => p.id !== currentId).slice(0, limit)
  },
)
