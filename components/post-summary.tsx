"use client"

import { Card } from "@/components/ui/card"
import { 
  User, 
  Calendar, 
  Image as ImageIcon, 
  Video, 
  FileText,
  Tag,
  Folder,
  Clock
} from "lucide-react"

interface PostSummaryProps {
  author: {
    _id: string
    name: string
    email: string
    role?: string
  }
  content: string
  mediaFiles: Array<{
    id: string
    type: 'image' | 'video'
    file: File
  }>
  category: string
  tags: string
  status: string
  className?: string
}

export function PostSummary({ 
  author, 
  content, 
  mediaFiles, 
  category, 
  tags, 
  status,
  className = "" 
}: PostSummaryProps) {
  const wordCount = content.split(/\s+/).filter(Boolean).length
  const charCount = content.length
  const imageCount = mediaFiles.filter(m => m.type === 'image').length
  const videoCount = mediaFiles.filter(m => m.type === 'video').length
  const tagList = tags.split(',').map(tag => tag.trim()).filter(Boolean)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'publish':
        return 'text-green-600 dark:text-green-400'
      case 'draft':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'pending':
        return 'text-blue-600 dark:text-blue-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
        Post Summary
      </h3>
      
      <div className="space-y-4">
        {/* Author Info */}
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <User className="h-5 w-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white">
              {author.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {author.email}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {author.role || 'Author'}
            </p>
          </div>
        </div>

        {/* Post Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-gray-400" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">
                {wordCount} words
              </p>
              <p className="text-xs text-gray-500">
                {charCount} characters
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <div className="text-sm">
              <p className="font-medium text-gray-900 dark:text-white">
                {Math.ceil(wordCount / 200)} min read
              </p>
              <p className="text-xs text-gray-500">
                Estimated
              </p>
            </div>
          </div>
        </div>

        {/* Media Stats */}
        {mediaFiles.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {imageCount} image{imageCount !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Video className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {videoCount} video{videoCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Category & Status */}
        <div className="space-y-2">
          {category && (
            <div className="flex items-center gap-2">
              <Folder className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${
              status === 'publish' ? 'bg-green-500' :
              status === 'draft' ? 'bg-yellow-500' : 'bg-blue-500'
            }`} />
            <span className={`text-sm font-medium ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {tagList.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Tags
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {tagList.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Publishing Info */}
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Calendar className="h-3 w-3" />
            <span>Created on {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
