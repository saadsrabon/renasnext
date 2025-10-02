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

# Google Cloud Translation API
GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key-here
GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id

# NextAuth.js Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Social Login Providers
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
FACEBOOK_CLIENT_ID=your-facebook-app-id-here
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret-here
```

## Setup Instructions

1. **MongoDB**: Already configured with your connection string
2. **JWT Secret**: Generate a random string (at least 32 characters)
3. **BunnyCDN**: Replace the placeholder values with your actual BunnyCDN credentials
   - Get these from your BunnyCDN dashboard
   - Storage Zone Name: Your storage zone identifier
   - Access Key: Your storage zone password/access key
   - Base URL: Your pull zone URL for serving files
4. **Google Translate API**: Set up Google Cloud Translation API
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Cloud Translation API
   - Create an API key in "APIs & Services" > "Credentials"
   - Replace `your-google-translate-api-key-here` with your actual API key
   - Replace `your-google-cloud-project-id` with your Google Cloud project ID
5. **Social Login Setup**: Configure social login providers
   - **NextAuth Secret**: Generate a random string (at least 32 characters)
   - **Google OAuth**: 
     - Go to [Google Cloud Console](https://console.cloud.google.com/)
     - Enable Google+ API
     - Create OAuth 2.0 credentials
     - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - **Facebook OAuth**:
     - Go to [Facebook Developers](https://developers.facebook.com/)
     - Create a new app
     - Add Facebook Login product
     - Add valid OAuth redirect URIs: `http://localhost:3000/api/auth/callback/facebook`

## Security Notes

- Never commit `.env.local` to version control
- Keep your JWT secret secure and random
- BunnyCDN credentials should be kept private
- The MongoDB connection string contains credentials - keep it secure




