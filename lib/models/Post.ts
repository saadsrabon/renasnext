import mongoose, { Document, Schema } from 'mongoose'

export interface IPost extends Document {
  _id: string
  title: string
  content: string
  excerpt?: string
  slug: string
  status: 'draft' | 'published' | 'archived'
  author: mongoose.Types.ObjectId
  category: string
  tags: string[]
  featuredImage?: string
  media: {
    type: 'image' | 'video'
    url: string
    title?: string
    description?: string
  }[]
  views: number
  likes: number
  publishedAt?: Date
  // Translation fields
  originalLanguage: string
  translations?: {
    [languageCode: string]: {
      title: string
      content: string
      excerpt?: string
      translatedAt: Date
    }
  }
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot be more than 500 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft'
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['daily-news', 'political-news', 'sports', 'woman', 'charity', 'general']
    },
    tags: [{
      type: String,
      trim: true
    }],
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required']
    },
    media: [{
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      title: String,
      description: String
    }],
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    publishedAt: {
      type: Date,
      default: null
    },
    // Translation fields
    originalLanguage: {
      type: String,
      default: 'en',
      enum: ['en', 'ar']
    },
    translations: {
      type: Map,
      of: {
        title: String,
        content: String,
        excerpt: String,
        translatedAt: {
          type: Date,
          default: Date.now
        }
      },
      default: {}
    }
  },
  {
    timestamps: true
  }
)

// Indexes for better performance
PostSchema.index({ slug: 1 })
PostSchema.index({ author: 1 })
PostSchema.index({ category: 1 })
PostSchema.index({ status: 1 })
PostSchema.index({ publishedAt: -1 })
PostSchema.index({ createdAt: -1 })
PostSchema.index({ tags: 1 })

// Generate slug from title before saving
PostSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  
  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  
  next()
})

// Virtual for author population
PostSchema.virtual('authorDetails', {
  ref: 'User',
  localField: 'author',
  foreignField: '_id',
  justOne: true
})

// Ensure virtuals are included in JSON output
PostSchema.set('toJSON', { virtuals: true })
PostSchema.set('toObject', { virtuals: true })

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema)


