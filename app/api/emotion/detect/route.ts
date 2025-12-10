import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api";

export const POST = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    const forwardRes = await fetch(`${BACKEND_URL}/emotion/detect`, {
      method: "POST",
      body: formData,
    });

    const json = await forwardRes.json();
    return NextResponse.json(json, { status: forwardRes.status });
    } catch (err) {
    console.error("Next API /emotion/detect error:", err);
    return NextResponse.json(
      { error: "Failed to forward emotion detection" },
      { status: 500 }
    );
  }
}

