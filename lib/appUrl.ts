/** 결제 완료 redirect 등에 쓸 앱 베이스 URL */
export function getAppOrigin(clientOrigin?: string): string {
  const fromClient = clientOrigin?.trim().replace(/\/$/, '')
  if (fromClient) {
    return fromClient
  }

  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/$/, '')
  if (fromEnv) {
    return fromEnv
  }

  const port = process.env.PORT ?? '3000'
  return `http://localhost:${port}`
}
