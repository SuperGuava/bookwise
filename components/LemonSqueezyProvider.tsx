'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export function LemonSqueezyProvider() {
  useEffect(() => {
    if (typeof window.createLemonSqueezy === 'function') {
      window.createLemonSqueezy()
    }

    if (window.LemonSqueezy) {
      window.LemonSqueezy.Setup({
        eventHandler: (data) => {
          if (data.event === 'Checkout.Success') {
            console.info('[BookWise] Checkout success', data.data)
          }
        },
      })
    }
  }, [])

  return (
    <Script
      src="https://app.lemonsqueezy.com/js/lemon.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (typeof window.createLemonSqueezy === 'function') {
          window.createLemonSqueezy()
        }
      }}
    />
  )
}
