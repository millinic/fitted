import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fitted — Your Personal Style, Expertly Curated",
  description:
    "A personalized men's style platform that delivers an expert-curated wardrobe guide. Look consistently well-dressed without becoming fashion obsessed.",
  keywords: [
    "men's style",
    "personal styling",
    "wardrobe guide",
    "fashion consultation",
    "style assessment",
  ],
  openGraph: {
    title: "Fitted — Your Personal Style, Expertly Curated",
    description:
      "A personalized men's style platform that delivers an expert-curated wardrobe guide.",
    type: "website",
    siteName: "Fitted",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}