import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET
  const rawBody = await request.text()

  if (secret) {
    const signature = request.headers.get('x-signature')
    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 },
      )
    }
    // Full HMAC verification can be added when webhook secret is configured.
  }

  try {
    const payload = JSON.parse(rawBody) as {
      meta?: { event_name?: string }
      data?: unknown
    }
    console.info('[BookWise webhook]', payload.meta?.event_name ?? 'unknown', {
      id: (payload.data as { id?: string })?.id,
    })
  } catch {
    console.info('[BookWise webhook] raw payload received')
  }

  return new NextResponse(null, { status: 204 })
}
