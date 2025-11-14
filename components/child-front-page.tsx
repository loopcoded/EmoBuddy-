"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import LearningPage from "./learning-page"
import SettingsPage from "./settings-page"
import { AvatarDisplay } from "./avatar-generator"
import { motion } from "framer-motion"

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
      {/* Floating animated bubbles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-mint-300/20 to-blue-300/20 backdrop-blur-sm"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-white/35 z-0" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div 
          className="flex justify-end mb-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button 
            onClick={() => setShowSettings(true)} 
            variant="ghost" 
            className="font-semibold text-gray-700 hover:bg-white/60 rounded-full px-6 py-3 transition-all hover:scale-105 active:scale-95"
          >
            ⚙️ Parent Settings
          </Button>
        </motion.div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
          <Card className="p-12 bg-white/95 backdrop-blur-xl border-0 shadow-2xl text-center relative overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-mint-100/30 via-blue-100/30 to-purple-100/30 animate-pulse" />
            
            <div className="relative z-10">
              {/* Avatar with floating animation */}
              <motion.div 
                className="mb-8 flex justify-center relative group"
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <button
                  onClick={() => setShowSettings(true)}
                  className="relative hover:opacity-80 transition cursor-pointer"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <AvatarDisplay
                      config={profile.avatarConfig || { seed: "default", style: "avataaars" }}
                      size="lg"
                    />
                    {/* Sparkle effect around avatar */}
                    <motion.div
                      className="absolute -inset-4 rounded-full border-4 border-mint-300"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -bottom-2 -right-2 bg-gradient-to-br from-mint-400 to-mint-500 rounded-full p-3 text-2xl shadow-lg"
                    animate={{ 
                      rotate: [0, 15, -15, 0],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                  >
                    ✨
                  </motion.div>
                </button>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800/80 text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur">
                  Click to edit
                </span>
              </motion.div>

              {/* Greeting with wave animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-5xl font-bold bg-gradient-to-r from-mint-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-3 flex items-center justify-center gap-3">
                  Hello, {profile.name}!
                  <motion.span
                    animate={{ rotate: [0, 14, -8, 14, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    👋
                  </motion.span>
                </h1>
              </motion.div>

              <motion.p 
                className="text-gray-600 text-xl mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Ready to learn and grow today?
              </motion.p>

              {/* Enhanced START button with pulsing effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring" }}
              >
                <Button
                  onClick={() => setStarted(true)}
                  className="px-20 py-10 text-3xl font-black rounded-full bg-gradient-to-r from-mint-400 via-blue-400 to-purple-400 text-white shadow-2xl relative overflow-hidden group"
                >
                  {/* Animated shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{
                      x: [-200, 400],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                  
                  <motion.span
                    className="relative z-10 flex items-center gap-3"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    START
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🚀
                    </motion.span>
                  </motion.span>
                  
                  {/* Pulsing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-white"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  />
                </Button>
              </motion.div>

              {/* Info badges with entrance animation */}
              <motion.div
                className="flex justify-center gap-4 mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  className="bg-gradient-to-r from-mint-200 to-mint-300 px-6 py-3 rounded-full shadow-lg"
                >
                  <p className="text-sm font-bold text-gray-800">
                    🎯 Level {profile.currentLevel}
                  </p>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="bg-gradient-to-r from-blue-200 to-blue-300 px-6 py-3 rounded-full shadow-lg"
                >
                  <p className="text-sm font-bold text-gray-800">
                    ⭐ Support {profile.autismSupportLevel}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="text-center">
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-r from-mint-400 to-blue-400 mx-auto mb-6"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.p 
          className="text-gray-600 text-xl font-semibold"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  )
}