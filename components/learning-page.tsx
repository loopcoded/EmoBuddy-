"use client"

import { useState, useEffect, useRef } from "react"
import { CalmingGameSequence } from "./learning-journey/calmgames/calming-game-sequence"
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

export default function LearningPage({ childID, profile }: LearningPageProps) {
  const [isCalmingMode, setIsCalmingMode] = useState(false)
  const [emotion, setEmotion] = useState<"happy" | "sad" | "angry" | "neutral">("neutral")
  const [lastModuleID, setLastModuleID] = useState<number | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  // Enable camera
  useEffect(() => {
    const enableCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (err) {
        console.warn("Camera permission denied")
      }
    }
    enableCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((t) => t.stop())
      }
    }
  }, [])

  // Placeholder emotion detector (you will replace this with your real model)
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: Replace this with your model output
      // setEmotion(modelPrediction)

      // SIMULATION FOR NOW
      const random = Math.random()
      if (random < 0.1) setEmotion("angry")
      else if (random < 0.2) setEmotion("sad")
      else setEmotion("happy")
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Trigger calming mode
  useEffect(() => {
    if (emotion === "sad" || emotion === "angry") {
      setIsCalmingMode(true)
    }
  }, [emotion])

  const handleCalmingComplete = () => {
    // close calming and restore last module position if any
    setIsCalmingMode(false)
    if (lastModuleID !== null) {
      // we use hash navigation to let the level journeys scroll / jump to the module
      window.location.hash = `#module-${lastModuleID}`
    }
  }

  // If in calming mode: show the full calming journey system
  if (isCalmingMode) {
    return <CalmingGameSequence onComplete={handleCalmingComplete} />
  }

  // Normal learning view — render the appropriate Level component and pass the onModuleChange callback
  let content = null
  switch (profile.autismSupportLevel) {
    case 1:
      content = (
        <Level1Journey
          childID={childID}
          onProgressClick={() => window.history.back()}
          onModuleChange={(id) => setLastModuleID(id)}
        />
      )
      break
    case 2:
      content = (
        <Level2Journey
          childID={childID}
          onProgressClick={() => window.history.back()}
          onModuleChange={(id) => setLastModuleID(id)}
        />
      )
      break
    case 3:
      content = (
        <Level3Journey
          childID={childID}
          onProgressClick={() => window.history.back()}
          onModuleChange={(id) => setLastModuleID(id)}
        />
      )
      break
    default:
      content = (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-pink-50">
          <p className="text-gray-600 text-lg">Loading learning journey...</p>
        </div>
      )
  }

  return (
    <>
      {/* DEBUG EMOTION TESTING PANEL */}
      <div className="fixed top-4 right-4 bg-white shadow-md rounded-xl p-4 z-50">
        <p className="font-bold mb-2">Emotion Debug</p>
        <button onClick={() => setEmotion("happy")} className="px-3 py-1 bg-green-300 rounded-md mr-2">
          😊 Happy
        </button>
        <button onClick={() => setEmotion("sad")} className="px-3 py-1 bg-blue-300 rounded-md mr-2">
          😢 Sad
        </button>
        <button onClick={() => setEmotion("angry")} className="px-3 py-1 bg-red-300 rounded-md">
          😡 Angry
        </button>
      </div>

      {content}
    </>
  )
}
