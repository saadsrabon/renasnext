import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth-middleware'

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateUser(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { error: authResult.error || 'Authentication required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, OGG, AVI, and MOV videos are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024 // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 100MB.' },
        { status: 400 }
      )
    }

    // BunnyCDN configuration
    const storageZoneName = process.env.BUNNYCDN_STORAGE_ZONE_NAME
    const accessKey = process.env.BUNNYCDN_ACCESS_KEY
    const hostname = process.env.BUNNYCDN_HOSTNAME
    const baseUrl = process.env.BUNNYCDN_BASE_URL
  console.log({
    storageZoneName,
    accessKey,
    hostname,
    baseUrl
  })
    if (!storageZoneName || !accessKey || !hostname || !baseUrl) {
      return NextResponse.json(
        { error: 'BunnyCDN configuration missing. Please check environment variables.' },
        { status: 500 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop() || 'mp4'
    const filename = `videos/${timestamp}_${randomString}.${extension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to BunnyCDN
    const uploadUrl = `https://${hostname}/${storageZoneName}/${filename}`
    
    console.log('Uploading video to:', uploadUrl)
    console.log('File size:', buffer.length, 'bytes')
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': accessKey,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
      // Add timeout and retry configuration
      // 60 second timeout
    })

    // if (!uploadResponse.HttpCode) {
    //   const errorText = await uploadResponse.text()
    //   console.error('BunnyCDN upload error:', errorText)
    //   if (uploadResponse.status === 401) {
    //     return NextResponse.json(
    //       { 
    //         error: 'Unauthorized uploading to BunnyCDN Storage. Verify that BUNNYCDN_STORAGE_ZONE_NAME matches your Storage Zone name and BUNNYCDN_ACCESS_KEY is the Storage Zone password (not the API key).',
    //         details: errorText
    //       },
    //       { status: 401 }
    //     )
    //   }
    //   return NextResponse.json(
    //     { error: 'Failed to upload video to BunnyCDN', details: errorText },
    //     { status: 500 }
    //   )
    // }

    // Construct the public URL
    const publicUrl = `${baseUrl}/${filename}`
    
    return NextResponse.json({
      success: true,
      id: `video_${timestamp}`,
      url: publicUrl,
      filename: filename.split('/').pop(), // Just the filename without path
      type: file.type,
      size: file.size,
      message: 'Video uploaded successfully to BunnyCDN'
    })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}