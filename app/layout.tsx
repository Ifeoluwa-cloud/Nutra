import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/lib/theme-provider'
import { Navbar } from '@/components/navbar'
import { ScrollRestoration } from '@/components/scroll-restoration'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Nutra | Guide your diet',
  description: 'Get instant nutrition guidance from our AI nutritionist. Fair access to healthcare for everyone, 24/7 support.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/nutra-logo.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/nutra-logo.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/nutra-logo.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/nutra-logo.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isProduction = process.env.NODE_ENV === 'production';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider>
          <ScrollRestoration />
          <Navbar />
          {children}
        </ThemeProvider>
        {isProduction && <Analytics />}
      </body>
    </html>
  )
}
