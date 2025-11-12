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
    image: "🧒🧒😊",
    question: "What is happening?",
    options: [
      { label: "A) Playing together", correct: true },
      { label: "B) Fighting", correct: false },
      { label: "C) Bored", correct: false },
    ],
    feedback: "Yes! They are playing together.",
  },
  {
    id: 2,
    image: "🧒😢 🧒🤲",
    question: "What is happening?",
    options: [
      { label: "A) Mean", correct: false },
      { label: "B) Helping", correct: true },
      { label: "C) Ignoring", correct: false },
    ],
    feedback: "Helping makes others feel cared for.",
  },
  {
    id: 3,
    image: "🧒↗️ 🛝",
    question: "What is happening?",
    options: [
      { label: "A) Pushing", correct: true },
      { label: "B) Sharing", correct: false },
      { label: "C) Asking to play", correct: false },
    ],
    feedback: "We use gentle hands.",
  },
  {
    id: 4,
    image: "🧒😄💬 🧒😄💬",
    question: "What are they doing?",
    options: [
      { label: "A) Laughing", correct: true },
      { label: "B) Angry", correct: false },
      { label: "C) Scared", correct: false },
    ],
    feedback: "They are enjoying together!",
  },
  {
    id: 5,
    image: "🧒⏳ 🧒 ⏳",
    question: "What is happening?",
    options: [
      { label: "A) Running", correct: false },
      { label: "B) Waiting turn", correct: true },
      { label: "C) Shouting", correct: false },
    ],
    feedback: "Waiting your turn helps everyone.",
  },
  {
    id: 6,
    image: "🧒✋ 🧒🎮",
    question: "What is happening?",
    options: [
      { label: "A) Sharing", correct: false },
      { label: "B) Taking without asking", correct: true },
      { label: "C) Saying hello", correct: false },
    ],
    feedback: "We ask before taking.",
  },
  {
    id: 7,
    image: "👨‍🏫📖 🧒👂",
    question: "What is happening?",
    options: [
      { label: "A) Listening", correct: true },
      { label: "B) Fighting", correct: false },
      { label: "C) Jumping", correct: false },
    ],
    feedback: "Listening helps us learn.",
  },
  {
    id: 8,
    image: "🧒🧒✋👍",
    question: "What is happening?",
    options: [
      { label: "A) Celebrating", correct: true },
      { label: "B) Crying", correct: false },
      { label: "C) Sleeping", correct: false },
    ],
    feedback: "Great teamwork!",
  },
]

export default function GameSocialDetective({ onComplete, onBack }: GameProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [stars, setStars] = useState(0)

  const scenario = scenarios[currentScenario]
  const allCorrect = score === scenarios.length

  const handleAnswerClick = (index: number) => {
    if (isAnswered) return
    setSelectedAnswer(index)
    setIsAnswered(true)

    if (scenario.options[index].correct) {
      setScore(score + 1)
      setStars(stars + 1)
    }
  }

  const handleNext = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
    } else {
      if (allCorrect) {
        onComplete(score, scenarios.length)
      }
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
          <h2 className="text-2xl font-bold text-center text-blue-600">Social Detective</h2>
          <div className="text-2xl">
            ⭐ {stars}/{scenarios.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
          />
        </div>

        {!allCorrect ? (
          <>
            {/* Scenario Image */}
            <div className="text-8xl text-center mb-6 animate-bounce">{scenario.image}</div>

            {/* Question */}
            <p className="text-2xl font-bold text-center mb-8 text-gray-800">{scenario.question}</p>

            {/* Options */}
            <div className="space-y-3 mb-8">
              {scenario.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  onClick={() => handleAnswerClick(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl font-bold text-lg transition-all text-left ${
                    !isAnswered
                      ? "bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:shadow-lg cursor-pointer"
                      : selectedAnswer === index
                        ? option.correct
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300"
                          : "bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {option.label}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center p-4 rounded-xl mb-6 text-lg font-bold ${
                  scenario.options[selectedAnswer!].correct
                    ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800"
                    : "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800"
                }`}
              >
                {scenario.options[selectedAnswer!].correct
                  ? `✅ ${scenario.feedback}`
                  : `Let's try again! ${scenario.feedback}`}
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && !scenario.options[selectedAnswer!].correct && (
              <button
                onClick={() => {
                  setSelectedAnswer(null)
                  setIsAnswered(false)
                }}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Try Again
              </button>
            )}

            {isAnswered && scenario.options[selectedAnswer!].correct && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                {currentScenario < scenarios.length - 1 ? "Next Scene →" : "Finish Game"}
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
            <p className="text-3xl font-bold text-green-600 mb-2">Perfect Score!</p>
            <p className="text-xl text-gray-700 mb-6">You mastered Social Detective!</p>
            <button
              onClick={() => onComplete(8, 8)}
              className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
