"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

export default function GamePerspectiveTaking({ onComplete, onBack }: GameProps) {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [score, setScore] = useState(0)

  const scenarios = [
    {
      title: "Someone is Crying",
      situation: "Your friend looks upset and is crying.",
      question: "What might they be feeling?",
      options: ["Happy", "Sad or upset", "Angry"],
      correct: 1,
    },
    {
      title: "Someone is Smiling",
      situation: "Your classmate got 100% on a test and is smiling big.",
      question: "How do you think they feel?",
      options: ["Sad", "Proud and happy", "Scared"],
      correct: 1,
    },
    {
      title: "Someone Dropped Their Book",
      situation: "A student dropped all their books and papers on the floor.",
      question: "How might they be feeling?",
      options: ["Comfortable", "Embarrassed or frustrated", "Excited"],
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
    <div className="min-h-screen bg-gradient-to-b from-pink-200 to-rose-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-pink-600">Perspective Taking</h2>
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
          <h3 className="text-2xl font-bold text-pink-600 mb-4">{scenarios[currentScenario].title}</h3>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-pink-100 rounded-2xl p-6 mb-6 text-center"
          >
            <div className="text-6xl mb-4">😊</div>
            <p className="text-lg text-gray-800">{scenarios[currentScenario].situation}</p>
          </motion.div>

          <p className="text-xl font-bold text-gray-800 mb-4">{scenarios[currentScenario].question}</p>

          <div className="grid grid-cols-2 gap-3">
            {scenarios[currentScenario].options.map((option, i) => (
              <motion.button
                key={i}
                onClick={() => handleAnswer(i)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-400 to-rose-500 text-white p-4 rounded-2xl font-bold hover:shadow-lg transition-all"
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
              className="h-full bg-pink-500"
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
