import fs from 'fs'
import path from 'path'

let loaded = false

function normalizeEnvValue(value: string): string {
  let v = value.trim()
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim()
  }
  return v
}

function parseEnvFile(content: string): void {
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq <= 0) continue

    const key = trimmed.slice(0, eq).trim().replace(/^\uFEFF/, '')
    const value = normalizeEnvValue(trimmed.slice(eq + 1))

    if (key) {
      process.env[key] = value
    }
  }
}

function readEnvLocalFile(): string | null {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return null

  const raw = fs.readFileSync(envPath)

  if (raw.length >= 2 && raw[0] === 0xff && raw[1] === 0xfe) {
    return raw.toString('utf16le')
  }

  let text = raw.toString('utf8')
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1)
  }
  return text
}

/** Next.js가 로드한 값을 우선. 개발 모드에서는 .env.local을 매 요청마다 다시 읽음 */
export function ensureEnvLoaded(): void {
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    const manual = readEnvLocalFile()
    if (manual) {
      parseEnvFile(manual)
    }
    return
  }

  if (loaded) return
  loaded = true

  if (process.env.LEMON_SQUEEZY_API_KEY?.trim()) {
    return
  }

  const manual = readEnvLocalFile()
  if (manual) {
    parseEnvFile(manual)
  }
}

export function getEnv(name: string): string | undefined {
  ensureEnvLoaded()
  const value = process.env[name]
  return value ? normalizeEnvValue(value) : undefined
}
