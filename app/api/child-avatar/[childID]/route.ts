import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

// ✅ GET avatar config for a specific child
export async function GET(req: NextRequest, context: { params: Promise<{ childID: string }> }) {
  const { childID } = await context.params // <-- ✅ Awaited properly

  try {
    const res = await fetch(`${BACKEND_URL}/child-avatar/${childID}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to fetch avatar" },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error fetching avatar:", error)
    return NextResponse.json(
      { success: false, message: "Error fetching avatar config" },
      { status: 500 }
    )
  }
}

// ✅ POST to update avatar config
export async function POST(req: NextRequest, context: { params: Promise<{ childID: string }> }) {
  const { childID } = await context.params // <-- ✅ Awaited properly
  const avatarConfig = await req.json()

  try {
    const res = await fetch(`${BACKEND_URL}/child-avatar/${childID}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(avatarConfig),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to update avatar" },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error updating avatar:", error)
    return NextResponse.json(
      { success: false, message: "Error updating avatar config" },
      { status: 500 }
    )
  }
}
