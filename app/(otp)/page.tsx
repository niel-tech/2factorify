import Import from "./import"
import { ReadOtp, ReadUserOtp } from "./read"
import FilterOtps from "./filter"
import { getNextAuthSessionCookie } from "../../lib/cookie"
import { cookies } from "next/headers"
import { getOtpByUser } from "../../lib/fauna"

export default async function TwoFactorPage() {
  const cookieStore = cookies()
  const session_token = getNextAuthSessionCookie(cookieStore)

  if (!!session_token) {
    const saltedUserOtps = await getOtpByUser(session_token)

    return (
      <div className="my-1 grid">
        <ReadUserOtp saltedUserOtps={saltedUserOtps} />
      </div>
    )
  }

  return (
    <div className="my-1 grid">
      <Import />
      <FilterOtps />
      <ReadOtp />
    </div>
  )
}
