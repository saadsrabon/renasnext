import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import { authenticateUser } from '@/lib/auth-middleware'

// POST - Like/unlike a post
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { action } = await request.json()
    const postId = params.id

    if (!action) {
      return NextResponse.json(
        { error: 'Action is required' },
        { status: 400 }
      )
    }

    if (!['like', 'unlike'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "like" or "unlike"' },
        { status: 400 }
      )
    }

    await connectDB()

    // Find the post
    const post = await Post.findById(postId)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Update likes count
    if (action === 'like') {
      post.likes += 1
    } else {
      post.likes = Math.max(0, post.likes - 1)
    }

    await post.save()

    return NextResponse.json({
      success: true,
      likes: post.likes,
      message: `Post ${action === 'like' ? 'liked' : 'unliked'} successfully`
    })

  } catch (error) {
    console.error('Error liking/unliking post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

