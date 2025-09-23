const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/renaspress';

// User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isActive: Boolean
}, { timestamps: true });

// Post schema
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  excerpt: String,
  slug: String,
  status: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: String,
  tags: [String],
  featuredImage: String,
  media: [{
    type: String,
    url: String,
    title: String,
    description: String
  }],
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  publishedAt: Date
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);

async function seedPosts() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find or create admin user
    let admin = await User.findOne({ email: 'admin@renaspress.com' });
    if (!admin) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash('admin123456', salt);
      
      admin = new User({
        name: 'Admin User',
        email: 'admin@renaspress.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      await admin.save();
      console.log('Admin user created');
    }

    // Sample posts data
    const samplePosts = [
      {
        title: 'Breaking: Major Economic Reform Announced',
        content: 'The government has announced a comprehensive economic reform package aimed at boosting growth and creating jobs. This historic announcement comes after months of deliberation and consultation with economic experts.',
        excerpt: 'Government announces major economic reforms to boost growth and employment.',
        category: 'daily-news',
        tags: ['economy', 'government', 'reform'],
        status: 'published'
      },
      {
        title: 'Political Leaders Meet for Historic Summit',
        content: 'World leaders gathered today for an unprecedented summit to discuss global challenges including climate change, economic cooperation, and international security.',
        excerpt: 'World leaders convene for historic summit on global challenges.',
        category: 'political-news',
        tags: ['politics', 'summit', 'international'],
        status: 'published'
      },
      {
        title: 'Sports Championship Finals This Weekend',
        content: 'The most anticipated sports championship of the year is set to take place this weekend, with teams from across the region competing for the ultimate prize.',
        excerpt: 'Championship finals promise exciting competition this weekend.',
        category: 'sports',
        tags: ['sports', 'championship', 'competition'],
        status: 'published'
      },
      {
        title: 'Women in Leadership: Breaking Barriers',
        content: 'A new report highlights the increasing role of women in leadership positions across various sectors, showcasing inspiring stories of success and determination.',
        excerpt: 'Report showcases women breaking barriers in leadership roles.',
        category: 'woman',
        tags: ['women', 'leadership', 'empowerment'],
        status: 'published'
      },
      {
        title: 'Community Charity Drive Exceeds Goals',
        content: 'The annual community charity drive has exceeded all expectations, raising record amounts for local families in need. Volunteers worked tirelessly to make this success possible.',
        excerpt: 'Annual charity drive breaks records in community support.',
        category: 'charity',
        tags: ['charity', 'community', 'fundraising'],
        status: 'published'
      },
      {
        title: 'Technology Innovation Summit 2024',
        content: 'Tech industry leaders showcase the latest innovations at this year\'s technology summit, featuring breakthrough developments in AI, renewable energy, and digital health.',
        excerpt: 'Tech summit reveals cutting-edge innovations for 2024.',
        category: 'general',
        tags: ['technology', 'innovation', 'AI'],
        status: 'published'
      }
    ];

    // Check if posts already exist
    const existingPosts = await Post.countDocuments();
    if (existingPosts > 0) {
      console.log(`${existingPosts} posts already exist. Skipping post creation.`);
      return;
    }

    // Create posts
    for (const postData of samplePosts) {
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-') + '-' + Date.now();

      const post = new Post({
        ...postData,
        slug,
        author: admin._id,
        publishedAt: new Date(),
        views: Math.floor(Math.random() * 100),
        likes: Math.floor(Math.random() * 50)
      });

      await post.save();
      console.log(`Created post: ${postData.title}`);
    }

    console.log('Sample posts created successfully!');

  } catch (error) {
    console.error('Error seeding posts:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedPosts();






