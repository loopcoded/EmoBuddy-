import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

// ✅ POST /api/save-session
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Forward the request body to backend
    const res = await fetch(`${BACKEND_URL}/save-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Session save failed" },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error saving session:", error)
    return NextResponse.json(
      { success: false, message: "Failed to save session" },
      { status: 500 }
    )
  }
}

