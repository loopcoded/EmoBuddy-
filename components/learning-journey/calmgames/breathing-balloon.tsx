"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface BreathingBalloonProps {
  onComplete: () => void
  durationSeconds?: number
}

export function BreathingBalloon({ onComplete, durationSeconds = 30 }: BreathingBalloonProps) {
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [phaseTime, setPhaseTime] = useState(4)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(durationSeconds)
  const [balloonScale, setBalloonScale] = useState(1)
  const completedRef = useRef(false)

  // Handle breathing phases
  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseTime((prev) => {
        if (prev <= 1) {
          setPhase((currentPhase) => {
            if (currentPhase === "inhale") {
              return "hold"
            } else if (currentPhase === "hold") {
              return "exhale"
            } else {
              return "inhale"
            }
          })
          return phase === "exhale" ? 4 : phase === "inhale" ? 1 : 4
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Update balloon size based on phase
  useEffect(() => {
    if (phase === "inhale") {
      setBalloonScale(1.3)
    } else if (phase === "hold") {
      setBalloonScale(1.2)
    } else {
      setBalloonScale(1)
    }
  }, [phase])


  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        const newValue = prev - 1
        // Use ref to track completion state
        if (newValue <= 0 && !completedRef.current) {
          completedRef.current = true
          // Defer the callback to next render cycle
          setTimeout(() => {
            onComplete()
          }, 0)
        }
        return Math.max(0, newValue)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [onComplete])

  const getPhaseInstruction = () => {
    switch (phase) {
      case "inhale":
        return "Breathe in slowly"
      case "hold":
        return "Hold your breath"
      case "exhale":
        return "Breathe out slowly"
    }
  }

  const handleOkay = () => {
    if (!completedRef.current) {
      completedRef.current = true
      onComplete()
    }
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{
        backgroundImage: "url(/breathing-bg.jpg)",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/30" />

      {/* Background clouds - decorative */}
      <div className="absolute top-10 left-10 w-32 h-16 bg-white/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/4 right-20 w-40 h-20 bg-white/30 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="absolute top-6 right-6 z-10">
        <Card className="p-3 bg-white/80">
          <div className="text-lg font-bold text-foreground">{totalTimeRemaining}</div>
        </Card>
      </div>

      {/* Main content */}
      <div className="relative z-20 space-y-12 text-center">
        {/* Breathing Balloon */}
        <div className="flex justify-center">
          <div
            className="relative transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${balloonScale})` }}
          >
            {/* Balloon */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-300 to-pink-400 shadow-2xl flex items-center justify-center relative">
              {/* Balloon shine/glow */}
              <div className="absolute w-32 h-32 rounded-full bg-white/30 blur-xl" />

              {/* Balloon face */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="flex gap-6">
                  <div className="w-4 h-4 rounded-full bg-white" />
                  <div className="w-4 h-4 rounded-full bg-white" />
                </div>
                <div className="w-12 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Balloon string */}
            <div className="absolute left-1/2 top-40 w-1 h-12 bg-pink-300 -translate-x-1/2 blur-sm" />
          </div>
        </div>

        {/* Instruction */}
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-foreground capitalize">{phase}</h2>
          <p className="text-xl text-muted-foreground">{getPhaseInstruction()}</p>
          <p className="text-3xl font-bold text-primary">{phaseTime}s</p>
        </div>

        {totalTimeRemaining === 0 && (
          <Button onClick={handleOkay} className="rounded-xl px-8 py-2 text-lg" size="lg">
            Okay
          </Button>
        )}
      </div>
    </div>
  )
}
