"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

export default function GameTimeSequencing({ onComplete, onBack }: GameProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)

  const scenarios = [
    {
      title: "Morning Routine",
      sequence: ["Wake up", "Breakfast", "Get dressed", "Go to school"],
      question: "What comes after breakfast?",
      options: ["Wake up", "Get dressed", "Go to school"],
      correct: 1,
    },
    {
      title: "School Day",
      sequence: ["Arrive at school", "Sit in class", "Lunch time", "Go home"],
      question: "What happens before lunch time?",
      options: ["Go home", "Sit in class", "Arrive at school"],
      correct: 1,
    },
    {
      title: "After School",
      sequence: ["Come home", "Homework", "Dinner", "Bedtime"],
      question: "What comes after homework?",
      options: ["Homework", "Dinner", "Come home"],
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
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-600">Time Sequencing</h2>
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
          <h3 className="text-2xl font-bold text-purple-600 mb-4">{scenarios[currentScenario].title}</h3>

          <div className="flex justify-between mb-6">
            {scenarios[currentScenario].sequence.map((step, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center flex-1"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 mb-2">
                  {i + 1}
                </div>
                <p className="text-sm text-center text-gray-600">{step}</p>
                {i < scenarios[currentScenario].sequence.length - 1 && <div className="w-8 h-1 bg-blue-300 mt-2"></div>}
              </motion.div>
            ))}
          </div>

          <p className="text-xl font-bold text-gray-800 mb-4">{scenarios[currentScenario].question}</p>

          <div className="grid grid-cols-2 gap-4">
            {scenarios[currentScenario].options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => handleAnswer(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
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
              className="h-full bg-blue-500"
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
