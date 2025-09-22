import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ForumTopic from '@/lib/models/ForumTopic'
import User from '@/lib/models/User'
import { authenticateUser } from '@/lib/auth-middleware'

// GET /api/forum/topics - Fetch all topics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''

    await connectDB()

    // Build query
    const query: any = {}
    
    if (category !== 'all') {
      query.category = category
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Get topics with author details, sorted by pinned first, then by last reply or creation date
    const topics = await ForumTopic.find(query)
      .populate('author', 'name email avatar')
      .populate('lastReply.author', 'name')
      .sort({ isPinned: -1, 'lastReply.createdAt': -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await ForumTopic.countDocuments(query)
    const totalPages = Math.ceil(total / limit)
    
    return NextResponse.json({
      success: true,
      topics,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })

  } catch (error) {
    console.error('Error fetching topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch topics' },
      { status: 500 }
    )
  }
}

// POST /api/forum/topics - Create new topic (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required to create topics' },
        { status: 401 }
      )
    }

    const user = authResult.user
    const body = await request.json()
    const { title, content, category = 'general', tags = [] } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Create new topic
    const topic = new ForumTopic({
      title: title.trim(),
      content: content.trim(),
      author: user._id,
      category,
      tags: Array.isArray(tags) ? tags : []
    })

    await topic.save()

    // Populate author details for response
    await topic.populate('author', 'name email avatar')
    
    return NextResponse.json({
      success: true,
      topic,
      message: 'Topic created successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating topic:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: messages.join('. ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create topic' },
      { status: 500 }
    )
  }
}