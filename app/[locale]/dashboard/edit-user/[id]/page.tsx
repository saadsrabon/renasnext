"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Save,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

interface UserDetails {
  _id: string
  name: string
  email: string
  role: 'admin' | 'author' | 'editor' | 'subscriber'
  isActive: boolean
  createdAt: string
  updatedAt: string
  avatar?: string
  provider?: string
}

export default function EditUserPage() {
  const t = useTranslations("dashboard")
  const { user: currentUser, token, loading: authLoading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const userId = params.id as string

  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push(`/${locale}/login`)
      return
    }
    if (currentUser && currentUser.role !== 'admin') {
      router.push(`/${locale}/dashboard`)
      return
    }
    if (currentUser && token) {
      fetchUserDetails()
    }
  }, [currentUser, token, authLoading, locale, userId])

  const fetchUserDetails = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await fetch(`/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUserDetails(data.user)
        } else {
          setMessage({ type: 'error', text: 'Failed to fetch user details' })
        }
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch user details' })
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
      setMessage({ type: 'error', text: 'Error fetching user details' })
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (newRole: string) => {
    if (!token || !userDetails) return
    
    try {
      setSaving(true)
      setMessage(null)
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          role: newRole
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserDetails(prev => prev ? { ...prev, role: newRole as any } : null)
          setMessage({ type: 'success', text: 'User role updated successfully!' })
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to update user role' })
        }
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.error || 'Failed to update user role' })
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      setMessage({ type: 'error', text: 'Error updating user role' })
    } finally {
      setSaving(false)
    }
  }

  const handleStatusToggle = async () => {
    if (!token || !userDetails) return
    
    try {
      setSaving(true)
      setMessage(null)
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isActive: !userDetails.isActive
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserDetails(prev => prev ? { ...prev, isActive: !prev.isActive } : null)
          setMessage({ type: 'success', text: `User ${!userDetails.isActive ? 'activated' : 'deactivated'} successfully!` })
        } else {
          setMessage({ type: 'error', text: data.error || 'Failed to update user status' })
        }
      } else {
        const errorData = await response.json()
        setMessage({ type: 'error', text: errorData.error || 'Failed to update user status' })
      }
    } catch (error) {
      console.error("Error updating user status:", error)
      setMessage({ type: 'error', text: 'Error updating user status' })
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-renas-gold-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            You need admin privileges to access this page.
          </p>
          <Link href={`/${locale}/dashboard`}>
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            User Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The user you're looking for doesn't exist.
          </p>
          <Link href={`/${locale}/dashboard`}>
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="renas-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/dashboard`}>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit User
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage user details and permissions
              </p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Information */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                User Information
              </h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={userDetails.name}
                    disabled
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={userDetails.email}
                    disabled
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="provider">Login Provider</Label>
                  <Input
                    id="provider"
                    value={userDetails.provider || 'Email/Password'}
                    disabled
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Created At</Label>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {formatDate(userDetails.createdAt)}
                    </div>
                  </div>
                  <div>
                    <Label>Last Updated</Label>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {formatDate(userDetails.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Role Management */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Role Management
              </h2>
              
              <div className="space-y-6">
                <div>
                  <Label htmlFor="role">User Role</Label>
                  <select
                    id="role"
                    value={userDetails.role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    disabled={saving}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="subscriber">Subscriber</option>
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select the user's role and permissions
                  </p>
                </div>

                <div>
                  <Label>Account Status</Label>
                  <div className="mt-1 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        userDetails.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">
                        {userDetails.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleStatusToggle}
                      disabled={saving}
                      className={userDetails.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                    >
                      {userDetails.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <h3 className="font-medium mb-2">Role Permissions:</h3>
                    <ul className="space-y-1 text-xs">
                      <li><strong>Subscriber:</strong> Read posts, save posts</li>
                      <li><strong>Author:</strong> Create, edit own posts</li>
                      <li><strong>Editor:</strong> Manage all posts, moderate content</li>
                      <li><strong>Admin:</strong> Full system access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
