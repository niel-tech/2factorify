import { ReadOtp } from "./read"
import { getNextAuthSessionCookie } from "../../lib/cookie"
import { cookies } from "next/headers"
import { SWRProvider } from "../swr-provider"

export default async function TwoFactorPage() {
  const cookieStore = cookies()
  const session_token = getNextAuthSessionCookie(cookieStore)

  return (
    <section className="my-1 grid">
      <SWRProvider>
        <ReadOtp session_token={session_token} />
      </SWRProvider>
    </section>
  )
}
