"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Users, Clock, ThumbsUp, Reply, Plus, LogIn } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { fetchForumTopics, formatForumDate, getCategoryDisplayName, ForumTopic } from "@/lib/forum-api"

interface CreateTopicForm {
  title: string
  content: string
  category: string
}

interface ForumSectionProps {
  locale: string
}

export function ForumSection({ locale }: ForumSectionProps) {
  const t = useTranslations("navigation")
  const router = useRouter()
  const { user, token, loading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [topics, setTopics] = useState<ForumTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [createForm, setCreateForm] = useState<CreateTopicForm>({
    title: "",
    content: "",
    category: "general"
  })
  const [submitting, setSubmitting] = useState(false)

  const categories = [
    { key: "all", label: "All Topics" },
    { key: "political", label: "Political" },
    { key: "economics", label: "Economics" },
    { key: "sports", label: "Sports" },
    { key: "social", label: "Social" },
    { key: "technology", label: "Technology" },
    { key: "general", label: "General Discussion" }
  ]

  // Load topics on component mount and when filters change
  useEffect(() => {
    loadTopics()
  }, [selectedCategory, searchQuery])

  const loadTopics = async () => {
    setLoading(true)
    try {
      const response = await fetchForumTopics({
        category: selectedCategory,
        search: searchQuery,
        page: 1,
        limit: 20
      })
      
      if (response.success && response.data) {
        setTopics(response.data.topics)
      } else {
        console.error('Failed to load topics:', response.error)
      }
    } catch (error) {
      console.error('Error loading topics:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      router.push(`/${locale}/login`)
      return
    }

    if (!createForm.title.trim() || !createForm.content.trim()) {
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/forum/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: createForm.title,
          content: createForm.content,
          category: createForm.category
        }),
      })

      if (response.ok) {
        // Reset form and reload topics
        setCreateForm({ title: "", content: "", category: "general" })
        setShowCreateForm(false)
        loadTopics()
      } else {
        const errorData = await response.json()
        console.error('Failed to create topic:', errorData.error)
      }
    } catch (error) {
      console.error('Error creating topic:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleTopicClick = (topicId: string) => {
    router.push(`/${locale}/forums/${topicId}`)
  }

  return (
    <section className="py-8 bg-renas-beige-50 dark:bg-gray-900">
      <div className="renas-container">
        <div className="flex items-center gap-2 mb-8">
          <MessageCircle className="h-8 w-8 text-renas-gold-600" />
          <h2 className="text-3xl font-bold text-renas-brown-800 dark:text-white">
            {t("forums")}
          </h2>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search forum topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white dark:bg-gray-800 border-renas-brown-300 dark:border-gray-600"
              />
            </div>
            <div className="flex gap-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "renas" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Forum Topics */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-renas-gold-600 mx-auto"></div>
              <p className="mt-2 text-renas-brown-600 dark:text-gray-400">Loading topics...</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-renas-brown-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-renas-brown-600 dark:text-gray-400">No topics found</p>
            </div>
          ) : (
            topics.map((topic) => (
              <Card 
                key={topic._id} 
                className="border-renas-brown-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleTopicClick(topic._id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-renas-brown-800 dark:text-white mb-2">
                        {topic.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-renas-brown-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {topic.author?.name || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatForumDate(topic.createdAt)}
                        </span>
                        {topic.lastReply?.createdAt && (
                          <span className="text-xs">
                            Last reply: {formatForumDate(topic.lastReply.createdAt)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="bg-renas-gold-100 dark:bg-renas-gold-900 text-renas-gold-800 dark:text-renas-gold-200 px-2 py-1 rounded-full text-xs font-medium">
                      {getCategoryDisplayName(topic.category)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-renas-brown-700 dark:text-gray-300 mb-4 line-clamp-2">
                    {topic.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Reply className="h-4 w-4" />
                      {topic.replies} replies
                    </Button>
                    <Button 
                      variant="renas" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTopicClick(topic._id)
                      }}
                    >
                      Join Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create New Topic */}
        <div className="mt-8">
          {!user ? (
            <Card className="border-renas-gold-300 dark:border-renas-gold-600">
              <CardContent className="pt-6">
                <div className="text-center">
                  <LogIn className="h-12 w-12 text-renas-gold-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-renas-brown-800 dark:text-white mb-2">
                    Login Required
                  </h3>
                  <p className="text-renas-brown-600 dark:text-gray-400 mb-4">
                    You need to be logged in to start a new discussion topic.
                  </p>
                  <Button 
                    variant="renas" 
                    onClick={() => router.push(`/${locale}/login`)}
                    className="flex items-center gap-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Login to Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-renas-gold-300 dark:border-renas-gold-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-renas-brown-800 dark:text-white">
                    Start a New Discussion
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCreateForm(!showCreateForm)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {showCreateForm ? 'Cancel' : 'New Topic'}
                  </Button>
                </div>
              </CardHeader>
              {showCreateForm && (
                <CardContent>
                  <form onSubmit={handleCreateTopic} className="space-y-4">
                    <Input
                      type="text"
                      placeholder="Topic title..."
                      value={createForm.title}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, title: e.target.value }))}
                      className="bg-white dark:bg-gray-800"
                      required
                    />
                    <textarea
                      placeholder="Share your thoughts..."
                      value={createForm.content}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, content: e.target.value }))}
                      className="w-full h-32 p-3 border border-renas-brown-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-renas-brown-800 dark:text-white placeholder:text-renas-brown-400 dark:placeholder:text-gray-400"
                      required
                    />
                    <div className="flex justify-between items-center">
                      <select 
                        value={createForm.category}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, category: e.target.value }))}
                        className="px-3 py-2 border border-renas-brown-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-renas-brown-800 dark:text-white"
                      >
                        <option value="general">General Discussion</option>
                        <option value="political">Political</option>
                        <option value="economics">Economics</option>
                        <option value="sports">Sports</option>
                        <option value="social">Social</option>
                        <option value="technology">Technology</option>
                      </select>
                      <Button 
                        type="submit" 
                        variant="renas" 
                        disabled={submitting || !createForm.title.trim() || !createForm.content.trim()}
                      >
                        {submitting ? 'Posting...' : 'Post Discussion'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
