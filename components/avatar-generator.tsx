"use client"

import { useMemo } from "react"

interface AvatarConfig {
  seed?: string
  style?: string
}

/**
 * Displays a child's avatar using DiceBear API.
 * Automatically falls back to a default avatar if config is undefined or incomplete.
 */
export function AvatarDisplay({
  config,
  size = "md",
}: {
  config?: AvatarConfig
  size?: "sm" | "md" | "lg"
}) {
  const sizeMap = { sm: 48, md: 80, lg: 120 }

  const avatarUrl = useMemo(() => {
    // ✅ Handle missing or undefined config safely
    const seed = config?.seed || "default"
    const style = config?.style || "avataaars"
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`
  }, [config?.seed, config?.style])

  return (
    <img
      src={avatarUrl || "/placeholder.svg"}
      alt="Child Avatar"
      className="rounded-full border-4 border-mint-400"
      width={sizeMap[size]}
      height={sizeMap[size]}
    />
  )
}

/**
 * Generates a random avatar config for new children.
 */
export function generateRandomAvatar(): AvatarConfig {
  const randomSeed = Math.random().toString(36).substring(7)
  return {
    seed: randomSeed,
    style: "avataaars",
  }
}
