"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mascot } from "@/components/learning-journey/calmgames/mascot"
import { useInteractionTracker } from "@/components/learning-journey/calmgames/interaction-tracker"
import { usePoints } from "../../../hooks/use-points"

interface Choice {
  id: number
  text: string
  isCorrect: boolean
  feedback: string
}

interface Module {
  id: number
  title: string
  scene: string
  illustration: string
  choices: Choice[]
}

interface GameModuleProps {
  module: Module
  onComplete: () => void
  onNeedCalming: () => void
  onBackToMenu: () => void
}

export function GameModule({ module, onComplete, onNeedCalming, onBackToMenu }: GameModuleProps) {
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentChoice, setCurrentChoice] = useState<Choice | null>(null)
  const [showPointsAnimation, setShowPointsAnimation] = useState(false)

  const { startChoice, endChoice, recordInteraction } = useInteractionTracker()
  const { points, addPoints } = usePoints()

  const handleChoiceSelect = (choice: Choice) => {
    endChoice(choice.isCorrect)
    recordInteraction()

    setSelectedChoice(choice.id)
    setCurrentChoice(choice)
    setShowFeedback(true)

    if (choice.isCorrect) {
      addPoints(10) // Award 10 points for correct answer
      setShowPointsAnimation(true)
      setTimeout(() => setShowPointsAnimation(false), 2000)
    }
  }

  const handleContinue = () => {
    if (currentChoice?.isCorrect) {
      onComplete()
    } else {
      setSelectedChoice(null)
      setShowFeedback(false)
      setCurrentChoice(null)
      startChoice()
    }
  }

  const handleShowChoices = () => {
    startChoice()
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={onBackToMenu} className="rounded-xl bg-transparent">
            ← Back to Stories
          </Button>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-primary">{points}</span>
            </div>
            <Button variant="secondary" onClick={onNeedCalming} className="rounded-xl">
              🫧 I Need to Calm Down
            </Button>
          </div>
        </div>

        {showPointsAnimation && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
            <div className="animate-bounce text-6xl">+10 ⭐</div>
          </div>
        )}

        {/* Story Scene */}
        <Card className="p-8 mb-8 text-center bg-card">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">{module.title}</h2>
            <div className="text-8xl mb-4">{module.illustration}</div>
            <p className="text-lg text-muted-foreground text-pretty">{module.scene}</p>
          </div>
        </Card>

        {!showFeedback ? (
          <>
            {/* Mascot guidance */}
            <div className="flex justify-center mb-8">
              <Mascot
                message="What do you think would be the kindest thing to do?"
                emotion="encouraging"
                size="medium"
              />
            </div>

            {/* Choice bubbles */}
            <div className="space-y-4" onMouseEnter={handleShowChoices}>
              <h3 className="text-xl font-semibold text-center text-foreground mb-6">What should they do?</h3>
              {module.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="outline"
                  className="w-full p-6 h-auto text-left rounded-2xl border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 bg-transparent"
                  onClick={() => handleChoiceSelect(choice)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      {choice.id}
                    </div>
                    <span className="text-base font-medium">{choice.text}</span>
                  </div>
                </Button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Feedback section */}
            <div className="flex justify-center mb-8">
              <Mascot
                message={
                  currentChoice?.isCorrect
                    ? `${currentChoice?.feedback} You earned 10 stars! ⭐`
                    : currentChoice?.feedback || ""
                }
                emotion={currentChoice?.isCorrect ? "happy" : "encouraging"}
                size="large"
              />
            </div>

            <Card
              className={`p-8 text-center ${
                currentChoice?.isCorrect ? "bg-primary/10 border-primary/20" : "bg-secondary/50 border-secondary"
              }`}
            >
              <div className="space-y-4">
                <div className="text-4xl">{currentChoice?.isCorrect ? "🌟" : "💭"}</div>
                <h3 className={`text-xl font-bold ${currentChoice?.isCorrect ? "text-primary" : "text-foreground"}`}>
                  {currentChoice?.isCorrect ? "Great Choice! +10 Stars!" : "Let's Think About This"}
                </h3>
                <p className="text-muted-foreground text-pretty">{currentChoice?.feedback}</p>
              </div>
            </Card>

            <div className="flex justify-center mt-8">
              <Button onClick={handleContinue} size="lg" className="px-8 py-4 rounded-xl text-lg">
                {currentChoice?.isCorrect ? "🎉 Continue to Next Story" : "🔄 Try Again"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
