"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Image as ImageIcon, 
  Video, 
  X, 
  Plus,
  Upload,
  FileText
} from "lucide-react"

interface MediaFile {
  id: string
  file?: File
  preview?: string
  type: 'image' | 'video'
  url?: string
  title?: string
}

interface MediaInserterProps {
  mediaFiles: MediaFile[]
  onMediaUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => Promise<void>
  onMediaRemove: (id: string) => void
  onMediaInsert: (mediaId: string) => void
  uploadingMedia: boolean
  className?: string
}

export function MediaInserter({
  mediaFiles,
  onMediaUpload,
  onMediaRemove,
  onMediaInsert,
  uploadingMedia,
  className = ""
}: MediaInserterProps) {
  const [showUploader, setShowUploader] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  return (
    <Card className={`p-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Media Library
          </h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowUploader(!showUploader)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Media
          </Button>
        </div>

        {/* Upload Section */}
        {showUploader && (
          <div className="border-t pt-4">
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onMediaUpload(e, 'image')}
                  className="hidden"
                  disabled={uploadingMedia}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingMedia}
                  className="w-full"
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImageIcon className="h-3 w-3 mr-1" />
                  Images
                </Button>
              </div>
              
              <div className="flex-1">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) => onMediaUpload(e, 'video')}
                  className="hidden"
                  disabled={uploadingMedia}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploadingMedia}
                  className="w-full"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Video className="h-3 w-3 mr-1" />
                  Videos
                </Button>
              </div>
            </div>
            
            {uploadingMedia && (
              <div className="mt-2 text-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mx-auto mb-1"></div>
                <p className="text-xs text-gray-500">Uploading...</p>
              </div>
            )}
          </div>
        )}

        {/* Media Grid */}
        {mediaFiles.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {mediaFiles.map((media) => (
              <div key={media.id} className="flex items-center gap-2 p-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
                  {media.type === 'image' ? (
                    <img
                      src={media.url || media.preview}
                      alt={media.title || 'Image'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={media.url || media.preview}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                  )}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    {media.type === 'image' ? (
                      <ImageIcon className="h-3 w-3 text-gray-400" />
                    ) : (
                      <Video className="h-3 w-3 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {media.title || media.file?.name || 'Media file'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onMediaInsert(media.id)}
                      className="h-6 px-2 text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Insert
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onMediaRemove(media.id)}
                      className="h-6 px-2 text-xs text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">No media files yet</p>
            <p className="text-xs">Upload images or videos to get started</p>
          </div>
        )}
      </div>
    </Card>
  )
}
