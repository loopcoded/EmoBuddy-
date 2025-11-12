"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

const emotions = [
  { emotion: "Nervous", emoji: "😰", description: "Worried, anxious" },
  { emotion: "Proud", emoji: "😊🎉", description: "Happy about doing something good" },
  { emotion: "Excited", emoji: "🤩", description: "Very happy and energetic" },
  { emotion: "Embarrassed", emoji: "😳", description: "Shy, uncomfortable" },
  { emotion: "Angry", emoji: "😠", description: "Very upset" },
  { emotion: "Sad", emoji: "😢", description: "Unhappy, upset" },
  { emotion: "Relaxed", emoji: "😌", description: "Calm and peaceful" },
  { emotion: "Scared", emoji: "😨", description: "Afraid, frightened" },
]

export default function GameFacialBodyLanguage({ onComplete, onBack }: GameProps) {
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [allComplete, setAllComplete] = useState(false)

  const currentEmotion = emotions[currentEmotionIndex]
  const otherEmotions = emotions
    .filter((_, i) => i !== currentEmotionIndex)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
  const options = [currentEmotion, ...otherEmotions].sort(() => Math.random() - 0.5)

  const handleAnswerClick = (selected: typeof currentEmotion) => {
    if (isAnswered) return
    const isCorrect = selected.emotion === currentEmotion.emotion
    setSelectedAnswer(options.indexOf(selected))
    setIsAnswered(true)

    if (isCorrect) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentEmotionIndex < emotions.length - 1) {
      setCurrentEmotionIndex(currentEmotionIndex + 1)
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
          <h2 className="text-2xl font-bold text-center text-indigo-600">Facial & Body Language</h2>
          <div className="text-2xl">
            😊 {score}/{emotions.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentEmotionIndex + 1) / emotions.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
          />
        </div>

        {!allComplete ? (
          <>
            {/* Emotion display */}
            <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-2xl p-8 mb-8 text-center">
              <p className="text-lg font-semibold text-indigo-700 mb-4">How is this person feeling?</p>
              <div className="text-9xl mb-4 animate-bounce">{currentEmotion.emoji}</div>
              <p className="text-gray-600 italic">{currentEmotion.description}</p>
            </div>

            {/* Emotion options */}
            <p className="text-lg font-bold text-center mb-4 text-gray-800">Choose the emotion:</p>
            <div className="grid grid-cols-2 gap-3 mb-8">
              {options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={!isAnswered ? { scale: 1.05 } : {}}
                  onClick={() => handleAnswerClick(option)}
                  disabled={isAnswered}
                  className={`p-4 rounded-xl font-bold transition-all ${
                    !isAnswered
                      ? "bg-gradient-to-r from-indigo-400 to-indigo-500 text-white hover:shadow-lg cursor-pointer"
                      : selectedAnswer === index
                        ? option.emotion === currentEmotion.emotion
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300"
                          : "bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <div className="text-3xl mb-1">{option.emoji}</div>
                  <div className="text-sm">{option.emotion}</div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center p-4 rounded-xl mb-6 text-lg font-bold ${
                  options[selectedAnswer!].emotion === currentEmotion.emotion
                    ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800"
                    : "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800"
                }`}
              >
                {options[selectedAnswer!].emotion === currentEmotion.emotion
                  ? `✅ Right! That's ${currentEmotion.emotion}!`
                  : `Try again! This is ${currentEmotion.emotion}.`}
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && options[selectedAnswer!].emotion !== currentEmotion.emotion ? (
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

            {isAnswered && options[selectedAnswer!].emotion === currentEmotion.emotion && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                {currentEmotionIndex < emotions.length - 1 ? "Next Emotion →" : "Finish Game"}
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
            <p className="text-3xl font-bold text-indigo-600 mb-2">Emotion Expert!</p>
            <p className="text-xl text-gray-700 mb-2">
              You scored: {score}/{emotions.length}
            </p>
            <p className="text-lg text-gray-600 mb-6">You can recognize all these emotions!</p>
            <button
              onClick={() => onComplete(8, 8)}
              className="w-full py-3 bg-gradient-to-r from-indigo-400 to-indigo-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
