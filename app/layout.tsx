import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from 'next/font/google'
import "./globals.css"
import { Providers } from "@/components/providers"

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-serif'
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans'
})

export const metadata: Metadata = {
  title: "PureMind - Editorial Learning Platform",
  description: "Minimalist learning platform with curated content and focused design",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL('https://api.xoperr.dev'),
  keywords: ['learning platform', 'education', 'online learning', 'Ukrainian education'],
  authors: [{ name: 'PureMind Team' }],
  openGraph: {
    title: 'PureMind - Editorial Learning Platform',
    description: 'Minimalist learning platform with curated content and focused design',
    url: 'https://api.xoperr.dev',
    siteName: 'PureMind',
    locale: 'uk_UA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PureMind - Editorial Learning Platform',
    description: 'Minimalist learning platform with curated content and focused design',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="74ebfa80-79a2-42c6-99b9-00b4c7457bf6"></script>
      </head>
      <body className="bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
