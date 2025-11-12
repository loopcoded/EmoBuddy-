"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import RewardCelebration from "./reward-celebration"

interface CalmingGameProps {
  onComplete: (levelCompleted: number) => void
  childID: string
  levelCompleted?: number
}

export default function CalmingGame({ onComplete, childID, levelCompleted = 1 }: CalmingGameProps) {
  const [timeRemaining, setTimeRemaining] = useState(180) // 3 minutes
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [bubbles, setBubbles] = useState<Array<{ id: number; x: number; y: number }>>([])
  const [showRewards, setShowRewards] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowRewards(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const breathingCycle = setInterval(() => {
      setBreathingPhase((current) => {
        if (current === "inhale") return "hold"
        if (current === "hold") return "exhale"
        return "inhale"
      })
    }, 2000)

    return () => clearInterval(breathingCycle)
  }, [])

  useEffect(() => {
    // Spawn calming bubbles
    const spawnBubble = () => {
      const newBubble = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
      }
      setBubbles((prev) => [...prev, newBubble])
      setTimeout(() => {
        setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id))
      }, 3000)
    }

    const interval = setInterval(spawnBubble, 1500)
    return () => clearInterval(interval)
  }, [])

  const handleContinue = () => {
    setShowRewards(false)
    onComplete(levelCompleted)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${String(secs).padStart(2, "0")}`
  }

  if (showRewards) {
    return (
      <RewardCelebration
        childID={childID}
        levelCompleted={levelCompleted}
        rewards={["⭐ 100 XP", "🏆 Badge", "🎨 Avatar Accessory"]}
        avatarUpgrades={["Sparkle Eyes", "Golden Crown", "Rainbow Aura"]}
        onClose={handleContinue}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8 text-pretty">Take a Calming Break</h1>

        <Card className="p-12 bg-white/90 backdrop-blur border-0 shadow-xl text-center">
          {/* Breathing Circle */}
          <div className="mb-12 relative h-48 flex items-center justify-center">
            <div
              className={`absolute w-32 h-32 rounded-full bg-gradient-to-br from-mint-300 to-blue-300 transition-all duration-2000 ${
                breathingPhase === "inhale" ? "scale-100" : breathingPhase === "hold" ? "scale-110" : "scale-90"
              }`}
            ></div>
            <div className="relative z-10 text-center">
              <p className="text-gray-700 font-semibold mb-2 capitalize">
                {breathingPhase === "inhale" && "Breathe In..."}
                {breathingPhase === "hold" && "Hold..."}
                {breathingPhase === "exhale" && "Breathe Out..."}
              </p>
            </div>
          </div>

          {/* Floating Bubbles */}
          <div className="relative h-32 bg-blue-50 rounded-2xl mb-8 overflow-hidden">
            {bubbles.map((bubble) => (
              <div
                key={bubble.id}
                className="absolute w-8 h-8 rounded-full bg-gradient-to-br from-mint-200 to-blue-200 opacity-60 animate-bounce"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  animation: "float 3s ease-in forwards",
                }}
              ></div>
            ))}
          </div>

          {/* Time Remaining */}
          <div className="mb-8">
            <p className="text-gray-600 text-sm mb-2">Relax for a few moments</p>
            <p className="text-4xl font-bold text-mint-600">{formatTime(timeRemaining)}</p>
          </div>

          {/* Skip Button */}
          <Button onClick={() => setShowRewards(true)} variant="outline" className="rounded-xl bg-transparent">
            Ready to Continue
          </Button>
        </Card>

        <style jsx>{`
          @keyframes float {
            to {
              transform: translateY(-200px);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  )
}
