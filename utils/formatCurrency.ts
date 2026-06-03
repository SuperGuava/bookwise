const LOCALE_BY_CURRENCY: Record<string, string> = {
  KRW: 'ko-KR',
  USD: 'en-US',
  EUR: 'de-DE',
  GBP: 'en-GB',
  JPY: 'ja-JP',
}

export function localeForCurrency(currency: string): string {
  return LOCALE_BY_CURRENCY[currency.toUpperCase()] ?? 'en-US'
}

export function formatCurrency(
  amountInCents: number,
  currency: string,
): string {
  const code = currency.toUpperCase()
  const locale = localeForCurrency(code)

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
  }).format(amountInCents / 100)
}
