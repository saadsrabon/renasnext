# Forum Setup Guide

## WordPress Setup

### 1. Add Code to functions.php

Copy the entire contents of `wordpress-setup/functions.php` and add it to your active theme's `functions.php` file.

**Location**: `wp-content/themes/your-theme/functions.php`

### 2. WordPress Admin Setup

After adding the code:

1. **Go to WordPress Admin** → **Forum Topics** (new menu item should appear)
2. **Create some test topics**:
   - Click "Add New Topic"
   - Add title and content
   - Select a category
   - Publish the topic
3. **Verify categories**:
   - Go to **Forum Topics** → **Categories**
   - You should see: General Discussion, Political, Economics, Sports, Social, Technology

### 3. Test WordPress API

Run the test script to verify everything is working:

```bash
node test-wordpress-forum.js
```

Expected output:
- ✅ Found X forum topics
- ✅ Found 6 forum categories
- ✅ Custom comment endpoint is working
- ✅ Comment created successfully

## Frontend Setup

The frontend is already configured to work with WordPress. The API routes will:

1. **Fetch topics** from `https://renaspress.com/wp-json/wp/v2/forum-topics`
2. **Create topics** via `https://renaspress.com/wp-json/wp/v2/forum-topics`
3. **Fetch comments** from `https://renaspress.com/wp-json/forum/v1/topics/{id}/comments`
4. **Create comments** via `https://renaspress.com/wp-json/forum/v1/comments`

## Testing the Forum

1. **Start your Next.js app**:
   ```bash
   npm run dev
   ```

2. **Visit the forum**:
   - English: `http://localhost:3000/en/forums`
   - Arabic: `http://localhost:3000/ar/forums`

3. **Test functionality**:
   - ✅ View forum topics (fetched from WordPress)
   - ✅ Filter by category
   - ✅ Search topics
   - ✅ Click "Join Discussion" to view topic details
   - ✅ Add comments (both logged-in and anonymous)
   - ✅ Create new topics (requires login)

## Troubleshooting

### If topics don't load:
1. Check if the WordPress API is accessible: `https://renaspress.com/wp-json/wp/v2/forum-topics`
2. Verify the custom post type is registered
3. Check browser console for errors

### If comments don't work:
1. Check if the custom REST API endpoints are working
2. Verify the comment creation endpoint: `https://renaspress.com/wp-json/forum/v1/comments`
3. Check WordPress error logs

### If you get CORS errors:
The functions.php code includes CORS headers, but if you still get errors, you may need to add additional CORS configuration to your WordPress server.

## Features Implemented

✅ **WordPress Integration**:
- Custom post type for forum topics
- Custom taxonomy for categories
- Custom REST API endpoints for comments
- Reply count and last reply tracking

✅ **Frontend Features**:
- Topic listing with search and filtering
- Topic detail pages with comments
- Anonymous and logged-in commenting
- Topic creation (requires login)
- Responsive design
- Internationalization support

✅ **Authentication**:
- Only logged-in users can create topics
- Both logged-in and anonymous users can comment
- Proper error handling and redirects

## Next Steps

1. **Add authentication** to topic creation (currently allows any user)
2. **Add moderation features** (approve/reject comments)
3. **Add user profiles** and reputation system
4. **Add email notifications** for new comments
5. **Add file uploads** for topic attachments

