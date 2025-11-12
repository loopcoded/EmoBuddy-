"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

const gestures = [
  {
    id: 1,
    gesture: "👋",
    meaning: "Hello/Goodbye",
    options: ["Hello/Goodbye", "Stop", "Come here"],
  },
  {
    id: 2,
    gesture: "👍",
    meaning: "Yes",
    options: ["Yes", "Stop", "No"],
  },
  {
    id: 3,
    gesture: "🤫",
    meaning: "Quiet",
    options: ["Quiet", "Listen", "Laugh"],
  },
  {
    id: 4,
    gesture: "✋",
    meaning: "Stop",
    options: ["Stop", "Run", "Jump"],
  },
  {
    id: 5,
    gesture: "👂",
    meaning: "Listen",
    options: ["Listen", "Talk", "Dance"],
  },
  {
    id: 6,
    gesture: "🤝",
    meaning: "Shake hands",
    options: ["Shake hands", "Push", "Grab"],
  },
  {
    id: 7,
    gesture: "☝️",
    meaning: "Look",
    options: ["Look", "Eat", "Sit"],
  },
  {
    id: 8,
    gesture: "🤗",
    meaning: "Hug",
    options: ["Hug", "Run", "Hide"],
  },
]

export default function GameGestureGuessing({ onComplete, onBack }: GameProps) {
  const [currentGesture, setCurrentGesture] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [allComplete, setAllComplete] = useState(false)

  const gesture = gestures[currentGesture]

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === gesture.meaning) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentGesture < gestures.length - 1) {
      setCurrentGesture(currentGesture + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      setAllComplete(true)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 font-bold hover:bg-gray-300 transition-all"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-center text-teal-600">Gesture Guessing</h2>
          <div className="text-2xl">
            ✋ {score}/{gestures.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentGesture + 1) / gestures.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full"
          />
        </div>

        {!allComplete ? (
          <>
            {/* Gesture display */}
            <div className="bg-gradient-to-br from-teal-100 to-teal-50 rounded-2xl p-8 mb-8 text-center">
              <p className="text-lg font-semibold text-teal-700 mb-4">What does this gesture mean?</p>
              <p className="text-9xl mb-4 animate-bounce">{gesture.gesture}</p>
            </div>

            {/* Answer options */}
            <div className="space-y-3 mb-8">
              {gesture.options.map((option) => (
                <motion.button
                  key={option}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  onClick={() => handleAnswerClick(option)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl font-bold text-lg transition-all ${
                    !isAnswered
                      ? "bg-gradient-to-r from-teal-400 to-teal-500 text-white hover:shadow-lg cursor-pointer"
                      : selectedAnswer === option
                        ? option === gesture.meaning
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300"
                          : "bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {option}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center p-4 rounded-xl mb-6 text-lg font-bold ${
                  selectedAnswer === gesture.meaning
                    ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800"
                    : "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800"
                }`}
              >
                {selectedAnswer === gesture.meaning
                  ? `✅ Right! That means ${gesture.meaning}!`
                  : `That means ${gesture.meaning}.`}
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && selectedAnswer !== gesture.meaning ? (
              <button
                onClick={() => {
                  setSelectedAnswer(null)
                  setIsAnswered(false)
                }}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                Try Again
              </button>
            ) : null}

            {isAnswered && selectedAnswer === gesture.meaning && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                {currentGesture < gestures.length - 1 ? "Next Gesture →" : "Finish Game"}
              </button>
            )}
          </>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <p className="text-3xl font-bold text-teal-600 mb-2">Gesture Master!</p>
            <p className="text-xl text-gray-700 mb-2">
              You scored: {score}/{gestures.length}
            </p>
            <p className="text-lg text-gray-600 mb-6">You understand all these social gestures!</p>
            <button
              onClick={() => onComplete(8, 8)}
              className="w-full py-3 bg-gradient-to-r from-teal-400 to-teal-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
