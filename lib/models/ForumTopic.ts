import mongoose, { Document, Schema } from 'mongoose'

export interface IForumTopic extends Document {
  _id: string
  title: string
  content: string
  author: mongoose.Types.ObjectId
  category: string
  tags: string[]
  isPinned: boolean
  isLocked: boolean
  views: number
  replies: number
  lastReply?: {
    author: mongoose.Types.ObjectId
    createdAt: Date
  }
  createdAt: Date
  updatedAt: Date
}

const ForumTopicSchema = new Schema<IForumTopic>(
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
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'general'
    },
    tags: [{
      type: String,
      trim: true
    }],
    isPinned: {
      type: Boolean,
      default: false
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    views: {
      type: Number,
      default: 0
    },
    replies: {
      type: Number,
      default: 0
    },
    lastReply: {
      author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      createdAt: Date
    }
  },
  {
    timestamps: true
  }
)

// Indexes for better performance
ForumTopicSchema.index({ author: 1 })
ForumTopicSchema.index({ category: 1 })
ForumTopicSchema.index({ createdAt: -1 })
ForumTopicSchema.index({ isPinned: -1, createdAt: -1 })
ForumTopicSchema.index({ tags: 1 })

export default mongoose.models.ForumTopic || mongoose.model<IForumTopic>('ForumTopic', ForumTopicSchema)


