"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface LikeSaveButtonsProps {
  postId: string
  initialLiked?: boolean
  initialSaved?: boolean
  onLikeChange?: (liked: boolean) => void
  onSaveChange?: (saved: boolean) => void
}

export function LikeSaveButtons({ 
  postId, 
  initialLiked = false, 
  initialSaved = false,
  onLikeChange,
  onSaveChange 
}: LikeSaveButtonsProps) {
  const { user, token } = useAuth()
  const [liked, setLiked] = useState(initialLiked)
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (!user || !token) return

    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: liked ? 'unlike' : 'like' })
      })

      if (response.ok) {
        const newLiked = !liked
        setLiked(newLiked)
        onLikeChange?.(newLiked)
      }
    } catch (error) {
      console.error('Error liking post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user || !token) return

    try {
      setLoading(true)
      const response = await fetch('/api/posts/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          postId, 
          action: saved ? 'unsave' : 'save' 
        })
      })

      if (response.ok) {
        const newSaved = !saved
        setSaved(newSaved)
        onSaveChange?.(newSaved)
      }
    } catch (error) {
      console.error('Error saving post:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLike}
        disabled={loading}
        className={`flex items-center gap-1 ${
          liked 
            ? 'text-red-600 hover:text-red-700' 
            : 'text-gray-600 hover:text-red-600'
        }`}
      >
        <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
        <span className="text-sm">{liked ? 'Liked' : 'Like'}</span>
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        disabled={loading}
        className={`flex items-center gap-1 ${
          saved 
            ? 'text-blue-600 hover:text-blue-700' 
            : 'text-gray-600 hover:text-blue-600'
        }`}
      >
        <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
        <span className="text-sm">{saved ? 'Saved' : 'Save'}</span>
      </Button>
    </div>
  )
}

