import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { LemonSqueezyProvider } from '@/components/LemonSqueezyProvider'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'BookWise — 전자책 스토어',
  description: 'Lemon Squeezy 연동 전자책 판매 스토어',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        {children}
        <LemonSqueezyProvider />
      </body>
    </html>
  )
}
