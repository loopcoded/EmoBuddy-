"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface AvatarCustomizerProps {
  isOpen: boolean
  childID?: string
  onSave: () => void
}

export default function AvatarCustomizer({ isOpen, childID, onSave }: AvatarCustomizerProps) {
  const [avatarConfig, setAvatarConfig] = useState({
    style: "smile",
    backgroundColor: "#FFE5B4",
    skinColor: "#F4A460",
    hairColor: "#8B4513",
    eyeColor: "#000000",
    mouthColor: "#FF69B4",
    accessories: [] as string[],
  })

  useEffect(() => {
    if (isOpen && childID) {
      fetchAvatarConfig()
    }
  }, [isOpen, childID])

  const fetchAvatarConfig = async () => {
    try {
      const response = await fetch(`/api/child-avatar/${childID}`)
      if (response.ok) {
        const data = await response.json()
        setAvatarConfig((prev) => ({
          ...prev,
          ...data,
          accessories: data.accessories || prev.accessories || [],
        }))
      }
    } catch (error) {
      console.log("Error fetching avatar:", error)
    }
  }

  const saveAvatarConfig = async () => {
    try {
      if (!childID) return
      const response = await fetch(`/api/child-avatar/${childID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(avatarConfig),
      })
      if (response.ok) {
        onSave()
      }
    } catch (error) {
      console.log("Error saving avatar:", error)
    }
  }

  const colorOptions = {
    backgroundColor: ["#FFE5B4", "#FFB6C1", "#87CEEB", "#98FB98", "#FFA500", "#DDA0DD", "#FFD700", "#FF6B9D"],
    skinColor: ["#F4A460", "#DEB887", "#D2B48C", "#CD853F", "#FFDAB9", "#F5CBA7"],
    hairColor: ["#8B4513", "#000000", "#FF6347", "#FFD700", "#4169E1", "#9B59B6", "#E91E63"],
    eyeColor: ["#000000", "#0000FF", "#00AA00", "#FF0000", "#8B4513", "#FF1493", "#00CED1"],
    mouthColor: ["#FF69B4", "#FF0000", "#FF4500", "#8B008B", "#FF6347", "#DC143C"],
  }

  const accessories = ["😎", "🎩", "👑", "🌟", "🎀", "🎭", "🦄", "🌈", "⭐", "💫", "🔥", "✨"]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/70 via-purple-900/40 to-black/70 backdrop-blur-sm z-50 p-4"
        >
          {/* Floating sparkles */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            >
              {['⭐', '✨', '💫', '🌟'][Math.floor(Math.random() * 4)]}
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl p-8 max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-purple-300 relative"
          >
            {/* Animated header background */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-t-3xl opacity-20"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ backgroundSize: "200% 100%" }}
            />

            {/* Close button */}
            <motion.button
              onClick={onSave}
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg z-20 border-2 border-white"
            >
              ✕
            </motion.button>

            <motion.h2 
              className="text-4xl font-black text-center mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent relative z-10"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              ✨ Customize Your Avatar ✨
            </motion.h2>

            <motion.p
              className="text-center text-gray-600 font-semibold mb-8 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Make your avatar uniquely YOU!
            </motion.p>

            {/* Avatar Preview with enhanced animation */}
            <motion.div
              className="flex justify-center mb-10 relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 150, delay: 0.4 }}
            >
              <div className="relative">
                {/* Orbiting stars */}
                {[0, 120, 240].map((angle, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-3xl"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    animate={{
                      x: [
                        Math.cos((angle + 0) * Math.PI / 180) * 100,
                        Math.cos((angle + 360) * Math.PI / 180) * 100,
                      ],
                      y: [
                        Math.sin((angle + 0) * Math.PI / 180) * 100,
                        Math.sin((angle + 360) * Math.PI / 180) * 100,
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                      delay: i * 0.4,
                    }}
                  >
                    ✨
                  </motion.div>
                ))}

                {/* Pulsing glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{
                    boxShadow: [
                      `0 0 30px ${avatarConfig.backgroundColor}`,
                      `0 0 60px ${avatarConfig.backgroundColor}`,
                      `0 0 30px ${avatarConfig.backgroundColor}`,
                    ],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                <motion.div
                  animate={{ 
                    rotate: [0, 5, -5, 0],
                    y: [0, -10, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-40 h-40 rounded-full flex items-center justify-center text-7xl shadow-2xl border-8 border-white relative z-10"
                  style={{ backgroundColor: avatarConfig.backgroundColor }}
                >
                  😊
                  {avatarConfig.accessories.map((acc, idx) => (
                    <motion.span
                      key={idx}
                      className="absolute text-5xl"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      style={{
                        top: idx === 0 ? "-20px" : "auto",
                        right: idx === 1 ? "-20px" : "auto",
                        bottom: idx === 2 ? "-20px" : "auto",
                        left: idx === 3 ? "-20px" : "auto",
                      }}
                    >
                      {acc}
                    </motion.span>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Color Customization with enhanced UI */}
            <div className="space-y-8">
              {Object.entries(colorOptions).map(([key, colors], sectionIndex) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + sectionIndex * 0.1 }}
                  className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg border-2 border-purple-200"
                >
                  <label className="block text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-2xl"
                    >
                      🎨
                    </motion.span>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </label>
                  <div className="flex gap-3 flex-wrap">
                    {colors.map((color, idx) => (
                      <motion.button
                        key={color}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.6 + sectionIndex * 0.1 + idx * 0.05 }}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setAvatarConfig({ ...avatarConfig, [key]: color })}
                        className={`w-14 h-14 rounded-full ring-4 transition-all shadow-lg relative ${
                          avatarConfig[key as keyof typeof avatarConfig] === color 
                            ? "ring-purple-600 scale-125 shadow-xl" 
                            : "ring-gray-300 hover:ring-purple-400"
                        }`}
                        style={{ backgroundColor: color }}
                      >
                        {avatarConfig[key as keyof typeof avatarConfig] === color && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold"
                          >
                            ✓
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}

              {/* Accessories with enhanced animations */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 }}
                className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 shadow-lg border-2 border-purple-300"
              >
                <label className="block text-lg font-black text-gray-800 mb-4 flex items-center gap-2">
                  <motion.span
                    animate={{ 
                      rotate: [0, 20, -20, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-2xl"
                  >
                    ✨
                  </motion.span>
                  Accessories (Choose up to 4!)
                </label>
                <div className="flex gap-3 flex-wrap">
                  {accessories.map((acc, idx) => (
                    <motion.button
                      key={acc}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.1 + idx * 0.05 }}
                      whileHover={{ 
                        scale: 1.3, 
                        rotate: [0, -15, 15, 0],
                        y: -10,
                      }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        const newAccessories = avatarConfig.accessories?.includes(acc)
                          ? avatarConfig.accessories.filter((a) => a !== acc)
                          : avatarConfig.accessories.length < 4
                            ? [...(avatarConfig.accessories || []), acc]
                            : avatarConfig.accessories
                        setAvatarConfig({ ...avatarConfig, accessories: newAccessories })
                      }}
                      className={`text-5xl p-4 rounded-2xl ring-4 transition-all shadow-lg relative ${
                        avatarConfig.accessories?.includes(acc) 
                          ? "ring-purple-600 bg-purple-200 scale-110 shadow-xl" 
                          : "ring-gray-300 bg-white hover:ring-purple-400"
                      }`}
                    >
                      {acc}
                      {avatarConfig.accessories?.includes(acc) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-lg"
                        >
                          ✓
                        </motion.div>
                      )}
                    </motion.button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 font-semibold mt-3 text-center">
                  Selected: {avatarConfig.accessories.length} / 4
                </p>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-4 mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault()
                  saveAvatarConfig()
                }}
                className="flex-1 py-5 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-200, 400] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  💾 Save My Awesome Avatar! ✨
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}