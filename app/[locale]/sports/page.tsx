"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Header } from "@/components/header"
import { NewsSection, NewsCard } from "@/components/news-card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Trophy } from "lucide-react"

// Helper function to convert MongoDB post to NewsCard format
const convertPostToNewsCard = (post: any) => {
  const videoMedia = post.media?.find((m: any) => m.type === 'video')
  const imageMedia = post.media?.find((m: any) => m.type === 'image')
  
  return {
    title: post.title,
    content: post.excerpt || post.content.substring(0, 200) + '...',
    date: new Date(post.publishedAt || post.createdAt).toLocaleDateString(),
    image: post.featuredImage || imageMedia?.url || '/api/placeholder/400/300',
    video: videoMedia?.url,
    media: post.media,
    tag: post.category,
    slug: post.slug,
    id: post._id
  }
}

export default function SportsPage({ params }: { params: { locale: string } }) {
  const t = useTranslations("navigation")
  const tNews = useTranslations("news")
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadPosts = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/posts?category=sports&page=${pageNum}&per_page=12&status=published`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }
      
      const data = await response.json()
      const newPosts = data.posts || []
      
      if (append) {
        setPosts(prev => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }
      
      setHasMore(data.pagination?.hasNextPage || false)
      setPage(pageNum)
    } catch (err) {
      setError('Failed to load posts. Please try again.')
      console.error('Error loading posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1, true)
    }
  }

  const refresh = () => {
    loadPosts(1, false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  return (
    <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
      <Header locale={params.locale} />
      
      <main>
        {/* Page Header */}
        <section className="py-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="renas-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Trophy className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-renas-brown-800 dark:text-white mb-2">
                    {t("sports")}
                  </h1>
                  <p className="text-renas-brown-600 dark:text-gray-300">
                    {tNews("sportsDescription")}
                  </p>
                </div>
              </div>
              <Button 
                onClick={refresh} 
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                {tNews("refresh")}
              </Button>
            </div>
          </div>
        </section>

        {/* News Content */}
        <NewsSection title={tNews("sportsNews")} showNavigation={false}>
          {loading && posts.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-renas-gold-500" />
              <span className="ml-2 text-renas-brown-600 dark:text-gray-400">
                {tNews("loading")}...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <Button onClick={refresh} variant="outline">
                {tNews("tryAgain")}
              </Button>
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <NewsCard key={post._id} {...convertPostToNewsCard(post)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-renas-brown-600 dark:text-gray-400">
                {tNews("noPostsFound")}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {posts.length > 0 && hasMore && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={loadMore} 
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {tNews("loadMore")}
              </Button>
            </div>
          )}

          {/* No More Posts */}
          {posts.length > 0 && !hasMore && (
            <div className="text-center py-8">
              <p className="text-renas-brown-600 dark:text-gray-400">
                {tNews("noMorePosts")}
              </p>
            </div>
          )}
        </NewsSection>
      </main>
    </div>
  )
}