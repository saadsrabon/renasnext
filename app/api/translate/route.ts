import { NextRequest, NextResponse } from 'next/server';
import { translateText, translateBatch, detectLanguage } from '@/lib/translation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, targetLanguage, sourceLanguage, action } = body;

    if (!targetLanguage) {
      return NextResponse.json(
        { error: 'Target language is required' },
        { status: 400 }
      );
    }

    switch (action) {
      case 'translate':
        if (!text) {
          return NextResponse.json(
            { error: 'Text is required for translation' },
            { status: 400 }
          );
        }

        const result = await translateText(text, {
          targetLanguage,
          sourceLanguage,
          format: 'html',
        });

        return NextResponse.json({
          success: true,
          result,
        });

      case 'translateBatch':
        if (!texts || !Array.isArray(texts)) {
          return NextResponse.json(
            { error: 'Texts array is required for batch translation' },
            { status: 400 }
          );
        }

        const batchResults = await translateBatch(texts, {
          targetLanguage,
          sourceLanguage,
          format: 'html',
        });

        return NextResponse.json({
          success: true,
          results: batchResults,
        });

      case 'detect':
        if (!text) {
          return NextResponse.json(
            { error: 'Text is required for language detection' },
            { status: 400 }
          );
        }

        const detectedLanguage = await detectLanguage(text);

        return NextResponse.json({
          success: true,
          language: detectedLanguage,
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use: translate, translateBatch, or detect' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Translation API',
    usage: {
      translate: 'POST with { action: "translate", text: "text", targetLanguage: "ar" }',
      translateBatch: 'POST with { action: "translateBatch", texts: ["text1", "text2"], targetLanguage: "ar" }',
      detect: 'POST with { action: "detect", text: "text" }',
    },
  });
}

