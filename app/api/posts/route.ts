import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import User from '@/lib/models/User'

// Ensure models are registered
import '@/lib/models/User'
import '@/lib/models/Post'

// GET - Fetch posts (public or user-specific)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const slug = searchParams.get('slug')
    const status = searchParams.get('status') || 'published'
    
    await connectDB()

    // Build query
    const query: any = { status }
    
    if (category && category !== 'all') {
      query.category = category
    }
    
    if (slug) {
      query.slug = slug
    } else if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * perPage
    
    // Get posts with author details
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean()

    // Get total count for pagination
    const total = await Post.countDocuments(query)
    const totalPages = Math.ceil(total / perPage)
    
    return NextResponse.json({
      success: true,
      posts,
      pagination: {
        page,
        perPage,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new post
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    
    // Import auth middleware here to avoid circular dependency
    const { authenticateUser } = await import('@/lib/auth-middleware')
    const authResult = await authenticateUser(request)
    
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 401 }
      )
    }

    // Check if user has permission to create posts
    const user = authResult.user
    if (!['admin', 'author', 'editor'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions to create posts' },
        { status: 403 }
      )
    }

    await connectDB()
    
    const body = await request.json()
    const { title, content, excerpt, status = 'draft', category = 'general', tags = [], media = [], featuredImage } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    if (!featuredImage || typeof featuredImage !== 'string' || featuredImage.trim().length === 0) {
      return NextResponse.json(
        { error: 'Featured image is required' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['daily-news', 'political-news', 'sports', 'woman', 'charity', 'general']
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-') + '-' + Date.now()

    // Create post
    const post = new Post({
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim(),
      slug,
      status: status === 'publish' ? 'published' : status,
      author: user._id,
      category,
      tags: Array.isArray(tags) ? tags : [],
      featuredImage: featuredImage.trim(),
      media: Array.isArray(media) ? media : []
    })

    await post.save()

    // Populate author details for response
    await post.populate('author', 'name email avatar')
    
    return NextResponse.json({
      success: true,
      post,
      message: 'Post created successfully'
    })

  } catch (error: any) {
    console.error('Error creating post:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: messages.join('. ') },
        { status: 400 }
      )
    }

    // Handle duplicate slug error
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json(
        { error: 'A post with similar title already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
