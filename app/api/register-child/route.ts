import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

// ✅ POST /api/register-child
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const response = await fetch(`${BACKEND_URL}/register-child`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Backend error" },
        { status: response.status }
      )
    }

    // ✅ Ensure uniform return shape
    return NextResponse.json(
      { success: true, childID: data.childID },
      { status: 200 }
    )
  } catch (error: any) {
    console.error("Register child failed:", error)
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    )
  }
}
