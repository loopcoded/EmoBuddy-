"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import ParentRegistrationForm from "./parent-registration-form"

export default function PublicInfoPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-11-10-12-54-54-jwZynldQXYrikcuqC4Vv25bdojgPhq.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/40 z-0" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 text-pretty">Welcome to EmoBuddy</h1>
          <p className="text-xl text-gray-600 text-balance">
            A gentle companion for learning social and emotional skills
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-8 bg-white/80 backdrop-blur border-0 shadow-lg">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Social Skills</h3>
            <p className="text-gray-600">
              Learn to understand emotions, communicate, and build meaningful connections through interactive
              activities.
            </p>
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur border-0 shadow-lg">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Gamified Learning</h3>
            <p className="text-gray-600">
              Progress through engaging levels with rewards and celebrations designed just for you.
            </p>
          </Card>

          <Card className="p-8 bg-white/80 backdrop-blur border-0 shadow-lg">
            <div className="text-4xl mb-4">💚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Personalized Support</h3>
            <p className="text-gray-600">
              Adaptive learning that adjusts to your pace and comfort level throughout your journey.
            </p>
          </Card>
        </div>

        {/* Main CTA */}
        <div className="text-center">
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="px-12 py-8 text-xl font-semibold rounded-full bg-gradient-to-r from-mint-400 to-blue-400 hover:from-mint-500 hover:to-blue-500 text-white shadow-xl"
            >
              Register Your Child
            </Button>
          ) : (
            <ParentRegistrationForm onClose={() => setShowForm(false)} />
          )}
        </div>

        {/* Info Section */}
        <div className="mt-16 p-8 bg-white/60 backdrop-blur rounded-3xl border-2 border-white shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">About EmoBuddy</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            EmoBuddy is specially designed for autistic children ages 7–12. Our platform combines cutting-edge emotion
            recognition technology with evidence-based teaching methods to create a safe, supportive learning
            environment.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Each child's experience is personalized based on their autism support level, ensuring that learning feels
            comfortable and achievable every step of the way.
          </p>
        </div>
      </div>
    </div>
  )
}
