'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState, useTransition } from 'react'

import { Input } from '@/components/ui/input'

type ProductFiltersProps = {
  initialQuery?: string
}

export function ProductFilters({ initialQuery = '' }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(initialQuery)
  const [, startTransition] = useTransition()

  useEffect(() => {
    setQuery(searchParams.get('q') ?? '')
  }, [searchParams])

  const applyQuery = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      const trimmed = value.trim()

      if (trimmed) {
        params.set('q', trimmed)
      } else {
        params.delete('q')
      }

      startTransition(() => {
        const qs = params.toString()
        router.replace(qs ? `/?${qs}` : '/', { scroll: false })
      })
    },
    [router, searchParams],
  )

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="제목 또는 설명으로 검색…"
        value={query}
        onChange={(e) => {
          const next = e.target.value
          setQuery(next)
          applyQuery(next)
        }}
        className="pl-9"
        aria-label="상품 검색"
      />
    </div>
  )
}
