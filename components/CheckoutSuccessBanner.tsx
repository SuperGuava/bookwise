'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function CheckoutSuccessBanner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(searchParams.get('checkout') === 'success')
  }, [searchParams])

  if (!visible) return null

  function dismiss() {
    setVisible(false)
    router.replace('/', { scroll: false })
  }

  return (
    <div
      className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 dark:border-green-900 dark:bg-green-950/40 dark:text-green-100"
      role="status"
    >
      <p className="font-medium">결제가 완료되었습니다.</p>
      <p className="mt-1">
        등록하신 이메일로 다운로드 안내가 발송됩니다. 메일함과 스팸함을
        확인해 주세요.
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-2 text-xs font-medium underline"
      >
        닫기
      </button>
    </div>
  )
}
