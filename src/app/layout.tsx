import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fitted — Your Personal Style Guide",
  description:
    "A personalized men's style platform that delivers an expert-curated wardrobe guide — so you can look consistently well-dressed without becoming fashion obsessed.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://fitted.style"
  ),
  openGraph: {
    title: "Fitted — Your Personal Style Guide",
    description:
      "Expert-curated, personalized wardrobe recommendations for men who want to dress better without the effort.",
    siteName: "Fitted",
    type: "website",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}