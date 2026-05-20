import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ProfileProvider } from "@/hooks/use-profile"
import { cn } from "@/lib/utils";

import { Toaster } from "sonner"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

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
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider>
            <ProfileProvider>
              {children}
              <Toaster position="top-right" expand={false} richColors />
            </ProfileProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
