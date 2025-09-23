# Environment Variables Setup

Create a `.env.local` file in the root directory with the following variables:

```bash
# MongoDB Configuration
MONGODB_URI=mongodb+srv://jreliteserviceshello_db_user:gutHleVIN7VsojbF@cluster0.qswcdfa.mongodb.net/renaspress

# JWT Secret for authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# BunnyCDN Configuration for media uploads
BUNNYCDN_STORAGE_ZONE_NAME=your_storage_zone_name
BUNNYCDN_ACCESS_KEY=your_bunnycdn_access_key
BUNNYCDN_HOSTNAME=storage.bunnycdn.com
BUNNYCDN_BASE_URL=https://your-pull-zone-url.b-cdn.net

# Next.js Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Renas PRESS"
```

## Setup Instructions

1. **MongoDB**: Already configured with your connection string
2. **JWT Secret**: Generate a random string (at least 32 characters)
3. **BunnyCDN**: Replace the placeholder values with your actual BunnyCDN credentials
   - Get these from your BunnyCDN dashboard
   - Storage Zone Name: Your storage zone identifier
   - Access Key: Your storage zone password/access key
   - Base URL: Your pull zone URL for serving files

## Security Notes

- Never commit `.env.local` to version control
- Keep your JWT secret secure and random
- BunnyCDN credentials should be kept private
- The MongoDB connection string contains credentials - keep it secure




