# Social Login Setup Guide

This guide explains how to set up social login (Google and Facebook) for your RenasPress website.

## Prerequisites

1. **Google Cloud Account**: For Google OAuth setup
2. **Facebook Developer Account**: For Facebook OAuth setup
3. **NextAuth.js**: Already installed and configured

## Setup Steps

### 1. Google OAuth Setup

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API"
   - Click "Enable"

#### Step 2: Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

#### Step 3: Add to Environment Variables
Add these to your `.env.local` file:
```env
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 2. Facebook OAuth Setup

#### Step 1: Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "Create App"
3. Choose "Consumer" app type
4. Fill in app details:
   - App Name: "RenasPress"
   - App Contact Email: your email
   - App Purpose: "Other"

#### Step 2: Add Facebook Login Product
1. In your app dashboard, click "Add Product"
2. Find "Facebook Login" and click "Set Up"
3. Choose "Web" platform
4. Add your site URL: `http://localhost:3000` (for development)

#### Step 3: Configure Facebook Login
1. Go to "Facebook Login" > "Settings"
2. Add valid OAuth redirect URIs:
   - `http://localhost:3000/api/auth/callback/facebook` (for development)
   - `https://yourdomain.com/api/auth/callback/facebook` (for production)
3. Go to "Settings" > "Basic"
4. Copy the App ID and App Secret

#### Step 4: Add to Environment Variables
Add these to your `.env.local` file:
```env
FACEBOOK_CLIENT_ID=your-facebook-app-id-here
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret-here
```

### 3. NextAuth Configuration

#### Step 1: Generate NextAuth Secret
Generate a random secret for NextAuth:
```bash
openssl rand -base64 32
```

#### Step 2: Add to Environment Variables
Add these to your `.env.local` file:
```env
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Complete Environment Variables

Your `.env.local` file should include:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret for authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# NextAuth.js Configuration
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000

# Social Login Providers
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
FACEBOOK_CLIENT_ID=your-facebook-app-id-here
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret-here

# Other existing variables...
```

## Features

### 1. Social Login Buttons
- Google login with Google branding
- Facebook login with Facebook branding
- Loading states during authentication
- Error handling with user-friendly messages

### 2. User Management
- Automatic user creation for social logins
- Integration with existing user system
- Support for both social and traditional login
- User roles and permissions maintained

### 3. Security
- Secure OAuth 2.0 flow
- JWT token management
- Session management
- CSRF protection

## Usage

### 1. Login Page
Users can now login using:
- Traditional email/password
- Google account
- Facebook account

### 2. Signup Page
Users can now register using:
- Traditional email/password form
- Google account (automatic registration)
- Facebook account (automatic registration)

### 3. User Experience
- Seamless integration with existing UI
- Consistent branding
- Mobile-responsive design
- Loading states and error handling

## Testing

### 1. Local Development
1. Start your development server: `yarn dev`
2. Navigate to `/login` or `/signup`
3. Test both Google and Facebook login
4. Verify user creation in database

### 2. Production Deployment
1. Update OAuth redirect URIs to production URLs
2. Update environment variables with production values
3. Test social login on production domain

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Check that redirect URIs match exactly in OAuth settings
   - Ensure no trailing slashes or extra characters

2. **"App not configured"**
   - Verify OAuth credentials are correct
   - Check that APIs are enabled in Google Cloud Console

3. **"User not created"**
   - Check database connection
   - Verify MongoDB URI is correct
   - Check server logs for errors

4. **"Session not persisting"**
   - Verify NEXTAUTH_SECRET is set
   - Check that cookies are enabled
   - Ensure proper domain configuration

### Debug Steps:
1. Check browser console for errors
2. Check server logs for authentication errors
3. Verify environment variables are loaded
4. Test OAuth URLs directly
5. Check database for user creation

## Security Best Practices

1. **Environment Variables**
   - Never commit secrets to version control
   - Use different credentials for development/production
   - Rotate secrets regularly

2. **OAuth Configuration**
   - Use HTTPS in production
   - Limit redirect URIs to your domains only
   - Regularly review OAuth app permissions

3. **User Data**
   - Only request necessary permissions
   - Handle user data according to privacy laws
   - Implement proper data retention policies

## Support

For issues with social login:
1. Check the browser console for errors
2. Verify OAuth provider configurations
3. Test the authentication flow step by step
4. Check server logs for detailed error messages
5. Ensure all environment variables are properly set
