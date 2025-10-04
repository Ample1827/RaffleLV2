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
  title: "Rifas Romero - Gana Premios Increíbles con Cada Boleto",
  description:
    "Participa en rifas emocionantes y gana desde autos de lujo hasta vacaciones soñadas. ¡Tu próximo gran premio está a solo un boleto!",
  keywords: "rifas, boletos, premios, ganar, sorteos, autos, vacaciones, lotería",
  authors: [{ name: "Adalberto Romero" }],
  creator: "Adalberto Romero",
  publisher: "Rifas Romero",
  robots: "index, follow",
  openGraph: {
    title: "Rifas Romero - Gana Premios Increíbles",
    description: "Tu próximo gran premio está a solo un boleto.",
    type: "website",
    locale: "es_MX",
  },
  generator: "ample1827",
  icons: {
    icon: "/icon.svg",
  },
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
