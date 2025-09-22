"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Image as ImageIcon, 
  Video, 
  Upload, 
  X, 
  Eye,
  Download,
  Trash2,
  Calendar,
  FileText
} from "lucide-react"

interface MediaFile {
  id: number
  title: string
  filename: string
  mime_type: string
  url: string
  date: string
  author: number
  is_bunny_cdn: boolean
  file_path?: string
}

interface MediaLibraryProps {
  locale: string
}

export function MediaLibrary({ locale }: MediaLibraryProps) {
  const { token } = useAuth()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (token) {
      fetchMediaFiles()
    }
  }, [token, activeTab])

  const fetchMediaFiles = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      let url = "/api/media"
      
      if (activeTab !== "all") {
        url += `?type=${activeTab}`
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.media) {
          setMediaFiles(data.media)
        }
      }
    } catch (error) {
      console.error("Error fetching media:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = event.target.files
    if (!files || !token) return

    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        
        const endpoint = type === 'image' ? '/api/upload/image' : '/api/upload/video'
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        })

        if (response.ok) {
          const result = await response.json()
          // Refresh media library after successful upload
          fetchMediaFiles()
        }
      }
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <ImageIcon className="h-4 w-4" />
    } else if (mimeType.startsWith('video/')) {
      return <Video className="h-4 w-4" />
    }
    return <FileText className="h-4 w-4" />
  }

  const filteredMedia = mediaFiles.filter(file => {
    if (activeTab === "all") return true
    if (activeTab === "image") return file.mime_type.startsWith('image/')
    if (activeTab === "video") return file.mime_type.startsWith('video/')
    return false
  })

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Upload Media
          </h3>
          <div className="flex gap-2">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, 'image')}
                className="hidden"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
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
                onChange={(e) => handleFileUpload(e, 'video')}
                className="hidden"
                disabled={uploading}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
              >
                <Video className="h-4 w-4 mr-2" />
                Upload Videos
              </Button>
            </label>
          </div>
        </div>
        
        {uploading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Uploading...</p>
          </div>
        )}
      </Card>

      {/* Media Library */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Media</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-1"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredMedia.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex justify-center gap-2 mb-4">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No media files yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Upload images and videos to get started.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMedia.map((media) => (
                  <div key={media.id} className="group relative">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                      {media.mime_type.startsWith('image/') ? (
                        <img
                          src={media.url}
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="w-full h-full object-cover"
                          preload="metadata"
                        />
                      )}
                      
                      {/* Overlay with actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => window.open(media.url, '_blank')}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => {
                              const link = document.createElement('a')
                              link.href = media.url
                              link.download = media.filename
                              link.click()
                            }}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* CDN Badge */}
                      {media.is_bunny_cdn && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          CDN
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {getFileIcon(media.mime_type)}
                        <span className="truncate">{media.filename}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {formatDate(media.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
