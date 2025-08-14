import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const jetbrainsMonoMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "ByteChat",
  description: "A modern social media platform for developers",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jetbrainsMono.variable} ${jetbrainsMonoMono.variable} antialiased font-mono`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster richColors position="bottom-center" />
      </body>
    </html>
  )
}
