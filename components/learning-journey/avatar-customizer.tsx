"use client"

import { motion } from "framer-motion"
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
      console.log("[v0] Error fetching avatar:", error)
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
      console.log("[v0] Error saving avatar:", error)
    }
  }

  const colorOptions = {
    backgroundColor: ["#FFE5B4", "#FFB6C1", "#87CEEB", "#98FB98", "#FFA500", "#DDA0DD"],
    skinColor: ["#F4A460", "#DEB887", "#D2B48C", "#CD853F"],
    hairColor: ["#8B4513", "#000000", "#FF6347", "#FFD700", "#4169E1"],
    eyeColor: ["#000000", "#0000FF", "#00AA00", "#FF0000", "#8B4513"],
    mouthColor: ["#FF69B4", "#FF0000", "#FF4500", "#8B008B"],
  }

  const accessories = ["😎", "🎩", "👑", "🌟"]

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50"
    >
      <motion.div
        initial={{ scale: 0, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">Customize Your Avatar</h2>

        {/* Avatar Preview */}
        <motion.div
          className="flex justify-center mb-8 text-9xl"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center text-6xl shadow-lg"
            style={{ backgroundColor: avatarConfig.backgroundColor }}
          >
            😊
          </div>
        </motion.div>

        {/* Color Customization */}
        <div className="space-y-6">
          {/* Background Color */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Background Color</label>
            <div className="flex gap-3 flex-wrap">
              {colorOptions.backgroundColor.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setAvatarConfig({ ...avatarConfig, backgroundColor: color })}
                  className={`w-12 h-12 rounded-full ring-4 transition-all ${
                    avatarConfig.backgroundColor === color ? "ring-gray-900 scale-110" : "ring-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Hair Color */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Hair Color</label>
            <div className="flex gap-3 flex-wrap">
              {colorOptions.hairColor.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setAvatarConfig({ ...avatarConfig, hairColor: color })}
                  className={`w-12 h-12 rounded-full ring-4 transition-all ${
                    avatarConfig.hairColor === color ? "ring-gray-900 scale-110" : "ring-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Eye Color */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Eye Color</label>
            <div className="flex gap-3 flex-wrap">
              {colorOptions.eyeColor.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setAvatarConfig({ ...avatarConfig, eyeColor: color })}
                  className={`w-12 h-12 rounded-full ring-4 transition-all ${
                    avatarConfig.eyeColor === color ? "ring-gray-900 scale-110" : "ring-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Mouth Color */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Mouth Color</label>
            <div className="flex gap-3 flex-wrap">
              {colorOptions.mouthColor.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setAvatarConfig({ ...avatarConfig, mouthColor: color })}
                  className={`w-12 h-12 rounded-full ring-4 transition-all ${
                    avatarConfig.mouthColor === color ? "ring-gray-900 scale-110" : "ring-gray-300"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">Accessories</label>
            <div className="flex gap-3 flex-wrap">
              {accessories.map((acc) => (
                <motion.button
                  key={acc}
                  whileHover={{ scale: 1.15 }}
                  onClick={() => {
                    const newAccessories = avatarConfig.accessories?.includes(acc)
                      ? avatarConfig.accessories.filter((a) => a !== acc)
                      : [...(avatarConfig.accessories || []), acc]
                    setAvatarConfig({ ...avatarConfig, accessories: newAccessories })
                  }}
                  className={`text-4xl p-3 rounded-lg ring-4 transition-all ${
                   avatarConfig.accessories?.includes(acc) ? "ring-blue-500 bg-blue-100 scale-110" : "ring-gray-300"
                  }`}
                >
                  {acc}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault()
              saveAvatarConfig()
            }}
            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all"
          >
            💾 Save Avatar
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
