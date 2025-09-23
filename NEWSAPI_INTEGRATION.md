# NewsAPI Integration for Saudi Arabia News

This document explains how to use the NewsAPI integration to automatically fetch and create posts from Saudi Arabia news sources.

## Overview

The integration fetches news articles from NewsAPI's Saudi Arabia headlines endpoint and converts them into posts in our database, following our content structure and categorization system.

## Features

- ✅ Fetches up to 50 latest news articles from Saudi Arabia
- ✅ Automatically categorizes articles based on NewsAPI categories
- ✅ Creates proper slugs and excerpts
- ✅ Handles duplicate detection
- ✅ Uses placeholder images when no image is available
- ✅ Creates a system user for automated posts
- ✅ Supports both manual and automated execution

## Setup

### 1. Environment Variables

Add your NewsAPI key to your `.env.local` file:

```bash
NEWSAPI_KEY=your_newsapi_key_here
```

**Note**: The script includes a default key for testing, but you should use your own key for production.

### 2. API Endpoint

The integration provides a REST API endpoint:

```
POST /api/newsapi/fetch-saudi-news
```

## Usage

### Manual Execution

#### Option 1: Using npm script (Recommended)
```bash
npm run fetch:news
```

#### Option 2: Direct script execution
```bash
node scripts/fetch-saudi-news.js
```

#### Option 3: API call
```bash
curl -X POST http://localhost:3000/api/newsapi/fetch-saudi-news
```

### Automated Execution (Cron Job)

To set up automatic news fetching every 6 hours, add this to your crontab:

```bash
# Edit crontab
crontab -e

# Add this line (adjust the path to your project)
0 */6 * * * cd /path/to/your/project && npm run fetch:news >> /var/log/renaspress-news.log 2>&1
```

#### Alternative cron schedules:
- Every hour: `0 * * * *`
- Every 4 hours: `0 */4 * * *`
- Daily at 6 AM: `0 6 * * *`
- Twice daily (6 AM and 6 PM): `0 6,18 * * *`

## Category Mapping

The integration maps NewsAPI categories to our internal categories:

| NewsAPI Category | Our Category |
|------------------|--------------|
| business         | daily-news   |
| entertainment    | daily-news   |
| general          | daily-news   |
| health           | charity      |
| science          | daily-news   |
| sports           | sports       |
| technology       | daily-news   |
| politics         | political-news |

Articles that don't match any category are randomly assigned to one of our categories.

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Successfully created 15 posts from Saudi Arabia news",
  "posts": [
    {
      "id": "post_id_here",
      "title": "Article Title",
      "category": "daily-news",
      "slug": "article-title"
    }
  ],
  "totalArticles": 50
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## System User

The integration creates a system user with the email `system@renaspress.com` to handle automated posts. This user:

- Has the "author" role
- Is created automatically if it doesn't exist
- Is used for all automated news posts

## Duplicate Detection

The system prevents duplicate posts by checking:

1. **Slug similarity**: Generated from the article title
2. **Exact title match**: Prevents identical titles

## Content Processing

### Title Processing
- Used as-is from NewsAPI
- Slug generated automatically
- Maximum length: 200 characters

### Content Processing
- HTML tags are stripped
- HTML entities are converted
- Whitespace is normalized

### Excerpt Generation
- Created from article description or content
- Maximum length: 200 characters
- HTML is cleaned

### Image Handling
- Uses `urlToImage` from NewsAPI if available
- Falls back to placeholder image if not available
- Images are stored as media attachments

## Error Handling

The integration includes comprehensive error handling:

- **Network errors**: Retries and graceful failure
- **API errors**: Logs and continues with other articles
- **Database errors**: Logs and continues
- **Invalid data**: Skips problematic articles

## Logging

The cron script provides detailed logging:

- ✅ Success messages with post counts
- ❌ Error messages with details
- 📝 List of created posts
- 📊 Statistics (total articles processed)

## Monitoring

### Check Recent Posts
```bash
# Check if posts were created recently
curl "http://localhost:3000/api/posts?limit=10" | jq '.posts[].title'
```

### View Logs
```bash
# If using cron with logging
tail -f /var/log/renaspress-news.log
```

## Troubleshooting

### Common Issues

1. **"NewsAPI request failed"**
   - Check your NewsAPI key
   - Verify internet connection
   - Check NewsAPI quota limits

2. **"No posts created"**
   - Check if articles exist in NewsAPI response
   - Verify duplicate detection isn't blocking all articles
   - Check database connection

3. **"Database connection failed"**
   - Verify MongoDB connection string
   - Check if database is running
   - Verify network connectivity

### Debug Mode

To run with more verbose logging, set the environment variable:

```bash
DEBUG=true npm run fetch:news
```

## Security Considerations

- The system user password is not secure (it's system-generated)
- Consider implementing proper authentication for the API endpoint
- Monitor NewsAPI usage to avoid quota limits
- Regularly review created posts for quality

## Future Enhancements

Potential improvements:

- [ ] Image download and storage to BunnyCDN
- [ ] Content translation (Arabic to English)
- [ ] Sentiment analysis
- [ ] Automatic tagging based on content
- [ ] Webhook notifications for new posts
- [ ] Rate limiting for API endpoint
- [ ] Admin dashboard for news management

## Support

For issues or questions:

1. Check the logs for error messages
2. Verify your NewsAPI key and quota
3. Test the API endpoint manually
4. Check database connectivity
5. Review the troubleshooting section above
