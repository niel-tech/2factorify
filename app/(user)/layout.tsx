import { Metadata } from "next"
import { ReactNode } from "react"
import Section from "../components/section";

export const metadata: Metadata = {
  themeColor: "white",
  title: "Profile - 2Factorify",
  description: "Your private and secure 2factor token generator as alternative to googles authenticator",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <main>
      <Section>{children}</Section>
    </main>
  )
}
