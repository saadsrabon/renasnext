import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Post from '@/lib/models/Post'
import { authenticateUser } from '@/lib/auth-middleware'

// GET - Fetch user's saved posts
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

    await connectDB()

    // Get user with saved posts populated
    const user = await User.findById(authResult.user._id)
      .populate({
        path: 'savedPosts',
        populate: {
          path: 'author',
          select: 'name email'
        }
      })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      posts: user.savedPosts || []
    })

  } catch (error) {
    console.error('Error fetching saved posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Save/unsave a post
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { postId, action } = await request.json()

    if (!postId || !action) {
      return NextResponse.json(
        { error: 'Post ID and action are required' },
        { status: 400 }
      )
    }

    if (!['save', 'unsave'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "save" or "unsave"' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if post exists
    const post = await Post.findById(postId)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const user = await User.findById(authResult.user._id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (action === 'save') {
      // Add post to saved posts if not already saved
      if (!user.savedPosts.includes(postId)) {
        user.savedPosts.push(postId)
        await user.save()
      }
    } else if (action === 'unsave') {
      // Remove post from saved posts
      user.savedPosts = user.savedPosts.filter(id => id.toString() !== postId)
      await user.save()
    }

    return NextResponse.json({
      success: true,
      message: `Post ${action === 'save' ? 'saved' : 'unsaved'} successfully`
    })

  } catch (error) {
    console.error('Error saving/unsaving post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

