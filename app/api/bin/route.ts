import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id") as string

  try {
    return NextResponse.json("template")
  } catch (e: any) {
    return NextResponse.json({ errors: [e] }, { status: 500 })
  }
}
