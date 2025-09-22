import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/lib/models/User'
import Post from '@/lib/models/Post'
import { authenticateUser } from '@/lib/auth-middleware'

// GET - Fetch single user (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin or requesting their own profile
    const isAdmin = authResult.user.role === 'admin'
    const isOwnProfile = authResult.user._id.toString() === id

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    await connectDB()
    
    const user = await User.findById(id).select('-password').lean()

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update user (admin only, or user updating their own profile)
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
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const currentUser = authResult.user
    const isAdmin = currentUser.role === 'admin'
    const isOwnProfile = currentUser._id.toString() === id

    if (!isAdmin && !isOwnProfile) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    await connectDB()
    
    // Find the user to update
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, email, role, isActive, password } = body

    // Build update object
    const updateData: any = {}

    if (name !== undefined) {
      updateData.name = name.trim()
    }

    if (email !== undefined) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        )
      }

      // Check if email is already taken by another user
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: id }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'This email is already taken' },
          { status: 400 }
        )
      }

      updateData.email = email.toLowerCase()
    }

    // Only admins can change role and isActive status
    if (isAdmin) {
      if (role !== undefined) {
        const validRoles = ['admin', 'author', 'editor', 'subscriber']
        if (!validRoles.includes(role)) {
          return NextResponse.json(
            { error: 'Invalid role' },
            { status: 400 }
          )
        }
        updateData.role = role
      }

      if (isActive !== undefined) {
        updateData.isActive = Boolean(isActive)
      }
    }

    // Handle password update
    if (password !== undefined) {
      if (password.length < 8) {
        return NextResponse.json(
          { error: 'Password must be at least 8 characters' },
          { status: 400 }
        )
      }
      updateData.password = password
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'User updated successfully'
    })
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: messages.join('. ') },
        { status: 400 }
      )
    }

    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This email is already taken' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete user (admin only)
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
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    if (authResult.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    // Prevent admin from deleting themselves
    if (authResult.user._id.toString() === id) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      )
    }

    await connectDB()
    
    // Find the user
    const user = await User.findById(id)
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Optional: Handle user's posts (you might want to reassign them or delete them)
    const { searchParams } = new URL(request.url)
    const deleteUserPosts = searchParams.get('delete_posts') === 'true'

    if (deleteUserPosts) {
      // Delete all user's posts
      await Post.deleteMany({ author: id })
    } else {
      // Check if user has posts
      const postCount = await Post.countDocuments({ author: id })
      if (postCount > 0) {
        return NextResponse.json(
          { 
            error: `Cannot delete user with ${postCount} posts. Please reassign or delete posts first, or use delete_posts=true parameter.` 
          },
          { status: 400 }
        )
      }
    }

    // Delete the user
    await User.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



