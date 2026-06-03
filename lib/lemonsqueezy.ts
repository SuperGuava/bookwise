import { lemonSqueezySetup } from '@lemonsqueezy/lemonsqueezy.js'

import { ensureEnvLoaded, getEnv } from '@/lib/env'

export function configureLemonSqueezy() {
  ensureEnvLoaded()

  const apiKey = getEnv('LEMON_SQUEEZY_API_KEY')

  if (!apiKey) {
    throw new Error(
      'LEMON_SQUEEZY_API_KEY is missing. Add it to .env.local in the project root, then restart `pnpm dev`.',
    )
  }

  lemonSqueezySetup({ apiKey })
}

export function getStoreId(): string {
  ensureEnvLoaded()

  const storeId = getEnv('LEMON_SQUEEZY_STORE_ID')

  if (!storeId) {
    throw new Error(
      'LEMON_SQUEEZY_STORE_ID is missing. Add it to .env.local in the project root, then restart `pnpm dev`.',
    )
  }

  return storeId
}
