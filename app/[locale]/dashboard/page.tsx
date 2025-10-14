"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MediaLibrary } from "@/components/media-library"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  FileText,
  Image,
  Video,
  Users,
  Settings,
  Heart,
  Bookmark,
  Search,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface Post {
  _id: string
  title: string
  content: string
  excerpt: string
  status: 'draft' | 'published' | 'pending'
  createdAt: string
  updatedAt: string
  featuredImage?: string
  category: string
  tags: string[]
  author: {
    _id: string
    name: string
    email: string
  }
}

interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'author' | 'editor' | 'subscriber'
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SavedPost {
  _id: string
  title: string
  excerpt: string
  status: 'draft' | 'published' | 'pending'
  createdAt: string
  featuredImage?: string
  category: string
  author: {
    _id: string
    name: string
  }
}


export default function Dashboard() {
  const t = useTranslations("dashboard")
  const { user, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const [posts, setPosts] = useState<Post[]>([])
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [savedPosts, setSavedPosts] = useState<SavedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("posts")
  const [userSearch, setUserSearch] = useState("")
  const [postSearch, setPostSearch] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [bulkPublishing, setBulkPublishing] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`)
      return
    }
    if (user && token) {
      fetchUserPosts()
      if (user.role === 'admin') {
        fetchAllUsers()
        fetchAllPosts()
      }
      fetchSavedPosts()
    }
  }, [user, token, authLoading, locale])

  const fetchUserPosts = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await fetch("/api/posts/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.posts) {
          setPosts(data.posts)
        } else {
          console.error('Invalid response format:', data)
          setPosts([])
        }
      } else {
        console.error('Failed to fetch posts:', response.status)
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const fetchAllUsers = async () => {
    if (!token) return
    
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.users) {
          setUsers(data.users)
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchAllPosts = async () => {
    if (!token) return
    
    try {
      const response = await fetch("/api/posts?status=all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.posts) {
          setAllPosts(data.posts)
        }
      }
    } catch (error) {
      console.error("Error fetching all posts:", error)
    }
  }

  const fetchSavedPosts = async () => {
    if (!token) return
    
    try {
      const response = await fetch("/api/posts/saved", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.posts) {
          setSavedPosts(data.posts)
        }
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error)
    }
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return
    
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setPosts(posts.filter(post => post._id !== postId))
        setAllPosts(allPosts.filter(post => post._id !== postId))
      }
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleSelectPost = (postId: string) => {
    setSelectedPosts(prev => 
      prev.includes(postId) 
        ? prev.filter(id => id !== postId)
        : [...prev, postId]
    )
  }

  const handleSelectAllPosts = () => {
    const filteredPosts = allPosts.filter(post => 
      postSearch === '' || 
      post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
      post.author.name.toLowerCase().includes(postSearch.toLowerCase())
    )
    
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map(post => post._id))
    }
  }

  const handleBulkPublish = async () => {
    if (selectedPosts.length === 0) {
      alert("Please select at least one post to publish")
      return
    }

    if (!confirm(`Are you sure you want to publish ${selectedPosts.length} post(s)?`)) return

    setBulkPublishing(true)
    try {
      const response = await fetch('/api/posts/bulk-publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postIds: selectedPosts }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Update the posts in state
          setAllPosts(prev => prev.map(post => 
            selectedPosts.includes(post._id) 
              ? { ...post, status: 'published' as const }
              : post
          ))
          setSelectedPosts([])
          alert(`Successfully published ${data.publishedCount} post(s)`)
        } else {
          alert(data.error || "Failed to publish posts")
        }
      } else {
        const error = await response.json()
        alert(error.error || "Failed to publish posts")
      }
    } catch (error) {
      console.error("Error bulk publishing posts:", error)
      alert("Failed to publish posts. Please try again.")
    } finally {
      setBulkPublishing(false)
    }
  }

  const handleQuickPublishPost = async (postId: string) => {
    if (!confirm("Are you sure you want to publish this post?")) return

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "published" }),
      })

      if (response.ok) {
        // Update the post in state
        setAllPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, status: 'published' as const }
            : post
        ))
        alert("Post published successfully")
      } else {
        const error = await response.json()
        alert(error.error || "Failed to publish post")
      }
    } catch (error) {
      console.error("Error publishing post:", error)
      alert("Failed to publish post. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case "published":
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
      case "draft":
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
      case "pending":
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-renas-gold-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please log in to access your dashboard.
          </p>
          <Link href={`/${locale}/login`}>
            <Button className="mt-4">Go to Login</Button>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Welcome back, {user.name}!
            </p>
        <Link href={`/${locale}/`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Visit Site
              </Button>
            </Link>
          </div>
          <Link href={`/${locale}/dashboard/create`}>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create New Post
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Posts
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {posts.length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Published
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {posts.filter(p => p.status === 'published').length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Drafts
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {posts.filter(p => p.status === 'draft').length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  {posts.filter(p => p.status === 'pending').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`grid w-full ${user?.role === 'admin' ? 'grid-cols-6' : 'grid-cols-4'}`}>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="saved">Saved Posts</TabsTrigger>
            {user?.role === 'admin' && (
              <>
                <TabsTrigger value="all-posts">All Posts</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </>
            )}
            <TabsTrigger value="media">Media Library</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  My Posts
                </h2>
                
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No posts yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Create your first post to get started.
                    </p>
                    <Link href={`/${locale}/dashboard/create`}>
                      <Button>Create Your First Post</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div
                        key={post._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {post.title || "Untitled Post"}
                              </h3>
                              <span className={getStatusBadge(post.status)}>
                                {post.status}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                              {post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : "No excerpt available"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Created: {formatDate(post.createdAt)}</span>
                              </div>
                              {post.updatedAt !== post.createdAt && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Updated: {formatDate(post.updatedAt)}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>By: {post.author.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/${locale}/dashboard/edit/${post._id}`)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePost(post._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Saved Posts
                </h2>
                
                {savedPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No saved posts yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Save posts you like to find them later.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedPosts.map((post) => (
                      <div
                        key={post._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                {post.title || "Untitled Post"}
                              </h3>
                              <span className={getStatusBadge(post.status)}>
                                {post.status}
                              </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                              {post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : "No excerpt available"}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Created: {formatDate(post.createdAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                <span>By: {post.author.name}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/${locale}/posts/${post._id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          {user?.role === 'admin' && (
            <>
              <TabsContent value="all-posts" className="mt-6">
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        All Posts
                      </h2>
                      <div className="flex items-center gap-2">
                        {selectedPosts.length > 0 && (
                          <Button
                            onClick={handleBulkPublish}
                            disabled={bulkPublishing}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {bulkPublishing ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Publishing...
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Publish Selected ({selectedPosts.length})
                              </>
                            )}
                          </Button>
                        )}
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search posts..."
                            value={postSearch}
                            onChange={(e) => setPostSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {allPosts.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No posts found
                        </h3>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {allPosts.length > 0 && (
                          <div className="flex items-center gap-2 mb-4">
                            <input
                              type="checkbox"
                              checked={selectedPosts.length === allPosts.filter(post => 
                                postSearch === '' || 
                                post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
                                post.author.name.toLowerCase().includes(postSearch.toLowerCase())
                              ).length && selectedPosts.length > 0}
                              onChange={handleSelectAllPosts}
                              className="rounded border-gray-300 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Select All ({allPosts.filter(post => 
                                postSearch === '' || 
                                post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
                                post.author.name.toLowerCase().includes(postSearch.toLowerCase())
                              ).length} posts)
                            </span>
                          </div>
                        )}
                        {allPosts
                          .filter(post => 
                            postSearch === '' || 
                            post.title.toLowerCase().includes(postSearch.toLowerCase()) ||
                            post.author.name.toLowerCase().includes(postSearch.toLowerCase())
                          )
                          .map((post) => (
                          <div
                            key={post._id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={selectedPosts.includes(post._id)}
                                  onChange={() => handleSelectPost(post._id)}
                                  className="mt-1 rounded border-gray-300 dark:border-gray-600"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                      {post.title || "Untitled Post"}
                                    </h3>
                                    <span className={getStatusBadge(post.status)}>
                                      {post.status}
                                    </span>
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                    {post.excerpt ? post.excerpt.replace(/<[^>]*>/g, '') : "No excerpt available"}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      <span>Created: {formatDate(post.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      <span>By: {post.author.name}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                {post.status === 'pending' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleQuickPublishPost(post._id)}
                                    className="text-green-600 hover:text-green-700"
                                    title="Quick Publish"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/${locale}/dashboard/edit/${post._id}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePost(post._id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="users" className="mt-6">
                <Card>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        All Users
                      </h2>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search users..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <select
                          value={userRoleFilter}
                          onChange={(e) => setUserRoleFilter(e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        >
                          <option value="all">All Roles</option>
                          <option value="admin">Admin</option>
                          <option value="author">Author</option>
                          <option value="editor">Editor</option>
                          <option value="subscriber">Subscriber</option>
                        </select>
                      </div>
                    </div>
                    
                    {users.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          No users found
                        </h3>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {users
                          .filter(user => 
                            (userSearch === '' || 
                             user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                             user.email.toLowerCase().includes(userSearch.toLowerCase())) &&
                            (userRoleFilter === 'all' || user.role === userRoleFilter)
                          )
                          .map((userItem) => (
                          <div
                            key={userItem._id}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {userItem.name}
                                  </h3>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    userItem.role === 'admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                    userItem.role === 'author' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                    userItem.role === 'editor' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                  }`}>
                                    {userItem.role}
                                  </span>
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    userItem.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  }`}>
                                    {userItem.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                  {userItem.email}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>Joined: {formatDate(userItem.createdAt)}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/${locale}/dashboard/edit-user/${userItem._id}`)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </>
          )}

          <TabsContent value="media" className="mt-6">
            <MediaLibrary locale={locale} />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Account Settings
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}