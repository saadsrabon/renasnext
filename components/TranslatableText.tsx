'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import TranslateButton from './TranslateButton';

interface TranslatableTextProps {
  text: string;
  className?: string;
  showTranslateButton?: boolean;
  translateButtonPosition?: 'inline' | 'hover' | 'always';
}

export default function TranslatableText({
  text,
  className = '',
  showTranslateButton = true,
  translateButtonPosition = 'hover',
}: TranslatableTextProps) {
  const locale = useLocale();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const displayText = translatedText || text;
  const isTranslated = translatedText !== null;

  const handleTranslate = (newTranslatedText: string) => {
    setTranslatedText(newTranslatedText);
  };

  const handleReset = () => {
    setTranslatedText(null);
  };

  const shouldShowButton = showTranslateButton && (
    translateButtonPosition === 'always' ||
    (translateButtonPosition === 'hover' && isHovered) ||
    (translateButtonPosition === 'inline' && isTranslated)
  );

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <p className={isTranslated ? 'italic text-gray-600 dark:text-gray-400' : ''}>
            {displayText}
          </p>
          {isTranslated && (
            <button
              onClick={handleReset}
              className="text-xs text-blue-500 hover:text-blue-700 mt-1"
            >
              Show original
            </button>
          )}
        </div>
        
        {shouldShowButton && (
          <div className="flex-shrink-0">
            <TranslateButton
              text={text}
              onTranslate={handleTranslate}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}

