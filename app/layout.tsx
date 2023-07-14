import { ReactNode } from "react"
import type { Metadata } from "next"
import { quicksand } from "@/fonts"

// These styles apply to every route in the application
import "styles/tailwind.css"
import Nav from "./nav"
import Footer from "./footer"

export const metadata: Metadata = {
  themeColor: "white",
  title: "NextJS Template",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className={quicksand.className} lang="en">
      <body className="grid h-screen grid-rows-[auto_1fr_auto] bg-[#E6E4DA] dark:bg-white">
        <h1>NextJS 13 Template</h1>
      </body>
    </html>
  )
}
