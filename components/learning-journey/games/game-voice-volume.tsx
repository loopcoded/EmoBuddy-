"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

const scenes = [
  {
    id: 1,
    title: "Library 📚",
    description: "A quiet place to read books",
    correct: "Whisper",
    options: ["Whisper", "Soft", "Normal", "Loud", "Shout"],
  },
  {
    id: 2,
    title: "Classroom 🎓",
    description: "Learning with your teacher",
    correct: "Soft",
    options: ["Whisper", "Soft", "Normal", "Loud", "Shout"],
  },
  {
    id: 3,
    title: "Cafeteria 🍽️",
    description: "Eating lunch with friends",
    correct: "Normal",
    options: ["Whisper", "Soft", "Normal", "Loud", "Shout"],
  },
  {
    id: 4,
    title: "Playground 🏃",
    description: "Playing games outside",
    correct: "Loud",
    options: ["Whisper", "Soft", "Normal", "Loud", "Shout"],
  },
  {
    id: 5,
    title: "Bedroom 😴",
    description: "Getting ready for sleep",
    correct: "Soft",
    options: ["Whisper", "Soft", "Normal", "Loud", "Shout"],
  },
  {
    id: 6,
    title: "Movie Theater 🎬",
    description: "Watching a movie",
    correct: "Whisper",
    options: ["Whisper", "Soft", "Normal", "Loud", "Shout"],
  },
  {
    id: 7,
    title: "Swimming Pool 🏊",
    description: "Playing in water",
    correct: "Normal",
    options: ["Whisper", "Soft", "Normal", "Loud", "Shout"],
  },
  {
    id: 8,
    title: "Group Work 👥",
    description: "Working with classmates",
    correct: "Soft",
    options: ["Whisper", "Soft", "Normal", "Loud", "Shout"],
  },
]

const volumeLevels: Record<string, string> = {
  Whisper: "🤫 (very quiet)",
  Soft: "🔇 (quiet)",
  Normal: "🔔 (medium)",
  Loud: "📢 (loud)",
  Shout: "📣 (very loud)",
}

export default function GameVoiceVolume({ onComplete, onBack }: GameProps) {
  const [currentScene, setCurrentScene] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedVolume, setSelectedVolume] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [allComplete, setAllComplete] = useState(false)

  const scene = scenes[currentScene]

  const handleVolumeClick = (volume: string) => {
    if (isAnswered) return
    setSelectedVolume(volume)
    setIsAnswered(true)

    if (volume === scene.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentScene < scenes.length - 1) {
      setCurrentScene(currentScene + 1)
      setSelectedVolume(null)
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
          <h2 className="text-2xl font-bold text-center text-cyan-600">Voice Volume Helper</h2>
          <div className="text-2xl">
            🔊 {score}/{scenes.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentScene + 1) / scenes.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-full"
          />
        </div>

        {!allComplete ? (
          <>
            {/* Scene */}
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 rounded-2xl p-8 mb-8 text-center">
              <p className="text-5xl mb-4">{scene.title.split(" ")[1]}</p>
              <p className="text-2xl font-bold text-cyan-700 mb-2">{scene.title.split(" ")[0]}</p>
              <p className="text-gray-600 text-lg">{scene.description}</p>
            </div>

            {/* Question */}
            <p className="text-lg font-bold text-center mb-6 text-gray-800">What voice volume should you use?</p>

            {/* Volume options */}
            <div className="space-y-3 mb-8">
              {scene.options.map((volume) => (
                <motion.button
                  key={volume}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  onClick={() => handleVolumeClick(volume)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl font-bold text-lg transition-all flex items-center gap-3 ${
                    !isAnswered
                      ? "bg-gradient-to-r from-cyan-400 to-cyan-500 text-white hover:shadow-lg cursor-pointer"
                      : selectedVolume === volume
                        ? volume === scene.correct
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300"
                          : "bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <span className="text-2xl">{volumeLevels[volume].split(" ")[0]}</span>
                  <span>
                    {volume} {volumeLevels[volume].split(" ").slice(1).join(" ")}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center p-4 rounded-xl mb-6 text-lg font-bold ${
                  selectedVolume === scene.correct
                    ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800"
                    : "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800"
                }`}
              >
                {selectedVolume === scene.correct
                  ? `✅ Right! Use ${scene.correct} voice!`
                  : `The correct answer is ${scene.correct} voice.`}
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && selectedVolume !== scene.correct ? (
              <button
                onClick={() => {
                  setSelectedVolume(null)
                  setIsAnswered(false)
                }}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                Try Again
              </button>
            ) : null}

            {isAnswered && selectedVolume === scene.correct && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                {currentScene < scenes.length - 1 ? "Next Scene →" : "Finish Game"}
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
            <p className="text-3xl font-bold text-cyan-600 mb-2">Voice Expert!</p>
            <p className="text-xl text-gray-700 mb-2">
              You scored: {score}/{scenes.length}
            </p>
            <p className="text-lg text-gray-600 mb-6">You know the right volume for every place!</p>
            <button
              onClick={() => onComplete(8, 8)}
              className="w-full py-3 bg-gradient-to-r from-cyan-400 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
