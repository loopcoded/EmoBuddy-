"use client"

import { useState, useEffect, useRef } from "react"
import CalmingGame from "./calming-game"
import Level1Journey from "./learning-journey/level1-journey"
import Level2Journey from "./learning-journey/level2-journey"
import Level3Journey from "./learning-journey/level3-journey"

interface ChildProfile {
  _id: string
  name: string
  autismSupportLevel: number
  currentLevel: number
  avatarConfig?: Record<string, unknown>
}

interface LearningPageProps {
  childID: string
  profile: ChildProfile
}

type EmotionState = "green" | "yellow" | "orange" | "red"

export default function LearningPage({ childID, profile }: LearningPageProps) {
  const [currentState, setCurrentState] = useState<EmotionState>("green")
  const [showCalmingMode, setShowCalmingMode] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) videoRef.current.srcObject = stream
        setCameraActive(true)
      } catch (error) {
        console.warn("Camera access denied — continuing without video.")
        setCameraActive(false)
      }
    }

    enableCamera()

    // ✅ Emotion polling every 10s
    const emotionPolling = setInterval(async () => {
      try {
        await fetch("/api/save-emotion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            childID,
            emotion: "neutral",
            confidence: 0.8,
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (err) {
        console.error("Failed to save emotion:", err)
      }
    }, 1000000)

    return () => {
      clearInterval(emotionPolling)
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => track.stop())
      }
    }
  }, [childID])

  if (showCalmingMode) {
    return (
      <CalmingGame
        onComplete={() => setShowCalmingMode(false)}
        childID={childID}
        levelCompleted={profile.currentLevel}
      />
    )
  }

  switch (profile.autismSupportLevel) {
    case 1:
      return <Level1Journey childID={childID} onProgressClick={() => window.history.back()} />
    case 2:
      return <Level2Journey childID={childID} onProgressClick={() => window.history.back()} />
    case 3:
      return <Level3Journey childID={childID} onProgressClick={() => window.history.back()} />
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-pink-50">
          <p className="text-gray-600 text-lg">Loading learning journey...</p>
        </div>
      )
  }
}
