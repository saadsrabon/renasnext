import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import User from '@/lib/models/User'
import { authenticateUser } from '@/lib/auth-middleware'

// GET - Fetch current user's posts
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = authResult.user
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')
    const status = searchParams.get('status') || 'all'
    const search = searchParams.get('search') || ''

    await connectDB()

    // Build query
    const query: any = { author: user._id }
    
    if (status !== 'all') {
      query.status = status
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    // Calculate pagination
    const skip = (page - 1) * perPage
    
    // Get user's posts
    const posts = await Post.find(query)
      .populate('author', 'name email avatar')
      .sort({ createdAt: -1 })
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
    console.error('Error fetching user posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}