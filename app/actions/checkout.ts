'use server'

import { createCheckout } from '@lemonsqueezy/lemonsqueezy.js'

import { getAppOrigin } from '@/lib/appUrl'
import { configureLemonSqueezy, getStoreId } from '@/lib/lemonsqueezy'

export async function getCheckoutUrl(
  variantId: number,
  clientOrigin?: string,
): Promise<string> {
  configureLemonSqueezy()
  const storeId = getStoreId()
  const appUrl = getAppOrigin(clientOrigin)

  const { data, error } = await createCheckout(storeId, variantId, {
    checkoutOptions: {
      embed: true,
      media: true,
      logo: true,
    },
    productOptions: {
      enabledVariants: [variantId],
      redirectUrl: `${appUrl}/?checkout=success`,
    },
  })

  if (error) {
    throw new Error(error.message ?? 'Failed to create checkout')
  }

  const url = data?.data.attributes.url
  if (!url) {
    throw new Error('Checkout URL was not returned')
  }

  return url
}
