# BunnyCDN Setup Guide

## Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# BunnyCDN Configuration
BUNNYCDN_API_KEY=your_bunnycdn_api_key
BUNNYCDN_STORAGE_ZONE_NAME=your_storage_zone_name
BUNNYCDN_STORAGE_ZONE_REGION=de
BUNNYCDN_PULL_ZONE_URL=your_pull_zone_url.b-cdn.net
```

## Setup Steps

1. **Create BunnyCDN Account**
   - Go to [bunnycdn.com](https://bunnycdn.com)
   - Sign up for an account

2. **Create Storage Zone**
   - Navigate to Storage → Add Storage Zone
   - Choose a name for your storage zone
   - Select a region (recommended: Frankfurt for Europe)
   - Note down the storage zone name

3. **Get API Key**
   - Go to Account → API
   - Generate or copy your API key

4. **Create Pull Zone (Optional)**
   - Navigate to Pull Zones → Add Pull Zone
   - Connect it to your storage zone
   - This will give you a CDN URL for faster access

5. **Configure Environment Variables**
   - Add the credentials to your `.env.local` file
   - The storage zone region should be the region code (e.g., 'de' for Frankfurt)

## Usage

The video upload functionality will automatically:
- Upload videos to your BunnyCDN storage zone
- Return the public URL for embedding in posts
- Fall back to local storage if BunnyCDN upload fails

## File Structure

Videos will be stored in the following structure:
```
/videos/
  ├── timestamp_randomstring.mp4
  ├── timestamp_randomstring.mov
  └── ...
```

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure
- Consider implementing file type and size validation
- Set up proper CORS policies if needed

