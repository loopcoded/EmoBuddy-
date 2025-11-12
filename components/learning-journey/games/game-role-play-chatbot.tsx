"use client"

import { useState } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

const conversations = [
  {
    id: 1,
    avatar: "🧒",
    message: "Hi! My name is Alex. What is your name?",
    responses: [
      { text: "My name is Sam. Nice to meet you!", correct: true },
      { text: "I don't want to talk.", correct: false },
      { text: "That's cool.", correct: false },
    ],
  },
  {
    id: 2,
    avatar: "🧒",
    message: "I am building a tower with blocks. Do you want to play?",
    responses: [
      { text: "Yes, I would like to play with you!", correct: true },
      { text: "No, go away.", correct: false },
      { text: "Maybe later.", correct: false },
    ],
  },
  {
    id: 3,
    avatar: "🧒",
    message: "Can I borrow your pencil?",
    responses: [
      { text: "Here you go.", correct: true },
      { text: "No, it's mine.", correct: false },
      { text: "I don't have one.", correct: false },
    ],
  },
  {
    id: 4,
    avatar: "🧒",
    message: "I'm feeling sad today.",
    responses: [
      { text: "I'm sorry to hear that. I can sit with you.", correct: true },
      { text: "That's not my problem.", correct: false },
      { text: "Okay, bye.", correct: false },
    ],
  },
  {
    id: 5,
    avatar: "👦",
    message: "You did a great job on that drawing!",
    responses: [
      { text: "Thank you! That makes me happy.", correct: true },
      { text: "I don't care.", correct: false },
      { text: "No, it's bad.", correct: false },
    ],
  },
  {
    id: 6,
    avatar: "🧒",
    message: "I made a mistake and knocked over your blocks.",
    responses: [
      { text: "I'm sorry. Let me help you rebuild.", correct: true },
      { text: "It's not my fault.", correct: false },
      { text: "I don't care.", correct: false },
    ],
  },
  {
    id: 7,
    avatar: "🧒",
    message: "Do you want to play tag?",
    responses: [
      { text: "Yes, that sounds fun! Let's play!", correct: true },
      { text: "No, tag is boring.", correct: false },
      { text: "I'm too tired.", correct: false },
    ],
  },
  {
    id: 8,
    avatar: "🧒",
    message: "I have to go home now. See you tomorrow!",
    responses: [
      { text: "Goodbye! I had fun with you. See you tomorrow!", correct: true },
      { text: "I don't care. Bye.", correct: false },
      { text: "Don't go.", correct: false },
    ],
  },
]

export default function GameRolePlayChatbot({ onComplete, onBack }: GameProps) {
  const [currentConversation, setCurrentConversation] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedResponse, setSelectedResponse] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)

  const conversation = conversations[currentConversation]
  const allComplete = currentConversation === conversations.length

  const handleResponseClick = (index: number) => {
    if (isAnswered) return
    setSelectedResponse(index)
    setIsAnswered(true)

    if (conversation.responses[index].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentConversation < conversations.length - 1) {
      setCurrentConversation(currentConversation + 1)
      setSelectedResponse(null)
      setIsAnswered(false)
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
          <h2 className="text-2xl font-bold text-center text-pink-600">Role-Play Chat</h2>
          <div className="text-2xl">
            ✨ {score}/{conversations.length}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentConversation / conversations.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-pink-400 to-rose-600 rounded-full"
          />
        </div>

        {!allComplete ? (
          <>
            {/* Avatar and message */}
            <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="text-6xl">{conversation.avatar}</div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white rounded-2xl p-4 shadow-md flex-1"
                >
                  <p className="text-lg font-semibold text-gray-800">{conversation.message}</p>
                </motion.div>
              </div>
            </div>

            {/* Response options */}
            <p className="text-lg font-bold text-center mb-4 text-gray-800">How should you respond?</p>
            <div className="space-y-3 mb-8">
              {conversation.responses.map((response, index) => (
                <motion.button
                  key={index}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  onClick={() => handleResponseClick(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl font-semibold text-lg transition-all text-left ${
                    !isAnswered
                      ? "bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:shadow-lg cursor-pointer"
                      : selectedResponse === index
                        ? response.correct
                          ? "bg-gradient-to-r from-green-400 to-green-500 text-white ring-4 ring-green-300"
                          : "bg-gradient-to-r from-red-400 to-red-500 text-white ring-4 ring-red-300"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {response.text}
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            {isAnswered && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`text-center p-4 rounded-xl mb-6 text-lg font-bold ${
                  conversation.responses[selectedResponse!].correct
                    ? "bg-gradient-to-r from-green-200 to-green-100 text-green-800"
                    : "bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800"
                }`}
              >
                {conversation.responses[selectedResponse!].correct
                  ? "✅ Great response! That's kind and polite!"
                  : "💭 Let's use a kinder response next time!"}
              </motion.div>
            )}

            {/* Next button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
              >
                {currentConversation < conversations.length - 1 ? "Next Chat →" : "Finish Game"}
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
            <p className="text-3xl font-bold text-pink-600 mb-2">Chat Master!</p>
            <p className="text-xl text-gray-700 mb-2">
              You scored: {score}/{conversations.length}
            </p>
            <p className="text-lg text-gray-600 mb-6">You learned how to have kind conversations!</p>
            <button
              onClick={() => onComplete(8, 8)}
              className="w-full py-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
