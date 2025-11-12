"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ChildProfile {
  _id: string
  name: string
  age: number
  gender: string
  autismSupportLevel: number
}

interface SettingsPageProps {
  profile: ChildProfile
  onClose: () => void
  childID: string
}

export default function SettingsPage({ profile, onClose, childID }: SettingsPageProps) {
  const handleLogout = () => {
    localStorage.removeItem("childID")
    window.location.reload()
  }

  const handleDeleteProfile = async () => {
    if (confirm("Are you sure? This will delete your child's profile.")) {
      try {
        await fetch(`/api/delete-child/${childID}`, { method: "DELETE" })
        handleLogout()
      } catch (error) {
        console.error("Failed to delete profile:", error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Parent Settings</h1>

        <Card className="p-8 bg-white/90 backdrop-blur border-0 shadow-xl mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Child Profile</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-semibold text-gray-800">{profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Support Level:</span>
              <span className="font-semibold text-gray-800">Level {profile.autismSupportLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-semibold text-gray-800">{profile.gender}</span>
            </div>
          </div>

          <div className="border-t pt-6 space-y-3">
            <p className="text-gray-600 text-sm mb-4">Child ID (for future login):</p>
            <div className="p-3 bg-gray-100 rounded-lg font-mono text-sm text-gray-800">{childID}</div>
          </div>
        </Card>

        <Card className="p-8 bg-white/90 backdrop-blur border-0 shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Actions</h2>
          <div className="space-y-3">
            <Button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-mint-400 to-blue-400 hover:from-mint-500 hover:to-blue-500 text-white font-semibold"
            >
              Back to Child Page
            </Button>
            <Button onClick={handleLogout} variant="outline" className="w-full py-3 rounded-xl bg-transparent">
              Logout Child
            </Button>
            <Button onClick={handleDeleteProfile} variant="destructive" className="w-full py-3 rounded-xl">
              Delete Profile
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
