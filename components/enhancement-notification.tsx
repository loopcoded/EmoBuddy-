"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface EnhancementNotificationProps {
  enhancements: string[]
  onDismiss: () => void
}

export function EnhancementNotification({ enhancements, onDismiss }: EnhancementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss()
  }

  if (!isVisible) return null

  return (
    <div className="fixed right-6 top-24 z-40 max-w-sm animate-in slide-in-from-right-4">
      <Card className="p-6 bg-gradient-to-br from-purple-200 to-pink-200 border-0 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="text-4xl animate-bounce">👉</div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 mb-2">New Enhancements!</h3>
            <p className="text-sm text-gray-700 mb-3">You've unlocked new avatar enhancements!</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {enhancements.map((enhancement, idx) => (
                <span key={idx} className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-800">
                  {enhancement}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleDismiss} variant="outline" size="sm" className="text-xs bg-transparent">
                Later
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                className="text-xs bg-gradient-to-r from-mint-400 to-blue-400 hover:from-mint-500 hover:to-blue-500 text-white"
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
