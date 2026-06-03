'use client'

import { useEffect, useState } from 'react'

import { getCheckoutUrl } from '@/app/actions/checkout'
import { Button } from '@/components/ui/button'

type CheckoutButtonProps = {
  variantId: number
  label?: string
  className?: string
}

export function CheckoutButton({
  variantId,
  label = '구매하기',
  className,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window.createLemonSqueezy === 'function') {
      window.createLemonSqueezy()
    }
  }, [])

  async function handleCheckout() {
    setError(null)
    setLoading(true)

    try {
      const url = await getCheckoutUrl(variantId, window.location.origin)

      if (window.LemonSqueezy?.Url?.Open) {
        window.LemonSqueezy.Url.Open(url)
      } else {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : '결제창을 열 수 없습니다.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        type="button"
        size="lg"
        disabled={loading}
        onClick={handleCheckout}
        className="w-full sm:w-auto"
      >
        {loading ? '결제 준비 중…' : label}
      </Button>
      {error ? (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      <p className="mt-2 text-xs text-muted-foreground">
        결제 완료 후 이메일로 다운로드 안내가 발송됩니다.
      </p>
    </div>
  )
}
