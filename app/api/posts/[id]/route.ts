import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Post from '@/lib/models/Post'
import User from '@/lib/models/User'
import { authenticateUser } from '@/lib/auth-middleware'

// GET - Fetch single post
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    await connectDB()
    
    const post = await Post.findById(id)
      .populate('author', 'name email avatar')
      .lean()

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await Post.findByIdAndUpdate(id, { $inc: { views: 1 } })
    
    return NextResponse.json({
      success: true,
      post: { ...post, views: ((post as any).views || 0) + 1 }
    })
  } catch (error) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update post
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 401 }
      )
    }

    await connectDB()
    
    // Find the post
    const post = await Post.findById(id)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const user = authResult.user
    
    // Check if user can edit this post
    const canEdit = user.role === 'admin' || 
                   (user.role === 'editor') || 
                   (user.role === 'author' && post.author.toString() === user._id.toString())
    
    if (!canEdit) {
      return NextResponse.json(
        { error: 'Insufficient permissions to edit this post' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { title, content, excerpt, status, category, tags, media, featuredImage } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // Validate category
    const validCategories = ['daily-news', 'political-news', 'sports', 'woman', 'charity', 'general']
    if (category && !validCategories.includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category' },
        { status: 400 }
      )
    }

    // Update post
    const updateData: any = {
      title: title.trim(),
      content: content.trim()
    }

    if (excerpt !== undefined) updateData.excerpt = excerpt?.trim()
    if (status !== undefined) updateData.status = status === 'publish' ? 'published' : status
    if (category !== undefined) updateData.category = category
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : []
    if (media !== undefined) updateData.media = Array.isArray(media) ? media : []
    if (featuredImage !== undefined) updateData.featuredImage = featuredImage

    // Update publishedAt when status changes to published
    if (status === 'published' && post.status !== 'published') {
      updateData.publishedAt = new Date()
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('author', 'name email avatar')

    return NextResponse.json({
      success: true,
      post: updatedPost,
      message: 'Post updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating post:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: messages.join('. ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 401 }
      )
    }

    await connectDB()
    
    // Find the post
    const post = await Post.findById(id)
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    const user = authResult.user
    
    // Check if user can delete this post
    const canDelete = user.role === 'admin' || 
                     (user.role === 'author' && post.author.toString() === user._id.toString())
    
    if (!canDelete) {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete this post' },
        { status: 403 }
      )
    }

    await Post.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}