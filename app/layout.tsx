import { ReactNode } from "react"
import type { Metadata } from "next"
import { quicksand } from "@/fonts"

// These styles apply to every route in the application
import "styles/tailwind.css"
import Nav from "./nav"
import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"
import Footer from "./footer"

export const metadata: Metadata = {
  themeColor: "white",
  title: "2FA Tokens - 2Factorify",
  description: "Your private and secure 2factor token generator as alternative to googles authenticator",
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  return (
    <html className={quicksand.className} lang="en">
      <body className="grid h-screen grid-rows-[auto_1fr_auto] bg-[#E6E4DA] dark:bg-white">
        <Nav session={session} />
        {children}
        <Footer />
      </body>
    </html>
  )
}
