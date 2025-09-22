import mongoose, { Document, Schema } from 'mongoose'

export interface IForumComment extends Document {
  _id: string
  content: string
  author: mongoose.Types.ObjectId
  topic: mongoose.Types.ObjectId
  parentComment?: mongoose.Types.ObjectId
  likes: number
  isDeleted: boolean
  createdAt: Date
  updatedAt: Date
}

const ForumCommentSchema = new Schema<IForumComment>(
  {
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    topic: {
      type: Schema.Types.ObjectId,
      ref: 'ForumTopic',
      required: true
    },
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: 'ForumComment',
      default: null
    },
    likes: {
      type: Number,
      default: 0
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

// Indexes for better performance
ForumCommentSchema.index({ topic: 1, createdAt: 1 })
ForumCommentSchema.index({ author: 1 })
ForumCommentSchema.index({ parentComment: 1 })

export default mongoose.models.ForumComment || mongoose.model<IForumComment>('ForumComment', ForumCommentSchema)


