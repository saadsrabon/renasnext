import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import { authenticateUser } from '@/lib/auth-middleware'

// Ensure models are registered
import '@/lib/models/Post'

// POST - Bulk publish posts
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 401 }
      )
    }

    // Check if user has admin role
    const user = authResult.user
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can bulk publish posts' },
        { status: 403 }
      )
    }

    await connectDB()
    
    const body = await request.json()
    const { postIds } = body

    if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
      return NextResponse.json(
        { error: 'Post IDs array is required' },
        { status: 400 }
      )
    }

    // Update posts to published status
    const result = await Post.updateMany(
      { 
        _id: { $in: postIds },
        status: { $ne: 'published' } // Only update posts that aren't already published
      },
      { 
        status: 'published',
        publishedAt: new Date()
      }
    )

    return NextResponse.json({
      success: true,
      publishedCount: result.modifiedCount,
      message: `Successfully published ${result.modifiedCount} post(s)`
    })

  } catch (error: any) {
    console.error('Error bulk publishing posts:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
