// app/api/calming-session/route.ts
import { NextRequest, NextResponse } from "next/server"
// Import your database connection here
// import { connectDB } from "@/lib/db"
// import CalmingSession from "@/models/CalmingSession"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { 
      childID, 
      startTime, 
      endTime, 
      emotionBefore, 
      emotionAfter,
      gamesCompleted = []
    } = body

    if (!childID || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Calculate duration
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime()
    const durationMinutes = Math.round(duration / 60000)

    // TODO: Save to your database
    // await connectDB()
    // const session = await CalmingSession.create({
    //   childID,
    //   startTime,
    //   endTime,
    //   duration: durationMinutes,
    //   emotionBefore,
    //   emotionAfter,
    //   gamesCompleted,
    //   wasSuccessful: emotionAfter !== emotionBefore && !['angry', 'sad', 'anxious'].includes(emotionAfter)
    // })

    console.log("Calming session saved:", {
      childID,
      duration: durationMinutes,
      emotionBefore,
      emotionAfter
    })

    return NextResponse.json({
      success: true,
      data: {
        childID,
        duration: durationMinutes,
        emotionBefore,
        emotionAfter,
        improvement: emotionBefore !== emotionAfter
      }
    })
  } catch (error) {
    console.error("Error saving calming session:", error)
    return NextResponse.json(
      { error: "Failed to save calming session" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve calming session history
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const childID = searchParams.get("childID")
    const limit = parseInt(searchParams.get("limit") || "20")

    if (!childID) {
      return NextResponse.json(
        { error: "childID is required" },
        { status: 400 }
      )
    }

    // TODO: Fetch from your database
    // await connectDB()
    // const sessions = await CalmingSession.find({ childID })
    //   .sort({ startTime: -1 })
    //   .limit(limit)

    // Mock response for now
    const sessions: any[] = []

    return NextResponse.json({
      success: true,
      data: sessions
    })
  } catch (error) {
    console.error("Error fetching calming sessions:", error)
    return NextResponse.json(
      { error: "Failed to fetch calming sessions" },
      { status: 500 }
    )
  }
}