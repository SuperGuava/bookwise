import Link from 'next/link'

export function StoreHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          BookWise
        </Link>
        <span className="text-sm text-muted-foreground">전자책 스토어</span>
      </div>
    </header>
  )
}
