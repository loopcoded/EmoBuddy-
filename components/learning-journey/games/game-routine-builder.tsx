"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

const routines = [
  {
    id: 1,
    title: "Morning Routine",
    emoji: "🌅",
    correct: [
      "Wake up 🌅",
      "Brush teeth 🪥",
      "Wash face 💦",
      "Comb hair 💇",
      "Eat breakfast 🥣",
      "Put on clothes 👕",
      "Pack bag 🎒",
      "Go to school 🏫",
    ],
    shuffled: [
      "Put on clothes 👕",
      "Wake up 🌅",
      "Eat breakfast 🥣",
      "Brush teeth 🪥",
      "Go to school 🏫",
      "Wash face 💦",
      "Pack bag 🎒",
      "Comb hair 💇",
    ],
  },
  {
    id: 2,
    title: "Afternoon Routine",
    emoji: "☀️",
    correct: [
      "Eat lunch 🍽️",
      "Study 📚",
      "Play 🎮",
      "Clean up 🧹",
      "Drink water 💧",
      "Do homework 📝",
      "Free play 🎨",
      "Dinner time 🍖",
    ],
    shuffled: [
      "Free play 🎨",
      "Eat lunch 🍽️",
      "Drink water 💧",
      "Study 📚",
      "Dinner time 🍖",
      "Do homework 📝",
      "Clean up 🧹",
      "Play 🎮",
    ],
  },
  {
    id: 3,
    title: "Night Routine",
    emoji: "🌙",
    correct: [
      "Eat dinner 🍖",
      "Check timetable 📅",
      "Pack bag 🎒",
      "Brush teeth 🪥",
      "Put on pajamas 😴",
      "Read story 📖",
      "Goodnight 👋",
      "Sleep 💤",
    ],
    shuffled: [
      "Sleep 💤",
      "Read story 📖",
      "Eat dinner 🍖",
      "Pack bag 🎒",
      "Put on pajamas 😴",
      "Goodnight 👋",
      "Check timetable 📅",
      "Brush teeth 🪥",
    ],
  },
]

export default function GameRoutineBuilder({ onComplete, onBack }: GameProps) {
  const [currentRoutine, setCurrentRoutine] = useState(0)
  const [ordered, setOrdered] = useState<string[]>([])
  const [remaining, setRemaining] = useState<string[]>(routines[0].shuffled)
  const [completedCount, setCompletedCount] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const routine = routines[currentRoutine]
  const allCompleted = completedCount === routines.length

  // Accept a loose event type because motion.div may infer MouseEvent/TouchEvent.
  // Cast to React.DragEvent internally when we need dataTransfer.
  const handleDragStart = (e: any, item: string, fromOrdered: boolean) => {
    const ev = e as React.DragEvent
    ev.dataTransfer.effectAllowed = "move"
    ev.dataTransfer.setData("text/plain", item)
    ev.dataTransfer.setData("fromOrdered", String(fromOrdered))
  }

  const handleDragOver = (e: any) => {
    const ev = e as React.DragEvent
    ev.preventDefault()
    ev.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: any, toOrdered: boolean) => {
    const ev = e as React.DragEvent
    ev.preventDefault()
    const item = ev.dataTransfer.getData("text/plain")
    const fromOrdered = ev.dataTransfer.getData("fromOrdered") === "true"

    if (fromOrdered === toOrdered) return

    if (fromOrdered) {
      const newOrdered = ordered.filter((o) => o !== item)
      setOrdered(newOrdered)
      setRemaining([...remaining, item])
    } else {
      const newRemaining = remaining.filter((r) => r !== item)
      setRemaining(newRemaining)
      setOrdered([...ordered, item])
    }
  }

  const handleCheckOrder = () => {
    const isCorrectOrder = JSON.stringify(ordered) === JSON.stringify(routine.correct)
    setIsCorrect(isCorrectOrder)

    if (isCorrectOrder) {
      setTimeout(() => {
        if (currentRoutine < routines.length - 1) {
          setCurrentRoutine(currentRoutine + 1)
          setOrdered([])
          setRemaining(routines[currentRoutine + 1].shuffled)
          setCompletedCount(completedCount + 1)
          setIsCorrect(null)
        } else {
          setCompletedCount(completedCount + 1)
        }
      }, 1500)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 font-bold hover:bg-gray-300 transition-all"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-center text-amber-600">Routine Builder</h2>
          <div className="text-2xl">
            ✅ {completedCount}/{routines.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / routines.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
          />
        </div>

        {!allCompleted ? (
          <>
            <p className="text-xl font-bold text-center mb-8 text-gray-800">
              Put this routine in the correct order: <span className="text-amber-600">{routine.title}</span>{" "}
              {routine.emoji}
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Available items */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, false)}
                className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 border-2 border-dashed border-blue-300 min-h-64"
              >
                <p className="font-bold text-blue-700 mb-3">Activities:</p>
                <div className="space-y-2">
                  {remaining.map((item) => (
                    <motion.div
                      key={item}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, false)}
                      className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg cursor-move hover:shadow-lg transition-all font-semibold"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Ordered items */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, true)}
                className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl p-4 border-2 border-dashed border-amber-300 min-h-64"
              >
                <p className="font-bold text-amber-700 mb-3">Sequence:</p>
                <div className="space-y-2">
                  {ordered.length === 0 ? (
                    <p className="text-gray-500 italic">Drag items here...</p>
                  ) : (
                    ordered.map((item, index) => (
                      <motion.div
                        key={index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item, true)}
                        className="p-3 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-lg cursor-move hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                      >
                        <span className="bg-white text-amber-600 w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        {item}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Feedback */}
            {isCorrect === true && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-4 rounded-xl mb-6 bg-gradient-to-r from-green-200 to-green-100 text-green-800 text-lg font-bold"
              >
                ✅ Perfect routine sequence!
              </motion.div>
            )}

            {isCorrect === false && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-4 rounded-xl mb-6 bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800 text-lg font-bold"
              >
                Try again! Check the order of activities.
              </motion.div>
            )}

            {/* Check button */}
            <button
              onClick={handleCheckOrder}
              disabled={ordered.length !== routine.correct.length}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                ordered.length === routine.correct.length
                  ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white hover:shadow-lg cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Check Order
            </button>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <p className="text-3xl font-bold text-amber-600 mb-2">Routine Expert!</p>
            <p className="text-xl text-gray-700 mb-6">You mastered all 3 routines!</p>
            <button
              onClick={() => onComplete(8, 8)}
              className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
