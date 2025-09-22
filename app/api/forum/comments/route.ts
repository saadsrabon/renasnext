import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ForumComment from '@/lib/models/ForumComment'
import ForumTopic from '@/lib/models/ForumTopic'
import User from '@/lib/models/User'
import { authenticateUser } from '@/lib/auth-middleware'

// POST /api/forum/comments - Create new comment
// Anyone can comment, but they need to provide author_name if not logged in
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { topic_id, content, author_name, parent_id } = body

    // Validate required fields
    if (!topic_id || !content) {
      return NextResponse.json(
        { error: 'Topic ID and content are required' },
        { status: 400 }
      )
    }

    await connectDB()

    // Check if topic exists
    const topic = await ForumTopic.findById(topic_id)
    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    // Check if topic is locked
    if (topic.isLocked) {
      return NextResponse.json(
        { error: 'This topic is locked and cannot accept new comments' },
        { status: 403 }
      )
    }

    // Try to authenticate user (optional for comments)
    const authResult = await authenticateUser(request)
    let author = null
    let finalAuthorName = author_name || 'Anonymous'

    if (authResult.success && authResult.user) {
      // User is logged in
      author = authResult.user._id
      finalAuthorName = authResult.user.name
    } else {
      // Anonymous comment - require author_name
      if (!author_name) {
        return NextResponse.json(
          { error: 'Author name is required for anonymous comments' },
          { status: 400 }
        )
      }
    }

    // Validate parent comment if provided
    if (parent_id) {
      const parentComment = await ForumComment.findById(parent_id)
      if (!parentComment || parentComment.topic.toString() !== topic_id) {
        return NextResponse.json(
          { error: 'Invalid parent comment' },
          { status: 400 }
        )
      }
    }

    // Create comment
    const comment = new ForumComment({
      content: content.trim(),
      author: author, // Will be null for anonymous comments
      topic: topic_id,
      parentComment: parent_id || null
    })

    await comment.save()

    // Update topic reply count and last reply info
    const updateData: any = {
      $inc: { replies: 1 },
      lastReply: {
        author: author,
        createdAt: new Date()
      }
    }

    await ForumTopic.findByIdAndUpdate(topic_id, updateData)

    // Populate author details for response
    await comment.populate('author', 'name email avatar')
    
    // Add author name for response (for both logged in and anonymous)
    const responseComment = {
      ...comment.toObject(),
      authorName: finalAuthorName
    }
    
    return NextResponse.json({
      success: true,
      comment: responseComment,
      message: 'Comment added successfully'
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating comment:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: messages.join('. ') },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}