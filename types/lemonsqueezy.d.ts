interface LemonSqueezyEvent {
  event: string
  data?: Record<string, unknown>
}

interface Window {
  createLemonSqueezy?: () => void
  LemonSqueezy?: {
    Setup: (options: {
      eventHandler: (event: LemonSqueezyEvent) => void
    }) => void
    Refresh: () => void
    Url: {
      Open: (url: string) => void
      Close: () => void
    }
  }
}
