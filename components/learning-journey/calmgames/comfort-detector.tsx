"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mascot } from "@/components/learning-journey/calmgames/mascot"

interface ComfortDetectorProps {
  onComfortChange: (level: "comfortable" | "uncomfortable" | "neutral") => void
  children: React.ReactNode
  afterCalmingGame?: boolean
}

export function ComfortDetector({ onComfortChange, children, afterCalmingGame = false }: ComfortDetectorProps) {
  const [interactionCount, setInteractionCount] = useState(0)
  const [timeSpentOnChoices, setTimeSpentOnChoices] = useState<number[]>([])
  const [wrongAnswerStreak, setWrongAnswerStreak] = useState(0)
  const [lastInteractionTime, setLastInteractionTime] = useState(Date.now())
  const [showComfortCheck, setShowComfortCheck] = useState(false)
  const [lastComfortCheckTime, setLastComfortCheckTime] = useState(Date.now())

  useEffect(() => {
    const checkComfortLevel = () => {
      const timeSinceLastCheck = Date.now() - lastComfortCheckTime
      const timeSinceLastInteraction = Date.now() - lastInteractionTime

      // Only show comfort check if:
      // 1. No response for 15 seconds AND it's been at least 2 minutes since last check
      // 2. OR after completing a calming game
      const shouldShowAfterInactivity = timeSinceLastInteraction > 15000 && timeSinceLastCheck > 120000 // 2 minutes
      const shouldShowAfterCalming = afterCalmingGame && timeSinceLastCheck > 30000 // 30 seconds after calming

      if (shouldShowAfterInactivity || shouldShowAfterCalming) {
        setShowComfortCheck(true)
        setLastComfortCheckTime(Date.now())
      }
    }

    const interval = setInterval(checkComfortLevel, 5000) // Check every 5 seconds
    return () => clearInterval(interval)
  }, [lastInteractionTime, lastComfortCheckTime, afterCalmingGame])

  const handleInteraction = () => {
    setInteractionCount((prev) => prev + 1)
    setLastInteractionTime(Date.now())
  }

  const handleChoiceTime = (timeSpent: number) => {
    setTimeSpentOnChoices((prev) => [...prev.slice(-4), timeSpent]) // Keep last 5 times
  }

  const handleWrongAnswer = () => {
    setWrongAnswerStreak((prev) => prev + 1)
  }

  const handleCorrectAnswer = () => {
    setWrongAnswerStreak(0)
    onComfortChange("comfortable")
  }

  const handleComfortResponse = (isComfortable: boolean) => {
    setShowComfortCheck(false)
    setLastComfortCheckTime(Date.now())
    if (isComfortable) {
      onComfortChange("comfortable")
      setWrongAnswerStreak(0)
    } else {
      onComfortChange("uncomfortable")
    }
  }

  return (
    <div className="relative">
      {children}

      {showComfortCheck && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Card className="p-8 max-w-md mx-4 bg-white shadow-xl">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Mascot
                  message="How are you feeling? I want to make sure you're having a good time!"
                  emotion="caring"
                  size="medium"
                />
              </div>
              <h3 className="text-xl font-bold text-foreground">Are you feeling okay?</h3>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => handleComfortResponse(true)}
                  className="w-full rounded-xl bg-primary hover:bg-primary/90"
                >
                  😊 I'm feeling good!
                </Button>
                <Button onClick={() => handleComfortResponse(false)} variant="secondary" className="w-full rounded-xl">
                  😔 I need some calm time
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
