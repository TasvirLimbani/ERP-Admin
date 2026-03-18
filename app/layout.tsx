import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import PWAInitializer from '@/components/pwa-initializer'

const _geist = Geist({ subsets: ["latin"], variable: '--font-geist-sans' });
const _geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'Yarn Factory - Inventory Management',
  description: 'Complete inventory management system for yarn factories',
  generator: 'v0.app',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f1117',
  userScalable: false,
  initialScale: 1,
  maximumScale: 1,
  width: 'device-width',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${_geist.variable} ${_geistMono.variable} font-sans antialiased`}>
        {children}
        <PWAInitializer />
        <Analytics />
      </body>
    </html>
  )
}
