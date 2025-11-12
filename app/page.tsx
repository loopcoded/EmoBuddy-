"use client"

import { useState, useEffect } from "react"
import PublicInfoPage from "@/components/public-info-page"
import ChildFrontPage from "@/components/child-front-page"

export default function Home() {
  const [childID, setChildID] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedChildID = localStorage.getItem("childID")
    setChildID(storedChildID)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-pink-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-mint-400 animate-pulse mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading EmoBuddy...</p>
        </div>
      </div>
    )
  }

  return childID ? <ChildFrontPage childID={childID} /> : <PublicInfoPage />
}
