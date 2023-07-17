import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { getNextAuthSessionCookie } from "../../../../lib/cookie"
import { createBatchedOtp, validateSession } from "../../../../lib/fauna"

export async function POST(request: Request, res: any) {
  const req = await request.json()
  const {
    bulkOtpUrls,
  }: {
    bulkOtpUrls: { saltedUrl: string }[]
  } = req as any

  const cookieStore = cookies()
  const session_token = getNextAuthSessionCookie(cookieStore)

  if (session_token) {
    const res = await validateSession(session_token ?? "")

    if (!res?.userId) return NextResponse.json({ errors: ["unauthorized"] }, { status: 401 })

    try {
      const otps = await createBatchedOtp(session_token!, bulkOtpUrls)

      return NextResponse.json(otps)
    } catch (e: any) {
      return NextResponse.json({ errors: [e] }, { status: 500 })
    }
  }

  return NextResponse.json({ errors: ["invalid session"] }, { status: 400 })
}
