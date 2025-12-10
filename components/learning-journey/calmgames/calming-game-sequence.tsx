"use client"

import { useState, useEffect } from "react"
import { BreathingBalloon } from "@/components/learning-journey/calmgames/breathing-balloon"
import { BubblePopping } from "@/components/learning-journey/calmgames/bubble-popping"
import { SoundSelector } from "@/components/learning-journey/calmgames/sound-selector"
import { AnimalSelector } from "@/components/learning-journey/calmgames/animal-selector"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CalmingGameSequenceProps {
  onComplete: () => void
  onBackToWelcome?: () => void
}

type GameStage =
  | "activation-popup"
  | "breathing"
  | "transition-bubbles"
  | "bubbles"
  | "transition-sounds"
  | "sounds"
  | "transition-animals"
  | "animals"
  | "final-popup"

export function CalmingGameSequence({ onComplete, onBackToWelcome }: CalmingGameSequenceProps) {
  const [stage, setStage] = useState<GameStage>("activation-popup")

  useEffect(() => {
    if (stage === "activation-popup") {
      const timer = setTimeout(() => {
        setStage("breathing")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  useEffect(() => {
    if (stage === "transition-bubbles" || stage === "transition-sounds" || stage === "transition-animals") {
      const timer = setTimeout(() => {
        if (stage === "transition-bubbles") setStage("bubbles")
        else if (stage === "transition-sounds") setStage("sounds")
        else if (stage === "transition-animals") setStage("animals")
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [stage])

  const handleBreathingComplete = () => {
    setStage("transition-bubbles")
  }

  const handleBubblesComplete = () => {
    setStage("transition-sounds")
  }

  const handleSoundsComplete = () => {
    setStage("transition-animals")
  }

  const handleAnimalsComplete = () => {
    setStage("final-popup")
  }

  const handleFinalPopupYes = () => {
    onComplete()
  }

  const handleFinalPopupNo = () => {
    // Restart from activation popup
    setStage("activation-popup")
  }

  return (
    <>
      {stage === "activation-popup" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6">
          <Card className="p-8 max-w-md w-full text-center bg-white shadow-lg rounded-2xl">
            <div className="mb-6 text-5xl">✨</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Calming Mode Activated</h2>
            <p className="text-muted-foreground">Starting your calming journey...</p>
          </Card>
        </div>
      )}

      {stage === "breathing" && (
        <BreathingBalloon onComplete={handleBreathingComplete} durationSeconds={10} />
      )}

      {stage === "transition-bubbles" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6">
          <Card className="p-8 max-w-md w-full text-center bg-white shadow-lg rounded-2xl">
            <div className="mb-6 text-5xl">🫧</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Switching to next activity...</h2>
          </Card>
        </div>
      )}

      {stage === "bubbles" && (
        <BubblePopping onComplete={handleBubblesComplete} onBack={() => {}} durationSeconds={30} />
      )}

      {stage === "transition-sounds" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6">
          <Card className="p-8 max-w-md w-full text-center bg-white shadow-lg rounded-2xl">
            <div className="mb-6 text-5xl">🎵</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Switching to next activity...</h2>
          </Card>
        </div>
      )}

      {stage === "sounds" && <SoundSelector onComplete={handleSoundsComplete} onBack={() => {}} durationSeconds={30} />}

      {stage === "transition-animals" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6">
          <Card className="p-8 max-w-md w-full text-center bg-white shadow-lg rounded-2xl">
            <div className="mb-6 text-5xl">🐾</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Switching to next activity...</h2>
          </Card>
        </div>
      )}

      {stage === "animals" && (
        <AnimalSelector onComplete={handleAnimalsComplete} onBack={() => {}} durationSeconds={60} />
      )}

      {stage === "final-popup" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-6">
          <Card className="p-8 max-w-md w-full text-center bg-white shadow-lg rounded-2xl">
            <div className="mb-6 text-5xl">😊</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Are you feeling fine now?</h2>
            <p className="text-muted-foreground mb-8">You did a great job with all the calming activities!</p>

            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleFinalPopupYes}
                size="lg"
                className="rounded-xl bg-green-500 hover:bg-green-600 text-white"
              >
                Yes
              </Button>
              <Button
                onClick={handleFinalPopupNo}
                size="lg"
                variant="outline"
                className="rounded-xl border-2 bg-transparent"
              >
                No
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
