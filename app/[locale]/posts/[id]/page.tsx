"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"
import Link from "next/link"
import PostTranslation from "@/components/PostTranslation"
import TranslatableText from "@/components/TranslatableText"
import { LikeSaveButtons } from "@/components/like-save-buttons"

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
    alt?: string
  }>
  author: {
    _id: string
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export default function PostPage() {
  const params = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/posts/${params.id}`)
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Post not found')
        }
        
        const data = await response.json()
        
        if (data.success && data.post) {
          setPost(data.post)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchPost()
    }
  }, [params.id])

  const renderMedia = (media: Post['media']) => {
    return media.map((item, index) => {
      if (item.type === 'image') {
        return (
          <img
            key={index}
            src={item.url}
            alt={item.alt || post?.title || 'Post image'}
            className="w-full h-auto rounded-lg my-6"
          />
        )
      } else if (item.type === 'video') {
        return (
          <video
            key={index}
            controls
            className="w-full h-auto rounded-lg my-6"
            preload="metadata"
          >
            <source src={item.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )
      }
      return null
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
        <Header locale={params.locale as string} />
        <div className="renas-container py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
              <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
        <Header locale={params.locale as string} />
        <div className="renas-container py-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold text-renas-brown-800 dark:text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-renas-brown-600 dark:text-gray-300 mb-6">
              {error || 'The post you are looking for does not exist.'}
            </p>
            <Link href="/">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
      <Header locale={params.locale as string} />
      
      <div className="renas-container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Post Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-renas-gold-500 dark:bg-renas-gold-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {post.category}
              </span>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-renas-brown-800 dark:text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center gap-6 text-sm text-renas-brown-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.media.length > 0 && post.media[0].type === 'image' && (
            <div className="mb-8">
              <img
                src={post.media[0].url}
                alt={post.title}
                className="w-full h-64 lg:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Post Content */}
          <Card className="border-renas-brown-200 dark:border-gray-700">
            <CardContent className="p-8">
              {/* Translation Component */}
              <PostTranslation
                postId={post._id}
                originalTitle={post.title}
                originalContent={post.content}
                originalExcerpt={post.excerpt}
                onTranslationComplete={(translation) => {
                  console.log('Translation completed:', translation);
                }}
              />
              
              {/* Additional Media */}
              {post.media.length > 1 && (
                <div className="mt-8">
                  {renderMedia(post.media.slice(1))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Post Footer */}
          <div className="mt-8 pt-6 border-t border-renas-brown-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-renas-brown-600 dark:text-gray-400">
                <p>Published by <span className="font-medium">{post.author.name}</span></p>
                <p>Last updated: {new Date(post.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <LikeSaveButtons postId={post._id} />
                <Link href="/">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
