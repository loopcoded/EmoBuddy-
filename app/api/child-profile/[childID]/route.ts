import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

// ✅ GET /api/child-profile/[childID]
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ childID: string }> }
) {
  // 🔧 Unwrap the params Promise before using
  const { childID } = await context.params

  try {
    const res = await fetch(`${BACKEND_URL}/child-profile/${childID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Profile fetch failed" },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching child profile:", error)
    return NextResponse.json(
      { success: false, message: "Unable to fetch child profile" },
      { status: 500 }
    )
  }
}
