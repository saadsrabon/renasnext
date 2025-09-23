# Renas PRESS - Full Stack Conversion Complete

## Overview

This project has been successfully converted from WordPress dependency to a pure **Next.js full-stack application** with **MongoDB** as the database. All WordPress integrations have been removed and replaced with native MongoDB implementations.

## ✅ Features Implemented

### 🔐 Authentication System
- **User Registration**: New users automatically get 'author' role
- **User Login**: JWT-based authentication
- **User Logout**: Secure logout functionality
- **Role-based Access Control**: Admin, Author, Editor, Subscriber roles

### 📝 Post Management
- **Create Posts**: Authors can create posts with rich content
- **Edit Posts**: Authors can edit their own posts, admins can edit all
- **Delete Posts**: Authors can delete their own posts, admins can delete all
- **Media Support**: Images and videos uploaded to BunnyCDN
- **Categories**: daily-news, political-news, sports, woman, charity, general
- **Status Management**: Draft, Published, Archived

### 💬 Forum System
- **Topic Creation**: Authenticated users can create forum topics
- **Anonymous Comments**: Anyone can comment on existing topics
- **Authenticated Comments**: Logged-in users get their name automatically
- **Threaded Discussions**: Support for parent-child comment relationships
- **Topic Management**: View counts, reply counts, last reply tracking

### 👥 User Management (Admin Only)
- **User List**: View all users with pagination and search
- **Add Users**: Create new users with any role
- **Edit Users**: Update user details and roles
- **Delete Users**: Remove users (with post handling options)
- **Role Management**: Admin, Author, Editor, Subscriber

### 📁 Media Upload
- **Image Upload**: JPEG, PNG, GIF, WebP support (up to 10MB)
- **Video Upload**: MP4, WebM, OGG, AVI, MOV support (up to 100MB)
- **BunnyCDN Integration**: All media stored on BunnyCDN for performance
- **Secure Upload**: Authentication required for uploads

## 🗂️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Posts
- `GET /api/posts` - List posts (public)
- `POST /api/posts` - Create post (auth required)
- `GET /api/posts/[id]` - Get single post
- `PUT /api/posts/[id]` - Update post (auth required)
- `DELETE /api/posts/[id]` - Delete post (auth required)
- `GET /api/posts/user` - Get current user's posts

### Forum
- `GET /api/forum/topics` - List forum topics
- `POST /api/forum/topics` - Create topic (auth required)
- `GET /api/forum/topics/[id]` - Get topic with comments
- `POST /api/forum/comments` - Add comment (anonymous or auth)

### Users (Admin Only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get single user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Media Upload
- `POST /api/upload/image` - Upload image to BunnyCDN
- `POST /api/upload/video` - Upload video to BunnyCDN

## 🗄️ Database Models

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'admin' | 'author' | 'editor' | 'subscriber'
  avatar?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}
```

### Post Model
```typescript
{
  title: string
  content: string
  excerpt?: string
  slug: string (unique)
  status: 'draft' | 'published' | 'archived'
  author: ObjectId (User)
  category: string
  tags: string[]
  featuredImage?: string
  media: Array<{type: 'image'|'video', url: string}>
  views: number
  likes: number
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

### Forum Topic Model
```typescript
{
  title: string
  content: string
  author: ObjectId (User)
  category: string
  tags: string[]
  isPinned: boolean
  isLocked: boolean
  views: number
  replies: number
  lastReply?: {author: ObjectId, createdAt: Date}
  createdAt: Date
  updatedAt: Date
}
```

### Forum Comment Model
```typescript
{
  content: string
  author?: ObjectId (User) // null for anonymous
  topic: ObjectId (ForumTopic)
  parentComment?: ObjectId (ForumComment)
  likes: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   - Copy variables from `ENV_SETUP.md` to `.env.local`
   - Update BunnyCDN credentials
   - Set JWT secret

3. **Database Setup**
   - MongoDB is already configured with your connection string
   - Run admin seeder: `npm run seed:admin`

4. **Start Development**
   ```bash
   npm run dev
   ```

5. **Admin Access**
   - Email: admin@renaspress.com
   - Password: admin123456
   - **Change password after first login!**

## 🔧 Configuration

### MongoDB
- Connection string is pre-configured
- Database: `renaspress`
- Models include proper indexing for performance

### BunnyCDN
- Both images and videos upload to BunnyCDN
- Configure in environment variables
- Supports large file uploads

### Theme
- Default theme set to dark [[memory:7637972]]
- Uses sky blue (#0ea5e9) as primary color [[memory:6887947]]
- Supports Tiro Bangla font for Bangla text [[memory:6887953]]

## 🏗️ Architecture

- **Feature-first clean architecture** [[memory:7699557]]
- **MongoDB** for data persistence
- **JWT** for authentication
- **BunnyCDN** for media storage
- **shadcn UI** components [[memory:8153903]]
- **Heroicons** for icons [[memory:6877698]]

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- File type validation for uploads
- Input validation and sanitization
- Protected API routes

## 📱 User Roles & Permissions

### Admin
- Full access to everything
- User management (CRUD)
- All post management
- Forum moderation

### Author (Default for signups)
- Create, edit, delete own posts
- Create forum topics
- Comment on forums
- Upload media

### Editor
- Edit any posts
- Create, edit, delete own posts
- Forum participation

### Subscriber
- View content
- Comment on forums (anonymous or logged in)

## 🚫 Removed Dependencies

All WordPress integrations have been removed:
- WordPress REST API
- WordPress authentication
- WordPress custom post types
- PHP files and plugins
- WordPress configuration files

The application is now a pure Next.js full-stack solution with MongoDB.




