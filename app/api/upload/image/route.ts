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
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // BunnyCDN configuration
    const storageZoneName = process.env.BUNNYCDN_STORAGE_ZONE_NAME
    const accessKey = process.env.BUNNYCDN_ACCESS_KEY
    const hostname = process.env.BUNNYCDN_HOSTNAME
    const baseUrl = process.env.BUNNYCDN_BASE_URL

    console.log('BunnyCDN config:', {
      storageZoneName: storageZoneName ? 'SET' : 'MISSING',
      accessKey: accessKey ? 'SET' : 'MISSING',
      hostname: hostname ? 'SET' : 'MISSING',
      baseUrl: baseUrl ? 'SET' : 'MISSING'
    })

    if (!storageZoneName || !accessKey || !hostname ) {
      console.error('Missing BunnyCDN environment variables')
      return NextResponse.json(
        { error: 'BunnyCDN configuration missing. Please check environment variables.' },
        { status: 500 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `images/${timestamp}_${randomString}.${extension}`

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to BunnyCDN
    const uploadUrl = `https://${hostname}/${storageZoneName}/${filename}`
    
    console.log('Uploading image to:', uploadUrl)
    console.log('File size:', buffer.length, 'bytes')
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': accessKey,
        'Content-Type': 'application/octet-stream',
      },
      body: buffer,
      // Add timeout configuration
      // signal: AbortSignal.timeout(30000), // 30 second timeout for images
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('BunnyCDN upload error:', errorText)
      // Provide clearer guidance on common 401 Unauthorized cause
      if (uploadResponse.status === 401) {
        return NextResponse.json(
          { 
            error: 'Unauthorized uploading to BunnyCDN Storage. Verify that BUNNYCDN_STORAGE_ZONE_NAME matches your Storage Zone name and BUNNYCDN_ACCESS_KEY is the Storage Zone password (not the API key).',
            details: errorText
          },
          { status: 401 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to upload image to BunnyCDN', details: errorText },
        { status: 500 }
      )
    }

    // Construct the public URL
    const fileUrl = `${baseUrl}/${filename}`
    
    return NextResponse.json({
      success: true,
      id: `img_${timestamp}`,
      url: fileUrl,
      filename: filename.split('/').pop(), // Just the filename without path
      type: file.type,
      size: file.size,
      message: 'Image uploaded successfully to BunnyCDN'
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}