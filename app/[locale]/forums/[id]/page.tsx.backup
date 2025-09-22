"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, MessageCircle, Users, Clock, Reply, Send, LogIn } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { fetchForumTopic, createForumComment, formatForumDate, ForumTopic, ForumComment } from "@/lib/forum-api"

interface TopicDetailPageProps {
  params: {
    locale: string
    id: string
  }
}

export default function TopicDetailPage({ params }: TopicDetailPageProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [topic, setTopic] = useState<ForumTopic | null>(null)
  const [comments, setComments] = useState<ForumComment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")
  const [commentAuthor, setCommentAuthor] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [showCommentForm, setShowCommentForm] = useState(false)

  // Validate and parse topic ID
  const topicId = parseInt(params.id)
  
  if (isNaN(topicId)) {
    return (
      <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
        <Header locale={params.locale} />
        <div className="renas-container py-8">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-renas-brown-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-renas-brown-800 dark:text-white mb-2">
              Invalid Topic ID
            </h2>
            <p className="text-renas-brown-600 dark:text-gray-400 mb-4">
              The topic ID is not valid.
            </p>
            <Button variant="renas" onClick={() => router.push(`/${params.locale}/forums`)}>
              Back to Forums
            </Button>
          </div>
        </div>
      </div>
    )
  }

  useEffect(() => {
    loadTopic()
  }, [topicId])

  const loadTopic = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchForumTopic(topicId)
      if (response.success && response.data) {
        setTopic(response.data.topic)
        setComments(response.data.comments)
      } else {
        setError(response.error || 'Failed to load topic')
      }
    } catch (error) {
      console.error('Error loading topic:', error)
      setError('Failed to load topic. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    // For anonymous comments, require author name
    if (isAnonymous && !commentAuthor.trim()) {
      alert('Please enter your name for anonymous comments')
      return
    }

    setSubmitting(true)
    try {
      const response = await createForumComment({
        topic_id: topicId,
        content: newComment,
        author_id: isAnonymous ? undefined : user?.id,
        author_name: isAnonymous ? commentAuthor : (user?.display_name || user?.username || ''),
        is_anonymous: isAnonymous
      })

      if (response.success && response.data) {
        setComments(prev => [...prev, response.data!])
        setNewComment("")
        setCommentAuthor("")
        setIsAnonymous(false)
        setShowCommentForm(false)
      } else {
        console.error('Failed to create comment:', response.error)
        alert('Failed to post comment. Please try again.')
      }
    } catch (error) {
      console.error('Error creating comment:', error)
      alert('Failed to post comment. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
        <Header locale={params.locale} />
        <div className="renas-container py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-renas-gold-600 mx-auto"></div>
            <p className="mt-2 text-renas-brown-600 dark:text-gray-400">Loading topic...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !topic) {
    return (
      <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
        <Header locale={params.locale} />
        <div className="renas-container py-8">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-renas-brown-300 dark:text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-renas-brown-800 dark:text-white mb-2">
              {error || 'Topic Not Found'}
            </h2>
            <p className="text-renas-brown-600 dark:text-gray-400 mb-4">
              {error || 'The topic you\'re looking for doesn\'t exist or has been removed.'}
            </p>
            <Button variant="renas" onClick={() => router.push(`/${params.locale}/forums`)}>
              Back to Forums
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
      <Header locale={params.locale} />
      
      <div className="renas-container py-8">
        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(`/${params.locale}/forums`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Forums
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push(`/${params.locale}/forums`)}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Browse All Topics
          </Button>
        </div>

        {/* Topic Header */}
        <Card className="mb-6 border-renas-brown-200 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl text-renas-brown-800 dark:text-white mb-4">
                  {topic.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-renas-brown-600 dark:text-gray-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {topic.author_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatForumDate(topic.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Reply className="h-4 w-4" />
                    {topic.reply_count} replies
                  </span>
                </div>
              </div>
              <span className="bg-renas-gold-100 dark:bg-renas-gold-900 text-renas-gold-800 dark:text-renas-gold-200 px-3 py-1 rounded-full text-sm font-medium">
                {topic.category}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-renas-brown dark:prose-invert max-w-none">
              <p className="text-renas-brown-700 dark:text-gray-300 whitespace-pre-wrap">
                {topic.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-renas-brown-800 dark:text-white flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comments ({comments.length})
          </h3>

          {/* Comments List */}
          {comments.length === 0 ? (
            <Card className="border-renas-brown-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-renas-brown-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-renas-brown-600 dark:text-gray-400">
                    No comments yet. Be the first to comment!
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id} className="border-renas-brown-200 dark:border-gray-700">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-renas-brown-800 dark:text-white">
                          {comment.author_name}
                        </span>
                        {comment.is_anonymous && (
                          <span className="text-xs bg-renas-brown-100 dark:bg-renas-brown-800 text-renas-brown-600 dark:text-renas-brown-300 px-2 py-1 rounded">
                            Anonymous
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-renas-brown-500 dark:text-gray-400">
                        {formatForumDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-renas-brown-700 dark:text-gray-300 whitespace-pre-wrap mb-3">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowCommentForm(true)
                          setNewComment(`@${comment.author_name} `)
                        }}
                        className="flex items-center gap-1 text-xs"
                      >
                        <Reply className="h-3 w-3" />
                        Reply
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Comment Form */}
          <Card className="border-renas-gold-300 dark:border-renas-gold-600">
            <CardHeader>
              <CardTitle className="text-renas-brown-800 dark:text-white">
                {user ? 'Add a Comment' : 'Join the Discussion'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user ? (
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-renas-brown-600 dark:text-gray-400">
                        Post as anonymous
                      </span>
                    </label>
                  </div>
                  
                  {isAnonymous && (
                    <Input
                      type="text"
                      placeholder="Your name (for anonymous comments)"
                      value={commentAuthor}
                      onChange={(e) => setCommentAuthor(e.target.value)}
                      className="bg-white dark:bg-gray-800"
                    />
                  )}
                  
                  <textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full h-24 p-3 border border-renas-brown-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-renas-brown-800 dark:text-white placeholder:text-renas-brown-400 dark:placeholder:text-gray-400"
                    required
                  />
                  
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="renas"
                      disabled={submitting || !newComment.trim() || (isAnonymous && !commentAuthor.trim())}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </form>
              ) : showCommentForm ? (
                <form onSubmit={handleSubmitComment} className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-renas-brown-600 dark:text-gray-400">
                        Post as anonymous
                      </span>
                    </label>
                  </div>
                  
                  <Input
                    type="text"
                    placeholder="Your name"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="bg-white dark:bg-gray-800"
                    required
                  />
                  
                  <textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full h-24 p-3 border border-renas-brown-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-renas-brown-800 dark:text-white placeholder:text-renas-brown-400 dark:placeholder:text-gray-400"
                    required
                  />
                  
                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCommentForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="renas"
                      disabled={submitting || !newComment.trim() || !commentAuthor.trim()}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-6">
                  <LogIn className="h-12 w-12 text-renas-gold-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-renas-brown-800 dark:text-white mb-2">
                    Join the Discussion
                  </h3>
                  <p className="text-renas-brown-600 dark:text-gray-400 mb-4">
                    You can comment anonymously or login to comment with your account.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAnonymous(true)
                        setShowCommentForm(true)
                      }}
                      className="flex items-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Comment Anonymously
                    </Button>
                    <Button
                      variant="renas"
                      onClick={() => router.push(`/${params.locale}/login`)}
                      className="flex items-center gap-2"
                    >
                      <LogIn className="h-4 w-4" />
                      Login to Comment
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
