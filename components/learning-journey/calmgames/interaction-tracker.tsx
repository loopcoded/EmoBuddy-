"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

interface InteractionData {
  choiceStartTime: number | null
  totalInteractions: number
  correctAnswers: number
  wrongAnswers: number
  timeSpentOnCurrentChoice: number
}

interface InteractionContextType {
  data: InteractionData
  startChoice: () => void
  endChoice: (wasCorrect: boolean) => void
  recordInteraction: () => void
  getComfortLevel: () => "comfortable" | "uncomfortable" | "neutral"
}

const InteractionContext = createContext<InteractionContextType | null>(null)

export function InteractionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<InteractionData>({
    choiceStartTime: null,
    totalInteractions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    timeSpentOnCurrentChoice: 0,
  })

  const startChoice = () => {
    setData((prev) => ({
      ...prev,
      choiceStartTime: Date.now(),
    }))
  }

  const endChoice = (wasCorrect: boolean) => {
    setData((prev) => {
      const timeSpent = prev.choiceStartTime ? Date.now() - prev.choiceStartTime : 0
      return {
        ...prev,
        choiceStartTime: null,
        timeSpentOnCurrentChoice: timeSpent,
        correctAnswers: wasCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
        wrongAnswers: wasCorrect ? prev.wrongAnswers : prev.wrongAnswers + 1,
      }
    })
  }

  const recordInteraction = () => {
    setData((prev) => ({
      ...prev,
      totalInteractions: prev.totalInteractions + 1,
    }))
  }

  const getComfortLevel = (): "comfortable" | "uncomfortable" | "neutral" => {
    const { correctAnswers, wrongAnswers, timeSpentOnCurrentChoice } = data

    // Child is comfortable if they're getting answers right and not taking too long
    if (correctAnswers > wrongAnswers && timeSpentOnCurrentChoice < 10000) {
      return "comfortable"
    }

    // Child might be uncomfortable if they're struggling or taking very long
    if (wrongAnswers > correctAnswers + 1 || timeSpentOnCurrentChoice > 20000) {
      return "uncomfortable"
    }

    return "neutral"
  }

  return (
    <InteractionContext.Provider value={{ data, startChoice, endChoice, recordInteraction, getComfortLevel }}>
      {children}
    </InteractionContext.Provider>
  )
}

export function useInteractionTracker() {
  const context = useContext(InteractionContext)
  if (!context) {
    throw new Error("useInteractionTracker must be used within InteractionProvider")
  }
  return context
}
