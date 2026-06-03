export type BookwiseProduct = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  priceFormatted: string
  currency: string
  variantId: number
  status: string
  thumbUrl: string | null
}

export type FaqItem = {
  question: string
  answer: string
}
