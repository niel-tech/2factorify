import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getNextAuthSessionCookie } from "../../../lib/cookie"
import { SWRProvider } from "../../swr-provider"
import Settings from "./settings"

export default async function SettingsPage() {
  const cookieStore = cookies()
  const session_token = getNextAuthSessionCookie(cookieStore)

  if (session_token)
    return (
      <SWRProvider>
        <h1 className="mb-6 block text-left text-2xl">My Settings</h1>
        <Settings session_token={session_token} />
      </SWRProvider>
    )

  redirect("/signin")
}
