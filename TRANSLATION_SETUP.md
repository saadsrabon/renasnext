# Translation Setup Guide

This guide explains how to set up Google Translate integration for your RenasPress website.

## Prerequisites

1. **Google Cloud Account**: You need a Google Cloud account with billing enabled
2. **Google Translate API**: Enable the Google Translate API in your Google Cloud Console

## Setup Steps

### 1. Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Translate API:
   - Go to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click "Enable"

### 2. API Key Setup

#### Option A: API Key (Recommended for development)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the API key
4. Add it to your `.env.local` file:
   ```
   GOOGLE_TRANSLATE_API_KEY=your-api-key-here
   ```

#### Option B: Service Account (Recommended for production)
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Give it a name and description
4. Grant it the "Cloud Translation API User" role
5. Create and download the JSON key file
6. Add to your `.env.local` file:
   ```
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
   ```

### 3. Environment Variables

Add these to your `.env.local` file:

```env
# Google Cloud Translation API
GOOGLE_TRANSLATE_API_KEY=your-google-translate-api-key-here
GOOGLE_CLOUD_PROJECT_ID=your-google-cloud-project-id
# Optional: Path to service account key file
GOOGLE_CLOUD_KEY_FILE=path/to/service-account-key.json
```

### 4. Install Dependencies

The Google Cloud Translate package is already installed:
```bash
yarn add @google-cloud/translate
```

## Usage

### 1. Language Switcher

Add the language switcher to your navigation:

```tsx
import LanguageSwitcher from '@/components/LanguageSwitcher';

// In your navigation component
<LanguageSwitcher />
```

### 2. Translate Individual Text

Use the `TranslatableText` component for individual text elements:

```tsx
import TranslatableText from '@/components/TranslatableText';

<TranslatableText 
  text="Hello, world!" 
  showTranslateButton={true}
  translateButtonPosition="hover"
/>
```

### 3. Translate Posts

Use the `PostTranslation` component for full post translation:

```tsx
import PostTranslation from '@/components/PostTranslation';

<PostTranslation
  postId="post-id"
  originalTitle="Post Title"
  originalContent="Post content..."
  originalExcerpt="Post excerpt..."
  onTranslationComplete={(translation) => {
    console.log('Translation completed:', translation);
  }}
/>
```

### 4. API Usage

#### Translate Text
```javascript
const response = await fetch('/api/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'translate',
    text: 'Hello, world!',
    targetLanguage: 'ar'
  })
});
```

#### Translate Post
```javascript
const response = await fetch('/api/posts/post-id/translate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    targetLanguage: 'ar'
  })
});
```

## Features

### 1. Automatic Translation
- Posts can be automatically translated when created
- Translations are cached in the database
- Supports English ↔ Arabic translation

### 2. Language Detection
- Automatically detects the source language
- Falls back to English if detection fails

### 3. Batch Translation
- Translate multiple texts at once
- More efficient for large content

### 4. Error Handling
- Graceful fallback to original text
- User-friendly error messages
- Network error handling

## Cost Considerations

Google Translate API pricing (as of 2024):
- First 500,000 characters per month: Free
- After that: $20 per 1M characters

### Cost Optimization Tips:
1. Cache translations in your database
2. Only translate when requested by users
3. Use batch translation for multiple texts
4. Consider using the free tier for development

## Troubleshooting

### Common Issues:

1. **API Key Not Working**
   - Check if the API key is correct
   - Ensure the Google Translate API is enabled
   - Verify billing is enabled on your Google Cloud account

2. **Translation Not Working**
   - Check the browser console for errors
   - Verify environment variables are set correctly
   - Test the API endpoint directly

3. **Build Errors**
   - Ensure all dependencies are installed
   - Check for TypeScript errors
   - Verify import paths are correct

### Testing the Setup:

1. Test the translation API:
   ```bash
   curl -X POST http://localhost:3000/api/translate \
     -H "Content-Type: application/json" \
     -d '{"action":"translate","text":"Hello","targetLanguage":"ar"}'
   ```

2. Check if the language switcher works
3. Test post translation functionality

## Security Notes

- Never expose your API key in client-side code
- Use environment variables for all sensitive data
- Consider using service accounts for production
- Implement rate limiting for the translation API
- Monitor API usage to avoid unexpected costs

## Support

For issues with the translation system:
1. Check the browser console for errors
2. Verify your Google Cloud setup
3. Test the API endpoints directly
4. Check the server logs for detailed error messages









