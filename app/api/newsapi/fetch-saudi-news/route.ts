import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import User from '@/lib/models/User'

const NEWSAPI_KEY = process.env.NEWSAPI_KEY || 'a7c46deb9a864c0885dbd6382899f52e'
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2'

// Categories mapping from NewsAPI to our categories
const CATEGORY_MAPPING: Record<string, string> = {
  'business': 'daily-news',
  'entertainment': 'daily-news',
  'general': 'daily-news',
  'health': 'charity',
  'science': 'daily-news',
  'sports': 'sports',
  'technology': 'daily-news',
  'politics': 'political-news'
}

// Get a random category for variety
const getRandomCategory = (): string => {
  const categories = ['daily-news', 'charity', 'sports', 'woman', 'political-news']
  return categories[Math.floor(Math.random() * categories.length)]
}

// Generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 50) // Limit length
}

// Clean HTML content
const cleanContent = (content: string): string => {
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
}

// Create excerpt from content
const createExcerpt = (content: string, maxLength: number = 200): string => {
  const cleaned = cleanContent(content)
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // Get or create a system user for automated posts
    let systemUser = await User.findOne({ email: 'system@renaspress.com' })
    if (!systemUser) {
      systemUser = new User({
        name: 'RenasPress System',
        email: 'system@renaspress.com',
        password: 'system-generated-user',
        role: 'author'
      })
      await systemUser.save()
    }

    // Fetch news from NewsAPI
    const response = await fetch(
      `${NEWSAPI_BASE_URL}/top-headlines?country=sa&apiKey=${NEWSAPI_KEY}&pageSize=50`,
      {
        headers: {
          'User-Agent': 'RenasPress/1.0'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`NewsAPI request failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'ok') {
      throw new Error(`NewsAPI error: ${data.message || 'Unknown error'}`)
    }

    const articles = data.articles || []
    const createdPosts = []

    for (const article of articles) {
      try {
        // Skip if required fields are missing
        if (!article.title || !article.description || !article.url) {
          continue
        }

        // Check if post already exists (by URL or similar title)
        const existingPost = await Post.findOne({
          $or: [
            { slug: generateSlug(article.title) },
            { title: article.title }
          ]
        })

        if (existingPost) {
          continue // Skip duplicate
        }

        // Determine category
        const category = CATEGORY_MAPPING[article.category] || getRandomCategory()

        // Create post data
        const postData = {
          title: article.title,
          content: article.content || article.description,
          excerpt: createExcerpt(article.description || article.content),
          slug: generateSlug(article.title),
          status: 'published' as const,
          author: systemUser._id,
          category,
          tags: article.category ? [article.category] : [],
          featuredImage: article.urlToImage || 'https://via.placeholder.com/800x600?text=News+Image',
          media: article.urlToImage ? [{
            type: 'image' as const,
            url: article.urlToImage,
            title: article.title,
            description: article.description
          }] : [],
          views: 0,
          likes: 0,
          publishedAt: new Date(article.publishedAt || new Date())
        }

        // Create the post
        const post = new Post(postData)
        await post.save()

        // Populate author for response
        await post.populate('author', 'name email')

        createdPosts.push({
          id: post._id,
          title: post.title,
          category: post.category,
          slug: post.slug
        })

      } catch (error) {
        console.error(`Error creating post for article "${article.title}":`, error)
        continue // Continue with next article
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdPosts.length} posts from Saudi Arabia news`,
      posts: createdPosts,
      totalArticles: articles.length
    })

  } catch (error) {
    console.error('Error fetching Saudi Arabia news:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch news' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to manually trigger the news fetch
export async function GET() {
  return NextResponse.json({
    message: 'Use POST method to fetch Saudi Arabia news',
    usage: 'POST /api/newsapi/fetch-saudi-news'
  })
}
