"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, Pencil } from "lucide-react"

export const Profile = () => {
  const [username, setUsername] = useState("yuvan")
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(username)

  const handleEdit = () => {
    setEditValue(username)
    setIsEditing(true)
  }

  const handleSave = () => {
    setUsername(editValue)
    setIsEditing(false)
  }

  return (
    <div className="space-y-4 mt-10">
      <div className="w-20 h-20 bg-blue-500 border-2 border-blue-400 rounded-full mx-auto" />
      <div className="text-center space-y-2">
        {isEditing ? (
          <div className="flex items-center gap-2 justify-center">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-40"
            />
            <Button size="icon" onClick={handleSave}>
              <Check />
            </Button>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-semibold">{username}</h2>
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Pencil /> Edit Profile
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
