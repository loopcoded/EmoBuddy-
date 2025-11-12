"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LearningPage from "./learning-page"
import SettingsPage from "./settings-page"
import { AvatarDisplay } from "./avatar-generator"

interface ChildProfile {
  _id: string
  name: string
  age: number
  gender: string
  autismSupportLevel: number
  currentLevel: number
  avatarConfig?: AvatarConfig
  emotionHistory: Array<{ timestamp: string; emotion: string }>
  progressHistory: Array<{ level: number; completedAt: string }>
}

interface AvatarConfig {
  seed?: string
  style?: string
}

export default function ChildFrontPage({ childID }: { childID: string }) {
  const [profile, setProfile] = useState<ChildProfile | null>(null)
  const [started, setStarted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!childID) return

    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/child-profile/${childID}`)
        const data = await res.json()
        setProfile(data?.data || data)
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [childID])

  if (loading) return <LoadingScreen message="Loading your profile..." />
  if (!profile) return <LoadingScreen message="Profile not found" />

  if (showSettings) return <SettingsPage profile={profile} onClose={() => setShowSettings(false)} childID={childID} />
  if (started) return <LearningPage childID={childID} profile={profile as unknown as any} />

  return (
    <div
      className="min-h-screen py-12 px-4 relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PHOTO-2025-11-10-12-56-37-ULgAKjcWHcqy9rIhwl7uuItAdopcoK.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-white/35 z-0" />
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex justify-end mb-8">
          <Button onClick={() => setShowSettings(true)} variant="ghost" className="font-semibold text-gray-700">
            ⚙️ Parent Settings
          </Button>
        </div>

        <Card className="p-12 bg-white/90 backdrop-blur border-0 shadow-xl text-center">
          <div className="mb-8 flex justify-center relative group">
            <button
              onClick={() => setShowSettings(true)}
              className="relative hover:opacity-80 transition cursor-pointer"
            >
              <AvatarDisplay
                config={profile.avatarConfig || { seed: "default", style: "avataaars" }}
                size="lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-mint-400 rounded-full p-2 text-2xl group-hover:scale-110 transition">
                ✨
              </div>
            </button>
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
              Click to edit
            </span>
          </div>

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Hello,{profile.name}!</h1>
          <p className="text-gray-600 text-lg mb-12">Ready to learn and grow today?</p>

          <Button
            onClick={() => setStarted(true)}
            className="px-16 py-8 text-2xl font-bold rounded-full bg-linear-to-r from-mint-400 to-blue-400 text-white shadow-xl"
          >
            START
          </Button>

          <p className="text-gray-500 text-sm mt-8">
            Level {profile.currentLevel} • Support Level {profile.autismSupportLevel}
          </p>
        </Card>
      </div>
    </div>
  )
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-linear-to-r from-mint-400 to-blue-400 animate-pulse mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">{message}</p>
      </div>
    </div>
  )
}
