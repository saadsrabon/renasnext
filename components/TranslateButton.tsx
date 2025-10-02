'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Languages, Loader2 } from 'lucide-react';

interface TranslateButtonProps {
  text: string;
  onTranslate: (translatedText: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TranslateButton({
  text,
  onTranslate,
  className = '',
  size = 'md',
}: TranslateButtonProps) {
  const locale = useLocale();
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!text.trim()) return;

    setIsTranslating(true);
    setError(null);

    try {
      const targetLanguage = locale === 'en' ? 'ar' : 'en';

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'translate',
          text,
          targetLanguage,
          sourceLanguage: locale,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onTranslate(data.result.translatedText);
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

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const iconSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className="relative">
      <button
        onClick={handleTranslate}
        disabled={isTranslating || !text.trim()}
        className={`
          ${sizeClasses[size]}
          flex items-center justify-center
          rounded-full
          bg-blue-500 hover:bg-blue-600
          disabled:bg-gray-400 disabled:cursor-not-allowed
          text-white
          transition-colors
          ${className}
        `}
        title={`Translate to ${locale === 'en' ? 'Arabic' : 'English'}`}
      >
        {isTranslating ? (
          <Loader2 className={`${iconSizeClasses[size]} animate-spin`} />
        ) : (
          <Languages className={iconSizeClasses[size]} />
        )}
      </button>

      {error && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </div>
  );
}

