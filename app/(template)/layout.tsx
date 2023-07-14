import { ReactNode } from "react"
import { Metadata } from "next"
import Section from "./section"

export const metadata: Metadata = {
  themeColor: "white",
  title: "NextJS Template",
  description: "",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function BinLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Section>{children}</Section>
    </main>
  )
}
