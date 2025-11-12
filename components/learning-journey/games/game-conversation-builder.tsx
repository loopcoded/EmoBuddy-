"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface GameProps {
  onComplete: (score: number, total: number) => void
  onBack: () => void
}

const conversations = [
  {
    id: 1,
    title: "Greeting",
    correct: ["Hi!", "How are you?", "I am good."],
    shuffled: ["How are you?", "I am good.", "Hi!"],
  },
  {
    id: 2,
    title: "Playing Together",
    correct: ["We are building blocks.", "Can I play too?", "Yes!"],
    shuffled: ["Can I play too?", "Yes!", "We are building blocks."],
  },
  {
    id: 3,
    title: "Borrowing",
    correct: ["Can I borrow your pencil?", "Sure.", "Thank you."],
    shuffled: ["Sure.", "Thank you.", "Can I borrow your pencil?"],
  },
  {
    id: 4,
    title: "Saying Goodbye",
    correct: ["Bye!", "See you later!", "Okay!"],
    shuffled: ["See you later!", "Okay!", "Bye!"],
  },
  {
    id: 5,
    title: "Complimenting",
    correct: ["Your picture is nice.", "Thank you."],
    shuffled: ["Thank you.", "Your picture is nice."],
  },
  {
    id: 6,
    title: "Showing Care",
    correct: ["Are you okay?", "I am sad.", "I can sit with you."],
    shuffled: ["I can sit with you.", "Are you okay?", "I am sad."],
  },
  {
    id: 7,
    title: "Asking for Help",
    correct: ["Can you help me?", "Yes, I can."],
    shuffled: ["Yes, I can.", "Can you help me?"],
  },
  {
    id: 8,
    title: "Apologizing",
    correct: ["I'm sorry.", "It's okay."],
    shuffled: ["It's okay.", "I'm sorry."],
  },
]

export default function GameConversationBuilder({ onComplete, onBack }: GameProps) {
  const [currentConversation, setCurrentConversation] = useState(0)
  const [ordered, setOrdered] = useState<string[]>([])
  const [remaining, setRemaining] = useState<string[]>([])
  const [completedCount, setCompletedCount] = useState(0)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // ✅ Always sync remaining when current conversation changes
  useEffect(() => {
    const current = conversations[currentConversation]
    if (current) setRemaining(current.shuffled)
  }, [currentConversation])

  const conversation = conversations[currentConversation]
  const allCompleted = completedCount === conversations.length

  // framer-motion's motion.div can change the inferred event type (MouseEvent | TouchEvent | PointerEvent)
  // so accept a loose event here and cast to DragEvent for dataTransfer access.
  const handleDragStart = (e: any, item: string, fromOrdered: boolean) => {
    const ev = e as React.DragEvent
    ev.dataTransfer.effectAllowed = "move"
    ev.dataTransfer.setData("text/plain", item)
    ev.dataTransfer.setData("fromOrdered", String(fromOrdered))
  }

  const handleDragOver = (e: any) => {
    const ev = e as React.DragEvent
    ev.preventDefault()
    ev.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: any, toOrdered: boolean) => {
    const ev = e as React.DragEvent
    ev.preventDefault()
    const item = ev.dataTransfer.getData("text/plain")
    const fromOrdered = ev.dataTransfer.getData("fromOrdered") === "true"

    if (!item) return
    if (fromOrdered === toOrdered) return

    if (fromOrdered) {
      // Move item back to remaining
      setOrdered((prev) => prev.filter((o) => o !== item))
      setRemaining((prev) => [...prev, item])
    } else {
      // Move item to ordered
      setRemaining((prev) => prev.filter((r) => r !== item))
      setOrdered((prev) => [...prev, item])
    }
  }

  const handleCheckOrder = () => {
    if (!conversation) return
    const isCorrectOrder = JSON.stringify(ordered) === JSON.stringify(conversation.correct)
    setIsCorrect(isCorrectOrder)

    if (isCorrectOrder) {
      setTimeout(() => {
        if (currentConversation < conversations.length - 1) {
          setCurrentConversation((prev) => prev + 1)
          setOrdered([])
          setIsCorrect(null)
          setCompletedCount((prev) => prev + 1)
        } else {
          setCompletedCount(conversations.length)
        }
      }, 1500)
    }
  }

  if (!conversation) return null

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 rounded-lg text-gray-800 font-bold hover:bg-gray-300 transition-all"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold text-center text-purple-600">Conversation Builder</h2>
          <div className="text-2xl">✅ {completedCount}/{conversations.length}</div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / conversations.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full"
          />
        </div>

        {!allCompleted ? (
          <>
            <p className="text-xl font-bold text-center mb-8 text-gray-800">
              Arrange the conversation in order:{" "}
              <span className="text-purple-600">{conversation.title}</span>
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              {/* Available items */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, false)}
                className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl p-4 border-2 border-dashed border-blue-300 min-h-32"
              >
                <p className="font-bold text-blue-700 mb-3">Available:</p>
                <div className="space-y-2">
                  {remaining.map((item) => (
                    <motion.div
                      key={item}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item, false)}
                      className="p-3 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg cursor-move hover:shadow-lg transition-all font-semibold"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Ordered items */}
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, true)}
                className="bg-gradient-to-br from-green-100 to-green-50 rounded-xl p-4 border-2 border-dashed border-green-300 min-h-32"
              >
                <p className="font-bold text-green-700 mb-3">Order:</p>
                <div className="space-y-2">
                  {ordered.length === 0 ? (
                    <p className="text-gray-500 italic">Drag items here...</p>
                  ) : (
                    ordered.map((item, index) => (
                      <motion.div
                        key={item + index}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item, true)}
                        className="p-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg cursor-move hover:shadow-lg transition-all font-semibold flex items-center gap-2"
                      >
                        <span className="bg-white text-green-600 w-6 h-6 rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        {item}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Feedback */}
            {isCorrect === true && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-4 rounded-xl mb-6 bg-gradient-to-r from-green-200 to-green-100 text-green-800 text-lg font-bold"
              >
                ✅ Perfect! That's the correct order!
              </motion.div>
            )}

            {isCorrect === false && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center p-4 rounded-xl mb-6 bg-gradient-to-r from-yellow-200 to-yellow-100 text-yellow-800 text-lg font-bold"
              >
                Try again! Check the order of the sentences.
              </motion.div>
            )}

            {/* Check button */}
            <button
              onClick={handleCheckOrder}
              disabled={ordered.length !== conversation.correct.length}
              className={`w-full py-3 rounded-xl font-bold text-lg transition-all ${
                ordered.length === conversation.correct.length
                  ? "bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:shadow-lg cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Check Order
            </button>
          </>
        ) : (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="text-8xl mb-4 animate-bounce">🎉</div>
            <p className="text-3xl font-bold text-purple-600 mb-2">Conversations Mastered!</p>
            <p className="text-xl text-gray-700 mb-6">You learned {conversations.length} polite conversations!</p>
            <button
              onClick={() => onComplete(conversations.length, conversations.length)}
              className="w-full py-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg transition-all text-lg"
            >
              Return to Journey
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
