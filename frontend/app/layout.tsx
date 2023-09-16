import './globals.css'
import 'swiper/css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Providors from '@/context/Providors'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PoolPal',
  description: 'PoolPal is a pool management app for finding a travel buddy to share the cost of a ride to the pool.',
  manifest: '/manifest.json',
  themeColor: '#fff',
  icons: {
    apple: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="./icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <Providors>
          {children}
        </Providors>
      </body>
    </html>
  )
}
