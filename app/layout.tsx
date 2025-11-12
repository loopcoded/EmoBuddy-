import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'EMOBUDDY - Empowering Social Skills for Children with Autism',
  description: 'Created BY SEJAL SINHA, KUMUD BAJAJ AND YUKTHA S R- EMOBUDDY is an interactive platform designed to help children with autism develop essential social skills through engaging games and activities.',
  icons: {
    icon: [
      {
        url: '/logo.jpg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/logo.jpg',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
