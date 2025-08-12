import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "RafflePro - Win Amazing Prizes with Every Ticket",
  description:
    "Join thousands of winners in exciting raffles. From luxury cars to dream vacations, your next big win is just one ticket away!",
  keywords: "raffle, lottery, prizes, win, tickets, luxury, cars, vacations",
  authors: [{ name: "RafflePro Team" }],
  creator: "RafflePro",
  publisher: "RafflePro",
  robots: "index, follow",
  openGraph: {
    title: "RafflePro - Win Amazing Prizes",
    description: "Your next big win is just one ticket away!",
    type: "website",
    locale: "en_US",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
