import {
  Geist,
  Geist_Mono,
  Outfit,
  Inter,
  IBM_Plex_Sans,
  Source_Sans_3,
  Oxanium,
  Nunito_Sans,
} from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { cn } from "cn"
import Script from "next/dist/client/script"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })

const outfit = Outfit({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        outfit.variable,
        geistHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          {children}
          <Toaster
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
