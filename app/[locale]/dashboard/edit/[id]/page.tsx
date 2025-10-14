"use client"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { RichTextEditorWrapper } from "@/components/rich-text-editor-wrapper"
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Loader2
} from "lucide-react"
import Link from "next/link"

interface MediaFile {
  id: string
  file?: File
  preview?: string
  type: 'image' | 'video'
  url?: string
}

interface Post {
  _id: string
  title: string
  content: string
  excerpt: string
  status: string
  category: string
  tags: string[]
  media: Array<{
    type: 'image' | 'video'
    url: string
  }>
  createdAt: string
  updatedAt: string
}

export default function EditPost() {
  const { user, token } = useAuth()
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  const locale = params.locale as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Form state
  const [post, setPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState("")
  const [status, setStatus] = useState<"draft" | "published" | "pending">(
    user?.role === 'author' ? "pending" : "draft"
  )
  
  // Media state
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [uploadingMedia, setUploadingMedia] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`)
      return
    }
    
    if (postId) {
      fetchPost()
    }
  }, [user, postId, locale])

  const fetchPost = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.post) {
          const postData = data.post
          
          // Process MongoDB post data
          setPost(postData)
          setTitle(postData.title || "")
          setContent(postData.content || "")
          setExcerpt(postData.excerpt || "")
          // For authors, always set status to pending; for others, use the post's actual status
          setStatus(user?.role === 'author' ? "pending" : (postData.status || "draft"))
          setCategory(postData.category || "")
          setTags(postData.tags?.join(', ') || "")
          
          // Set media files if they exist
          if (postData.media && postData.media.length > 0) {
            const mediaFiles = postData.media.map((media: any, index: number) => ({
              id: `existing_${index}`,
              type: media.type,
              url: media.url
            }))
            setMediaFiles(mediaFiles)
          }
        } else {
          console.error('Invalid response format:', data)
          router.push(`/${locale}/dashboard`)
        }
      } else {
        console.error('Failed to fetch post')
        router.push(`/${locale}/dashboard`)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
      router.push(`/${locale}/dashboard`)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploadingMedia(true)
    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const preview = URL.createObjectURL(file)
          const mediaFile: MediaFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            preview,
            type: 'image'
          }
          
          // Upload to server
          const formData = new FormData()
          formData.append('file', file)
          
          const response = await fetch('/api/upload/image', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            mediaFile.url = data.url
          }
          
          setMediaFiles(prev => [...prev, mediaFile])
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error)
    } finally {
      setUploadingMedia(false)
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setUploadingMedia(true)
    try {
      for (const file of Array.from(files)) {
        if (file.type.startsWith('video/')) {
          const preview = URL.createObjectURL(file)
          const mediaFile: MediaFile = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            preview,
            type: 'video'
          }
          
          // Upload to server/BunnyCDN
          const formData = new FormData()
          formData.append('file', file)
          
          const response = await fetch('/api/upload/video', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          })

          if (response.ok) {
            const data = await response.json()
            mediaFile.url = data.url
          }
          
          setMediaFiles(prev => [...prev, mediaFile])
        }
      }
    } catch (error) {
      console.error('Error uploading videos:', error)
    } finally {
      setUploadingMedia(false)
    }
  }

  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => {
      const file = prev.find(f => f.id === id)
      if (file && file.preview) {
        URL.revokeObjectURL(file.preview)
      }
      return prev.filter(f => f.id !== id)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !content.trim()) {
      alert("Please fill in the title and content")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          status,
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          media: mediaFiles.map(m => ({
            id: m.id,
            type: m.type,
            url: m.url || m.preview
          }))
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          router.push(`/${locale}/dashboard`)
        } else {
          alert(data.error || "Failed to update post")
        }
      } else {
        const error = await response.json()
        alert(error.error || error.message || "Failed to update post")
      }
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Failed to update post. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDraft = async () => {
    setStatus("draft")
    const form = document.querySelector('form')
    if (form) {
      form.requestSubmit()
    }
  }

  const handlePublish = async () => {
    setStatus("publish")
    const form = document.querySelector('form')
    if (form) {
      form.requestSubmit()
    }
  }

  const handleQuickPublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill in the title and content")
      return
    }

    setSaving(true)
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          status: "published",
          category,
          tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
          media: mediaFiles.map(m => ({
            id: m.id,
            type: m.type,
            url: m.url || m.preview
          }))
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          router.push(`/${locale}/dashboard`)
        } else {
          alert(data.error || "Failed to publish post")
        }
      } else {
        const error = await response.json()
        alert(error.error || error.message || "Failed to publish post")
      }
    } catch (error) {
      console.error("Error publishing post:", error)
      alert("Failed to publish post. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <Link href={`/${locale}/dashboard`}>
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="renas-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/dashboard`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Post
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Update your content
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving || !title.trim() || !content.trim()}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            {user?.role === 'admin' && post?.status === 'pending' && (
              <Button
                onClick={handleQuickPublish}
                disabled={saving || !title.trim() || !content.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Eye className="h-4 w-4 mr-2" />
                Quick Publish
              </Button>
            )}
            <Button
              onClick={handlePublish}
              disabled={saving || !title.trim() || !content.trim()}
            >
              <Eye className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Post Title */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="text-lg font-medium">
                      Post Title *
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter your post title..."
                      className="mt-2 text-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="excerpt" className="text-lg font-medium">
                      Excerpt
                    </Label>
                    <textarea
                      id="excerpt"
                      value={excerpt}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Brief description of your post..."
                      className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>

              {/* Rich Text Editor */}
              <Card className="p-6">
                <Label className="text-lg font-medium mb-4 block">
                  Content *
                </Label>
                <RichTextEditorWrapper
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your post..."
                />
              </Card>

              {/* Media Upload */}
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-medium">
                      Media Files
                    </Label>
                    <div className="flex gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={uploadingMedia}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Upload Images
                        </Button>
                      </label>
                      
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="video/*"
                          multiple
                          onChange={handleVideoUpload}
                          className="hidden"
                          disabled={uploadingMedia}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={uploadingMedia}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Upload Videos
                        </Button>
                      </label>
                    </div>
                  </div>

                  {/* Media Preview */}
                  {mediaFiles.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {mediaFiles.map((media) => (
                        <div key={media.id} className="relative group">
                          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                            {media.type === 'image' ? (
                              <img
                                src={media.url || media.preview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video
                                src={media.url || media.preview}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMediaFile(media.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                          <div className="mt-1 text-xs text-gray-500 truncate">
                            {media.file?.name || 'Media file'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Publish Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                      disabled={user?.role === 'author'}
                    >
                      {user?.role === 'author' ? (
                        <option value="pending">Pending Review (Author posts require admin approval)</option>
                      ) : (
                        <>
                          <option value="draft">Draft</option>
                          <option value="pending">Pending Review</option>
                          <option value="published">Published</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </Card>

              {/* Categories & Tags */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Categories & Tags</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                    >
                      <option value="">Select Category</option>
                      <option value="daily-news">Daily News</option>
                      <option value="charity">Charity</option>
                      <option value="sports">Sports</option>
                      <option value="woman">Woman</option>
                      <option value="political-news">Political News</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="tag1, tag2, tag3..."
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </Card>

              {/* Post Info */}
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-4">Post Information</h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Created: {new Date(post.createdAt).toLocaleDateString()}</p>
                  <p>Modified: {new Date(post.updatedAt).toLocaleDateString()}</p>
                  <p>Characters: {content.length}</p>
                  <p>Words: {content.split(/\s+/).filter(Boolean).length}</p>
                  <p>Images: {mediaFiles.filter(m => m.type === 'image').length}</p>
                  <p>Videos: {mediaFiles.filter(m => m.type === 'video').length}</p>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
