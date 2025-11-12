"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

interface ParentRegistrationFormProps {
  onClose: () => void
}

export default function ParentRegistrationForm({ onClose }: ParentRegistrationFormProps) {
  const [formData, setFormData] = useState({
    parentName: "",
    parentEmail: "",
    phoneNumber: "",
    childName: "",
    childAge: "",
    childGender: "Male",
    autismSupportLevel: "1",
    cameraPermission: false,
    micPermission: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.cameraPermission || !formData.micPermission) {
      setError("Camera and microphone permissions are required for EmoBuddy to work properly.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/register-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok || !data.childID) {
        throw new Error(data.message || "Registration failed")
      }

      // ✅ Save to localStorage so dashboard can find it
      localStorage.setItem("childID", data.childID)

      // ✅ Redirect to main page (ChildFrontPage will load automatically)
      window.location.href = "/"
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto p-8 bg-white/90 backdrop-blur border-0 shadow-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Parent Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Your Information</h3>
          <div className="space-y-4">
            <input
              type="text"
              name="parentName"
              placeholder="Your Full Name"
              value={formData.parentName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-400 outline-none transition"
            />
            <input
              type="email"
              name="parentEmail"
              placeholder="Your Email"
              value={formData.parentEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-400 outline-none transition"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-400 outline-none transition"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Child Information</h3>
          <div className="space-y-4">
            <input
              type="text"
              name="childName"
              placeholder="Child's Name"
              value={formData.childName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-400 outline-none transition"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                name="childAge"
                placeholder="Age (7-12)"
                min="7"
                max="12"
                value={formData.childAge}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-400 outline-none transition"
              />
              <select
                name="childGender"
                value={formData.childGender}
                onChange={handleChange}
                className="px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-400 outline-none transition"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Support Level</h3>
          <select
            name="autismSupportLevel"
            value={formData.autismSupportLevel}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-mint-400 focus:ring-2 focus:ring-mint-400 outline-none transition"
          >
            <option value="1">Level 1 - Minimal Support</option>
            <option value="2">Level 2 - Moderate Support</option>
            <option value="3">Level 3 - Substantial Support</option>
          </select>
        </div>

        <div className="p-4 bg-blue-50 rounded-xl space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              name="cameraPermission"
              checked={formData.cameraPermission}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, cameraPermission: checked as boolean }))
              }
            />
            <span className="text-gray-700">
              <span className="font-semibold text-red-600">*</span> I allow camera access for emotion detection
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox
              name="micPermission"
              checked={formData.micPermission}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, micPermission: checked as boolean }))
              }
            />
            <span className="text-gray-700">
              <span className="font-semibold text-red-600">*</span> I allow microphone access for voice interaction
            </span>
          </label>
        </div>

        {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl">{error}</div>}

        <div className="flex gap-4 pt-4">
          <Button type="button" onClick={onClose} variant="outline" className="flex-1 py-3 rounded-xl">
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-mint-400 to-blue-400 text-white font-semibold"
          >
            {loading ? "Registering..." : "Create Child Profile"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
