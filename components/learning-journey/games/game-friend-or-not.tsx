"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

const scenarios = [
  {
    id: 1,
    emoji: "🎮➡️🤝",
    description: "Sharing a toy",
    correct: "Good Friend",
    feedback: "Sharing helps others feel happy.",
  },
  {
    id: 2,
    emoji: "🧒😂 / 🧒💥",
    description: "Laughing when someone trips",
    correct: "Not Good Friend",
    feedback: "We help when someone is hurt.",
  },
  {
    id: 3,
    emoji: "🧒💬👂 🧒💬",
    description: "Listening while someone speaks",
    correct: "Good Friend",
    feedback: "Listening shows respect.",
  },
  {
    id: 4,
    emoji: "🧒✋➡️💥 🧒",
    description: "Pushing someone",
    correct: "Not Good Friend",
    feedback: "We use gentle hands.",
  },
  {
    id: 5,
    emoji: "🧒❓ 🧒😊",
    description: "Asking someone to play",
    correct: "Good Friend",
    feedback: "Inviting helps make new friends.",
  },
  {
    id: 6,
    emoji: "🧒🤲 🧒😞",
    description: "Taking things without asking",
    correct: "Not Good Friend",
    feedback: "We ask before taking.",
  },
  {
    id: 7,
    emoji: "🧒💙 💬 🧒😊",
    description: "Saying kind words",
    correct: "Good Friend",
    feedback: "Kind words make smiles.",
  },
  {
    id: 8,
    emoji: "🧒🗣️ 🧒🙉",
    description: "Ignoring someone calling your name",
    correct: "Not Good Friend",
    feedback: "We respond when someone talks to us.",
  },
]

export default function GameFriendOrNot({ onComplete, onBack }: GameProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [allComplete, setAllComplete] = useState(false)

  const scenario = scenarios[currentScenario]

  const handleAnswerClick = (answer: string) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
    setIsAnswered(true)

    if (answer === scenario.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
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
          <h2 className="text-2xl font-bold text-center text-orange-600">Friend or Not Friend</h2>
          <div className="text-2xl">
            ❤️ {score}/{scenarios.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full"
          />
        </div>

        {!allComplete ? (
          <>
            {/* Scenario */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 mb-8 text-center">
              <p className="text-8xl mb-4 animate-bounce">{scenario.emoji}</p>
              <p className="text-2xl font-bold text-orange-700">{scenario.description}</p>
            </div>

            {/* Question */}
            <p className="text-lg font-bold text-center mb-6 text-gray-800">
              Is this a Good Friend or Not a Good Friend behavior?
            </p>

            {/* Answer options */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <motion.button
                whileHover={!isAnswered ? { scale: 1.05 } : {}}
                onClick={() => handleAnswerClick("Good Friend")}
                disabled={isAnswered}
                className={`p-6 rounded-xl font-bold text-lg transition-all ${
                  !isAnswered
                    ? "bg-gradient-to-r from-green-400 to-green-500 text-white hover:shadow-lg cursor-pointer"
                    : selectedAnswer === "Good Friend"
                      ? scenario.correct === "Good Friend"
                        ? "bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-yellow-300"
                        : "bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                <div className="text-4xl mb-2">💚</div>
                Good Friend
              </motion.button>

              <motion.button
                whileHover={!isAnswered ? { scale: 1.05 } : {}}
                onClick={() => handleAnswerClick("Not Good Friend")}
                disabled={isAnswered}
                className={`p-6 rounded-xl font-bold text-lg transition-all ${
                  !isAnswered
                    ? "bg-gradient-to-r from-red-400 to-red-500 text-white hover:shadow-lg cursor-pointer"
                    : selectedAnswer === "Not Good Friend"
                      ? scenario.correct === "Not Good Friend"
                        ? "bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-yellow-300"
                        : "bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                <div className="text-4xl mb-2">💔</div>
                Not Good Friend
              </motion.button>
            </div>

            {/* Feedback */}
            {isAnswered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center p-4 rounded-xl mb-6 text-lg font-bold ${
                  selectedAnswer === scenario.correct
                    ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800"
                    : "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800"
                }`}
              >
                {selectedAnswer === scenario.correct ? `✅ ${scenario.feedback}` : `Try again! ${scenario.feedback}`}
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && selectedAnswer !== scenario.correct ? (
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

            {isAnswered && selectedAnswer === scenario.correct && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                {currentScenario < scenarios.length - 1 ? "Next Scenario →" : "Finish Game"}
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
            <p className="text-3xl font-bold text-orange-600 mb-2">Friendship Expert!</p>
            <p className="text-xl text-gray-700 mb-2">
              You scored: {score}/{scenarios.length}
            </p>
            <p className="text-lg text-gray-600 mb-6">You know how to be a great friend!</p>
            <button
              onClick={() => onComplete(8, 8)}
              className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
