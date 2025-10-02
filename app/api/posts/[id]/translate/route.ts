import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Post from '@/lib/models/Post';
import { translatePostContent } from '@/lib/translation';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { targetLanguage } = await request.json();

    if (!targetLanguage || !['en', 'ar'].includes(targetLanguage)) {
      return NextResponse.json(
        { error: 'Valid target language (en or ar) is required' },
        { status: 400 }
      );
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if translation already exists
    if (post.translations && post.translations.get(targetLanguage)) {
      const existingTranslation = post.translations.get(targetLanguage);
      return NextResponse.json({
        success: true,
        message: 'Translation already exists',
        translation: {
          title: existingTranslation.title,
          content: existingTranslation.content,
          excerpt: existingTranslation.excerpt,
          translatedAt: existingTranslation.translatedAt,
        },
      });
    }

    // Translate the content
    const translatedContent = await translatePostContent(
      {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
      },
      targetLanguage
    );

    // Save translation to the post
    if (!post.translations) {
      post.translations = new Map();
    }

    post.translations.set(targetLanguage, {
      title: translatedContent.title,
      content: translatedContent.content,
      excerpt: translatedContent.excerpt,
      translatedAt: new Date(),
    });

    await post.save();

    return NextResponse.json({
      success: true,
      message: 'Post translated successfully',
      translation: {
        title: translatedContent.title,
        content: translatedContent.content,
        excerpt: translatedContent.excerpt,
        translatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Post translation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed',
      },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const targetLanguage = searchParams.get('language');

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    if (targetLanguage && post.translations) {
      const translation = post.translations.get(targetLanguage);
      if (translation) {
        return NextResponse.json({
          success: true,
          translation: {
            title: translation.title,
            content: translation.content,
            excerpt: translation.excerpt,
            translatedAt: translation.translatedAt,
          },
        });
      }
    }

    // Return all available translations
    const translations = post.translations ? Object.fromEntries(post.translations) : {};
    
    return NextResponse.json({
      success: true,
      originalLanguage: post.originalLanguage,
      translations,
    });
  } catch (error) {
    console.error('Get post translations error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get translations',
      },
      { status: 500 }
    );
  }
}

