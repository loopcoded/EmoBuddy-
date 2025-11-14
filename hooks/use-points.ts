"use client"

import { useState, useEffect } from "react"

export interface ColorItem {
  id: string
  name: string
  color: string
  cost: number
  owned: boolean
}

export function usePoints() {
  const [points, setPoints] = useState(0)
  const [ownedColors, setOwnedColors] = useState<string[]>([])
  const [ownedDrawings, setOwnedDrawings] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem("socialSkillsPoints")
    const savedColors = localStorage.getItem("socialSkillsColors")
    const savedDrawings = localStorage.getItem("socialSkillsDrawings")

    if (savedPoints) setPoints(Number.parseInt(savedPoints))
    if (savedColors) setOwnedColors(JSON.parse(savedColors))
    if (savedDrawings) {
      setOwnedDrawings(JSON.parse(savedDrawings))
    } else {
      setOwnedDrawings(["butterfly"]) // First drawing is free by default
    }
  }, [])

  // Save to localStorage when points change
  useEffect(() => {
    localStorage.setItem("socialSkillsPoints", points.toString())
  }, [points])

  // Save to localStorage when colors change
  useEffect(() => {
    localStorage.setItem("socialSkillsColors", JSON.stringify(ownedColors))
  }, [ownedColors])

  useEffect(() => {
    localStorage.setItem("socialSkillsDrawings", JSON.stringify(ownedDrawings))
  }, [ownedDrawings])

  const addPoints = (amount: number) => {
    setPoints((prev) => prev + amount)
  }

  const spendPoints = (amount: number) => {
    if (points >= amount) {
      setPoints((prev) => prev - amount)
      return true
    }
    return false
  }

  const buyColor = (colorId: string, cost: number) => {
    if (spendPoints(cost)) {
      setOwnedColors((prev) => [...prev, colorId])
      return true
    }
    return false
  }

  const hasColor = (colorId: string) => {
    return ownedColors.includes(colorId)
  }

  const buyDrawing = (drawingId: string, cost: number) => {
    if (ownedDrawings.includes(drawingId)) return false // Already owned

    if (cost === 0 || spendPoints(cost)) {
      setOwnedDrawings((prev) => [...prev, drawingId])
      return true
    }
    return false
  }

  const hasDrawing = (drawingId: string) => {
    return ownedDrawings.includes(drawingId)
  }

  return {
    points,
    ownedColors,
    ownedDrawings,
    addPoints,
    spendPoints,
    buyColor,
    hasColor,
    buyDrawing,
    hasDrawing,
  }
}
