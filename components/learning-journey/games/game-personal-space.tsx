"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

export default function GamePersonalSpace({ onComplete, onBack }: GameProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)

  const scenarios = [
    {
      title: "Standing Close",
      situation: "Your friend is standing very close to you. What should you do?",
      question: "Choose the best response:",
      options: ["Step back politely", "Get even closer", "Say nothing"],
      correct: 0,
    },
    {
      title: "Sitting Nearby",
      situation: "You want to sit next to your classmate. What's appropriate?",
      question: "What should you do?",
      options: ["Sit too close", "Sit at a comfortable distance", "Don't sit at all"],
      correct: 1,
    },
    {
      title: "Respecting Boundaries",
      situation: "Someone puts their arm around you but you feel uncomfortable.",
      question: "What can you do?",
      options: ["Say nothing", "Politely move away or say you need space", "Push them away"],
      correct: 1,
    },
  ]

  const handleAnswer = (index: number) => {
    if (index === scenarios[currentScenario].correct) {
      setScore(score + 1)
    }

    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1)
    } else {
      onComplete(score + (index === scenarios[currentScenario].correct ? 1 : 0), scenarios.length)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-200 to-purple-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-violet-600">Personal Space</h2>
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-2xl hover:bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center"
          >
            ×
          </motion.button>
        </div>

        <motion.div
          key={currentScenario}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <p className="text-lg text-gray-700 mb-4">
            Scenario {currentScenario + 1} of {scenarios.length}
          </p>
          <h3 className="text-2xl font-bold text-violet-600 mb-4">{scenarios[currentScenario].title}</h3>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-violet-100 rounded-2xl p-6 mb-6 text-center"
          >
            <p className="text-lg text-gray-800">{scenarios[currentScenario].situation}</p>
          </motion.div>

          <p className="text-xl font-bold text-gray-800 mb-4">{scenarios[currentScenario].question}</p>

          <div className="space-y-3">
            {scenarios[currentScenario].options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => handleAnswer(i)}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-gradient-to-r from-violet-400 to-purple-500 text-white p-4 rounded-2xl font-bold hover:shadow-lg transition-all text-left"
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Progress: {currentScenario + 1}/{scenarios.length}
          </p>
          <motion.div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentScenario + 1) / scenarios.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
