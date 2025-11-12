import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

// ✅ DELETE /api/delete-child/[childID]
export async function DELETE(req: NextRequest, context: any) {
  // `context.params` can be either an object or a Promise depending on Next/runtime versions.
  const paramsObj = context?.params
    ? typeof context.params?.then === "function"
      ? await context.params
      : context.params
    : {}
  const { childID } = paramsObj as { childID?: string }

  try {
    const res = await fetch(`${BACKEND_URL}/delete-child/${childID}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Failed to delete child profile" },
        { status: res.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("Error deleting child:", error)
    return NextResponse.json(
      { success: false, message: "Failed to delete child profile" },
      { status: 500 }
    )
  }
}
