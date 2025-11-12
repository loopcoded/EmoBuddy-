"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

const emotionRounds = [
  { emotion: "Happy", emoji: "😊", labels: ["Happy", "Sad", "Angry"] },
  { emotion: "Sad", emoji: "😢", labels: ["Happy", "Sad", "Angry"] },
  { emotion: "Angry", emoji: "😠", labels: ["Happy", "Sad", "Angry"] },
  { emotion: "Crying", emoji: "😭", labels: ["Happy", "Crying", "Scared"] },
  { emotion: "Scared", emoji: "😨", labels: ["Crying", "Scared", "Okay"] },
  { emotion: "Okay", emoji: "😐", labels: ["Okay", "Surprised", "Disgusted"] },
  { emotion: "Surprised", emoji: "😮", labels: ["Surprised", "Okay", "Angry"] },
  { emotion: "Disgusted", emoji: "🤢", labels: ["Disgusted", "Happy", "Sad"] },
]

export default function GameEmotionRecognition({ onComplete, onBack }: GameProps) {
  const [currentRound, setCurrentRound] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [allComplete, setAllComplete] = useState(false)

  const round = emotionRounds[currentRound]

  const handleEmotionClick = (emotion: string) => {
    if (isAnswered) return
    setSelectedAnswer(emotion)
    setIsAnswered(true)
  }

  const handleNext = () => {
    if (currentRound < emotionRounds.length - 1) {
      setCurrentRound(currentRound + 1)
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
          <h2 className="text-2xl font-bold text-center text-red-600">Emotion Recognition</h2>
          <div className="text-2xl">
            {currentRound + 1}/{emotionRounds.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentRound + 1) / emotionRounds.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full"
          />
        </div>

        {!allComplete ? (
          <>
            {/* Emotion face */}
            <div className="bg-gradient-to-br from-red-100 to-red-50 rounded-2xl p-8 mb-8 text-center">
              <p className="text-lg font-semibold text-red-700 mb-4">What emotion is this?</p>
              <p className="text-9xl mb-4 animate-bounce">{round.emoji}</p>
            </div>

            {/* Emotion labels */}
            <div className="space-y-3 mb-8">
              {round.labels.map((label) => (
                <motion.button
                  key={label}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  onClick={() => handleEmotionClick(label)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl font-bold text-lg transition-all ${
                    !isAnswered
                      ? "bg-gradient-to-r from-red-400 to-red-500 text-white hover:shadow-lg cursor-pointer"
                      : selectedAnswer === label
                        ? label === round.emotion
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300"
                          : "bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center p-4 rounded-xl mb-6 text-lg font-bold ${
                  selectedAnswer === round.emotion
                    ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800"
                    : "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800"
                }`}
              >
                {selectedAnswer === round.emotion
                  ? `Great job — that's ${round.emotion}! ${round.emoji}`
                  : `Let's look again. That's ${round.emotion}. ${round.emoji}`}
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && selectedAnswer !== round.emotion ? (
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

            {isAnswered && selectedAnswer === round.emotion && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                {currentRound < emotionRounds.length - 1 ? "Next Emotion →" : "Finish Game"}
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
            <p className="text-3xl font-bold text-red-600 mb-2">Emotion Master!</p>
            <p className="text-xl text-gray-700 mb-6">You recognized all 8 emotions!</p>
            <button
              onClick={() => onComplete(8, 8)}
              className="w-full py-3 bg-gradient-to-r from-red-400 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
