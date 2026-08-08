import type { Metadata } from "next"
import { Providers } from "@/components/Providers"
import "./globals.css"

export const metadata: Metadata = {
  title: "Fitted — Your Personal Style Guide",
  description:
    "A personalized men's style platform that delivers an expert-curated wardrobe guide — so you can look consistently well-dressed without becoming fashion obsessed.",
  keywords: [
    "men's style",
    "personal styling",
    "wardrobe guide",
    "fashion consultation",
    "style assessment",
  ],
  openGraph: {
    title: "Fitted — Your Personal Style Guide",
    description:
      "Get a personalized, expert-curated wardrobe guide tailored to your body, lifestyle, and budget.",
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
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}