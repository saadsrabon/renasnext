"use client"

import { Header } from "@/components/header"
import { VideoUpload } from "@/components/video-upload"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Video, Upload as UploadIcon } from "lucide-react"

export default function UploadPage({ params }: { params: { locale: string } }) {
  const handleVideoUpload = (file: File) => {
    console.log("Video uploaded:", file.name)
    // Handle video upload logic here
  }

  return (
    <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
      <Header locale={params.locale} />
      
      <main className="py-8">
        <div className="renas-container">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <UploadIcon className="h-8 w-8 text-renas-gold-600" />
              <h1 className="text-3xl font-bold text-renas-brown-800 dark:text-white">
                Upload Content
              </h1>
            </div>
            <p className="text-renas-brown-600 dark:text-gray-400">
              Share your videos, images, and documents with the community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Video Upload */}
            <div className="lg:col-span-2">
              <VideoUpload onUpload={handleVideoUpload} />
            </div>

            {/* Upload Guidelines */}
            <div className="space-y-6">
              <Card className="border-renas-brown-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-renas-brown-800 dark:text-white">
                    <Video className="h-5 w-5" />
                    Upload Guidelines
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-renas-brown-700 dark:text-gray-300 mb-2">
                      Video Requirements:
                    </h4>
                    <ul className="text-sm text-renas-brown-600 dark:text-gray-400 space-y-1">
                      <li>• Maximum file size: 500MB</li>
                      <li>• Supported formats: MP4, MOV, AVI</li>
                      <li>• Recommended resolution: 1080p or higher</li>
                      <li>• Duration: 30 seconds to 2 hours</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-renas-brown-700 dark:text-gray-300 mb-2">
                      Content Guidelines:
                    </h4>
                    <ul className="text-sm text-renas-brown-600 dark:text-gray-400 space-y-1">
                      <li>• No copyrighted material</li>
                      <li>• Appropriate content only</li>
                      <li>• Clear audio and video quality</li>
                      <li>• Relevant to news and current events</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-renas-gold-200 dark:border-renas-gold-700">
                <CardHeader>
                  <CardTitle className="text-renas-brown-800 dark:text-white">
                    Recent Uploads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { title: "Breaking News Update", time: "2 hours ago", status: "Published" },
                      { title: "Interview with Minister", time: "1 day ago", status: "Processing" },
                      { title: "Economic Analysis", time: "2 days ago", status: "Published" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-renas-beige-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-renas-brown-800 dark:text-white">
                            {item.title}
                          </p>
                          <p className="text-xs text-renas-brown-600 dark:text-gray-400">
                            {item.time}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          item.status === "Published" 
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
