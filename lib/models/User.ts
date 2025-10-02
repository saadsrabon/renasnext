import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  _id: string
  name: string
  email: string
  password?: string
  role: 'admin' | 'author' | 'editor' | 'subscriber'
  avatar?: string
  isActive: boolean
  provider?: string
  providerId?: string
  savedPosts: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    password: {
      type: String,
      required: function() {
        return !this.provider // Only required if not a social login user
      },
      minlength: [8, 'Password must be at least 8 characters'],
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'author', 'editor', 'subscriber'],
      default: 'author'
    },
    avatar: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true
    },
    provider: {
      type: String,
      enum: ['google', 'facebook', 'credentials'],
      default: 'credentials'
    },
    providerId: {
      type: String,
      sparse: true // Allows multiple null values
    },
    savedPosts: [{
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }]
  },
  {
    timestamps: true
  }
)

// Index for faster queries (email already has unique index from unique: true)
UserSchema.index({ role: 1 })

// Hash password before saving (only for non-social login users)
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Remove password from JSON output
UserSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)


