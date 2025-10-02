import { Translate } from '@google-cloud/translate/build/src/v2';

// Lazy initialization of Google Translate client
let translate: Translate | null = null;

// Initialize Google Translate client
const getTranslateClient = (): Translate | null => {
  if (translate) {
    return translate;
  }

  try {
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;

    if (!apiKey || apiKey === 'your-google-translate-api-key-here') {
      console.warn('Google Translate API key not configured');
      return null;
    }

    translate = new Translate({
      projectId,
      key: apiKey,
    });

    return translate;
  } catch (error) {
    console.error('Failed to initialize Google Translate client:', error);
    return null;
  }
};

// Check if API key is available
const isApiKeyAvailable = () => {
  return !!(process.env.GOOGLE_TRANSLATE_API_KEY && process.env.GOOGLE_TRANSLATE_API_KEY !== 'your-google-translate-api-key-here');
};

export interface TranslationOptions {
  sourceLanguage?: string;
  targetLanguage: string;
  format?: 'text' | 'html';
}

export interface TranslationResult {
  translatedText: string;
  detectedSourceLanguage?: string;
}

/**
 * Translate text using Google Translate API
 */
export async function translateText(
  text: string,
  options: TranslationOptions
): Promise<TranslationResult> {
  try {
    if (!text || text.trim().length === 0) {
      return { translatedText: text };
    }

    // Check if API key is available
    if (!isApiKeyAvailable()) {
      console.warn('Google Translate API key not configured. Returning original text.');
      return { translatedText: text };
    }

    const client = getTranslateClient();
    if (!client) {
      console.warn('Google Translate client not available. Returning original text.');
      return { translatedText: text };
    }

    const [translation] = await client.translate(text, {
      from: options.sourceLanguage,
      to: options.targetLanguage,
      format: options.format || 'text',
    });

    return {
      translatedText: translation,
      detectedSourceLanguage: options.sourceLanguage,
    };
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to original text if translation fails
    return { translatedText: text };
  }
}

/**
 * Translate multiple texts in batch
 */
export async function translateBatch(
  texts: string[],
  options: TranslationOptions
): Promise<TranslationResult[]> {
  try {
    if (!texts || texts.length === 0) {
      return [];
    }

    // Check if API key is available
    if (!isApiKeyAvailable()) {
      console.warn('Google Translate API key not configured. Returning original texts.');
      return texts.map(text => ({ translatedText: text }));
    }

    const client = getTranslateClient();
    if (!client) {
      console.warn('Google Translate client not available. Returning original texts.');
      return texts.map(text => ({ translatedText: text }));
    }

    const [translations] = await client.translate(texts, {
      from: options.sourceLanguage,
      to: options.targetLanguage,
      format: options.format || 'text',
    });

    return translations.map((translation, index) => ({
      translatedText: translation,
      detectedSourceLanguage: options.sourceLanguage,
    }));
  } catch (error) {
    console.error('Batch translation error:', error);
    // Fallback to original texts if translation fails
    return texts.map(text => ({ translatedText: text }));
  }
}

/**
 * Detect language of text
 */
export async function detectLanguage(text: string): Promise<string> {
  try {
    if (!text || text.trim().length === 0) {
      return 'en';
    }

    const client = getTranslateClient();
    if (!client) {
      console.warn('Google Translate client not available. Defaulting to English.');
      return 'en';
    }

    const [detection] = await client.detect(text);
    return detection.language;
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English
  }
}

/**
 * Get supported languages
 */
export async function getSupportedLanguages(): Promise<Array<{ code: string; name: string }>> {
  try {
    const client = getTranslateClient();
    if (!client) {
      console.warn('Google Translate client not available. Returning default languages.');
      return [
        { code: 'en', name: 'English' },
        { code: 'ar', name: 'Arabic' },
      ];
    }

    const [languages] = await client.getLanguages();
    return languages.map(lang => ({
      code: lang.code,
      name: lang.name,
    }));
  } catch (error) {
    console.error('Get supported languages error:', error);
    return [
      { code: 'en', name: 'English' },
      { code: 'ar', name: 'Arabic' },
    ];
  }
}

/**
 * Translate content for news posts
 */
export async function translatePostContent(
  content: {
    title: string;
    excerpt?: string;
    content: string;
  },
  targetLanguage: string
): Promise<{
  title: string;
  excerpt?: string;
  content: string;
}> {
  try {
    const [titleResult, excerptResult, contentResult] = await translateBatch(
      [content.title, content.excerpt || '', content.content],
      {
        targetLanguage,
        format: 'html',
      }
    );

    return {
      title: titleResult.translatedText,
      excerpt: content.excerpt ? excerptResult.translatedText : undefined,
      content: contentResult.translatedText,
    };
  } catch (error) {
    console.error('Post content translation error:', error);
    return content; // Return original content if translation fails
  }
}

/**
 * Language code mapping for better compatibility
 */
export const LANGUAGE_CODES = {
  english: 'en',
  arabic: 'ar',
  en: 'en',
  ar: 'ar',
} as const;

export type SupportedLanguage = keyof typeof LANGUAGE_CODES;

