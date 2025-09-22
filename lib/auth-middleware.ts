import { NextRequest } from 'next/server'
import { verifyToken, extractTokenFromHeader, JWTPayload } from './jwt'
import connectDB from './mongodb'
import User, { IUser } from './models/User'

export interface AuthenticatedRequest extends NextRequest {
  user?: IUser
  token?: string
}

export async function authenticateUser(request: NextRequest): Promise<{
  success: boolean
  user?: IUser
  error?: string
}> {
  try {
    const authHeader = request.headers.get('Authorization')
    const token = extractTokenFromHeader(authHeader)

    if (!token) {
      return { success: false, error: 'No token provided' }
    }

    const payload = verifyToken(token)
    if (!payload) {
      return { success: false, error: 'Invalid token' }
    }

    await connectDB()
    const user = await User.findById(payload.userId).select('+password')
    
    if (!user || !user.isActive) {
      return { success: false, error: 'User not found or inactive' }
    }

    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Authentication failed' }
  }
}

export function requireAuth(allowedRoles?: string[]) {
  return async (request: NextRequest) => {
    const authResult = await authenticateUser(request)
    
    if (!authResult.success || !authResult.user) {
      return {
        success: false,
        error: authResult.error || 'Authentication required',
        status: 401
      }
    }

    if (allowedRoles && !allowedRoles.includes(authResult.user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions',
        status: 403
      }
    }

    return {
      success: true,
      user: authResult.user
    }
  }
}

export function requireRole(role: string | string[]) {
  const roles = Array.isArray(role) ? role : [role]
  return requireAuth(roles)
}


