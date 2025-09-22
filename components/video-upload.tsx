"use client"

import { useState, useRef } from "react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Video, FileText, Image, X, Play } from "lucide-react"

interface VideoUploadProps {
  onUpload?: (file: File) => void
}

export function VideoUpload({ onUpload }: VideoUploadProps) {
  const t = useTranslations("common")
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (file.type.startsWith('video/')) {
      setUploadedFile(file)
      if (onUpload) {
        onUpload(file)
      }
    } else {
      alert('Please upload a video file')
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const simulateUpload = () => {
    setIsUploading(true)
    setUploadProgress(0)
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  return (
    <div className="space-y-6">
      <Card className="border-renas-brown-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-renas-brown-800 dark:text-white">
            <Video className="h-5 w-5" />
            Upload Video Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-renas-gold-500 bg-renas-gold-50 dark:bg-renas-gold-900/20"
                : "border-renas-brown-300 dark:border-gray-600"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            {uploadedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Play className="h-12 w-12 text-renas-gold-600" />
                </div>
                <div>
                  <p className="text-renas-brown-800 dark:text-white font-medium">
                    {uploadedFile.name}
                  </p>
                  <p className="text-sm text-renas-brown-600 dark:text-gray-400">
                    {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                
                {isUploading && (
                  <div className="space-y-2">
                    <div className="w-full bg-renas-brown-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-renas-gold-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-renas-brown-600 dark:text-gray-400">
                      Uploading... {uploadProgress}%
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2 justify-center">
                  <Button
                    variant="renas"
                    onClick={simulateUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Video"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={removeFile}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <Upload className="h-12 w-12 text-renas-brown-400 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-renas-brown-800 dark:text-white font-medium">
                    Drag and drop your video here
                  </p>
                  <p className="text-sm text-renas-brown-600 dark:text-gray-400">
                    or click to browse files
                  </p>
                </div>
                <Button variant="outline">
                  Choose Video File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Video Details Form */}
      {uploadedFile && (
        <Card className="border-renas-brown-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-renas-brown-800 dark:text-white">
              Video Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-renas-brown-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <Input
                type="text"
                placeholder="Enter video title..."
                className="bg-white dark:bg-gray-800"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-renas-brown-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                placeholder="Enter video description..."
                className="w-full h-24 p-3 border border-renas-brown-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-renas-brown-800 dark:text-white placeholder:text-renas-brown-400 dark:placeholder:text-gray-400"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-renas-brown-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <select className="w-full p-3 border border-renas-brown-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-renas-brown-800 dark:text-white">
                  <option value="news">News</option>
                  <option value="interview">Interview</option>
                  <option value="documentary">Documentary</option>
                  <option value="live">Live Coverage</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-renas-brown-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <Input
                  type="text"
                  placeholder="Enter tags (comma separated)..."
                  className="bg-white dark:bg-gray-800"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="renas" className="flex-1">
                Publish Video
              </Button>
              <Button variant="outline">
                Save as Draft
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
