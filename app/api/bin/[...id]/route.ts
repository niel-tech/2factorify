import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const searchParam = searchParams.get("anything") || undefined
  const id = params.id

  try {
    return NextResponse.json("template")
  } catch (e: any) {
    return NextResponse.json({ errors: [e] }, { status: 500 })
  }
}
