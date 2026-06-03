import type { FaqItem } from '@/lib/types'

type ProductFAQProps = {
  items: FaqItem[]
}

export function ProductFAQ({ items }: ProductFAQProps) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group rounded-lg border bg-card px-4 py-3"
        >
          <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-2">
              {item.question}
              <span className="text-muted-foreground transition group-open:rotate-180">
                ▾
              </span>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
