export interface ForumTopic {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  category: string
  tags: string[]
  isPinned: boolean
  isLocked: boolean
  views: number
  replies: number
  lastReply?: {
    author: string
    createdAt: string
  }
  createdAt: string
  updatedAt: string
}

export interface ForumComment {
  _id: string
  content: string
  author?: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
  topic: string
  parentComment?: string
  likes: number
  isDeleted: boolean
  createdAt: string
  updatedAt: string
  authorName?: string // For anonymous comments
}

export interface ForumResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface TopicsResponse {
  topics: ForumTopic[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface TopicWithComments {
  topic: ForumTopic
  comments: ForumComment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Fetch all forum topics
export async function fetchForumTopics(params: {
  category?: string
  page?: number
  limit?: number
  search?: string
} = {}): Promise<ForumResponse<TopicsResponse>> {
  try {
    const searchParams = new URLSearchParams()
    
    if (params.category && params.category !== 'all') {
      searchParams.append('category', params.category)
    }
    if (params.page) {
      searchParams.append('page', params.page.toString())
    }
    if (params.limit) {
      searchParams.append('limit', params.limit.toString())
    }
    if (params.search) {
      searchParams.append('search', params.search)
    }

    const response = await fetch(`/api/forum/topics?${searchParams.toString()}`)
    
    if (!response.ok) {
      const errorData = await response.json()
      return { success: false, error: errorData.error || 'Failed to fetch topics' }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching forum topics:', error)
    return { success: false, error: 'Network error' }
  }
}

// Fetch a specific topic with comments
export async function fetchForumTopic(topicId: string): Promise<ForumResponse<TopicWithComments>> {
  try {
    console.log('Fetching topic with ID:', topicId)
    const response = await fetch(`/api/forum/topics/${topicId}`)
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData)
      return { success: false, error: errorData.error || 'Failed to fetch topic' }
    }

    const data = await response.json()
    console.log('Topic data received:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching forum topic:', error)
    return { success: false, error: 'Network error' }
  }
}

// Create a new forum topic
export async function createForumTopic(
  topicData: {
    title: string
    content: string
    category: string
  },
  token: string
): Promise<ForumResponse<ForumTopic>> {
  try {
    const response = await fetch('/api/forum/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(topicData),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create topic' }
    }

    return { success: true, data: data.topic }
  } catch (error) {
    console.error('Error creating forum topic:', error)
    return { success: false, error: 'Network error' }
  }
}

// Create a new comment
export async function createForumComment(
  commentData: {
    topic_id: string
    content: string
    author_name?: string // For anonymous comments
    parent_id?: string
  },
  token?: string
): Promise<ForumResponse<ForumComment>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    const response = await fetch('/api/forum/comments', {
      method: 'POST',
      headers,
      body: JSON.stringify(commentData),
    })

    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to create comment' }
    }

    return { success: true, data: data.comment }
  } catch (error) {
    console.error('Error creating forum comment:', error)
    return { success: false, error: 'Network error' }
  }
}

// Format date for display
export function formatForumDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
}

// Get category display name
export function getCategoryDisplayName(category: string): string {
  const categoryMap: Record<string, string> = {
    'political': 'Political',
    'economics': 'Economics',
    'sports': 'Sports',
    'social': 'Social',
    'technology': 'Technology',
    'general': 'General Discussion'
  }
  
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1)
}