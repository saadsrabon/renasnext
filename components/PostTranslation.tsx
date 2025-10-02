'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Languages, Loader2, Check, X } from 'lucide-react';

interface PostTranslationProps {
  postId: string;
  originalTitle: string;
  originalContent: string;
  originalExcerpt?: string;
  onTranslationComplete?: (translation: {
    title: string;
    content: string;
    excerpt?: string;
  }) => void;
}

export default function PostTranslation({
  postId,
  originalTitle,
  originalContent,
  originalExcerpt,
  onTranslationComplete,
}: PostTranslationProps) {
  const locale = useLocale();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState<{
    title: string;
    content: string;
    excerpt?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);

  const targetLanguage = locale === 'en' ? 'ar' : 'en';
  const targetLanguageName = targetLanguage === 'ar' ? 'العربية' : 'English';

  const handleTranslate = async () => {
    setIsTranslating(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${postId}/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetLanguage,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTranslation(data.translation);
        setShowTranslation(true);
        onTranslationComplete?.(data.translation);
      } else {
        setError(data.error || 'Translation failed');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleShowOriginal = () => {
    setShowTranslation(false);
  };

  const handleShowTranslation = () => {
    setShowTranslation(true);
  };

  return (
    <div className="space-y-4">
      {/* Translation Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-3">
          <Languages className="w-5 h-5 text-blue-500" />
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              Translate to {targetLanguageName}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get this content translated automatically
            </p>
          </div>
        </div>
        
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg transition-colors"
        >
          {isTranslating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Translating...</span>
            </>
          ) : (
            <>
              <Languages className="w-4 h-4" />
              <span>Translate</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <X className="w-5 h-5 text-red-500" />
            <p className="text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      )}

      {/* Translation Toggle */}
      {translation && (
        <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-green-700 dark:text-green-400 font-medium">
              Translation available in {targetLanguageName}
            </span>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleShowOriginal}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                !showTranslation
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Original
            </button>
            <button
              onClick={handleShowTranslation}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                showTranslation
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {targetLanguageName}
            </button>
          </div>
        </div>
      )}

      {/* Content Display */}
      <div className="prose dark:prose-invert max-w-none">
        {showTranslation && translation ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">{translation.title}</h1>
            {translation.excerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 italic">
                {translation.excerpt}
              </p>
            )}
            <div 
              className="text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4">{originalTitle}</h1>
            {originalExcerpt && (
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 italic">
                {originalExcerpt}
              </p>
            )}
            <div 
              className="text-gray-800 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: originalContent }}
            />
          </div>
        )}
      </div>
    </div>
  );
}









