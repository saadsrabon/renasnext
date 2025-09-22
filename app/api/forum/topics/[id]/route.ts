import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ForumTopic from '@/lib/models/ForumTopic'
import ForumComment from '@/lib/models/ForumComment'
import User from '@/lib/models/User'

// GET - Fetch single topic with comments
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Validate ObjectId format
    if (!id || id.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid topic ID format' },
        { status: 400 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    await connectDB()
    
    // Find topic and increment view count
    const topic = await ForumTopic.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name email avatar')
      .populate('lastReply.author', 'name')
      .lean()

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      )
    }

    // Get comments for this topic
    const skip = (page - 1) * limit
    const comments = await ForumComment.find({ 
      topic: id, 
      isDeleted: false 
    })
      .populate('author', 'name email avatar')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total comment count
    const totalComments = await ForumComment.countDocuments({ 
      topic: id, 
      isDeleted: false 
    })
    const totalPages = Math.ceil(totalComments / limit)
    
    return NextResponse.json({
      success: true,
      topic,
      comments,
      pagination: {
        page,
        limit,
        total: totalComments,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching topic:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}