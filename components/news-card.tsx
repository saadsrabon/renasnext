"use client"

import { useLocale, useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import TranslatableText from "./TranslatableText"
import { LikeSaveButtons } from "./like-save-buttons"

interface NewsCardProps {
  title: string
  content: string
  date: string
  image: string
  tag?: string
  isMain?: boolean
  className?: string
  slug?: string
  id?: string
  video?: string
  media?: Array<{
    type: 'image' | 'video'
    url: string
  }>
}

export function NewsCard({ 
  title, 
  content, 
  date, 
  image, 
  tag, 
  isMain = false,
  className = "",
  slug,
  id,
  video,
  media
}: NewsCardProps) {
  const t = useTranslations("news")
  const locale = useLocale()

  // Determine if we should show video or image
  const hasVideo = video || (media && media.some(m => m.type === 'video'))
  const videoUrl = video || (media && media.find(m => m.type === 'video')?.url)
  const displayImage = image || (media && media.find(m => m.type === 'image')?.url)

  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-2xl">
        {hasVideo ? (
          <video
            className={`w-full object-cover ${
              isMain ? "h-96 lg:h-[500px]" : "h-48"
            }`}
            controls
            preload="metadata"
           
            // poster={displayImage}
          >
            <source src={`https://${videoUrl}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
       
        ) : (
          <img
            src={`https://${displayImage}`}
            alt={title}
            className={`w-full object-cover ${
              isMain ? "h-96 lg:h-[500px]" : "h-48"
            }`}
          />
        )}
        
        {isMain && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        )}
        
        {tag && (
          <div className="absolute top-4 left-4">
            <span className="bg-renas-gold-500 dark:bg-renas-gold-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              {tag}
            </span>
          </div>
        )}
        
        {isMain && (
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-2xl">
              <p className="text-sm text-gray-200 mb-2">
                {t("editorOfPress")} - {date}
              </p>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4 leading-tight">
                <TranslatableText text={title} />
              </h2>
              <p className="text-gray-200 text-sm lg:text-base leading-relaxed mb-4">
                <TranslatableText text={content} />
              </p>
              {(slug || id) && (
                <div className="space-y-2">
                  <Link href={`/${locale}${slug ? `/news/${slug}` : `/posts/${id}`}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      Read More
                    </Button>
                  </Link>
                  {id && (
                    <div className="flex justify-start">
                      <LikeSaveButtons postId={id} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {!isMain && (
        <Card className="mt-4 border-renas-brown-200 dark:border-gray-700">
          <CardContent className="p-4">
            <p className="text-xs text-renas-brown-500 dark:text-gray-400 mb-2">
              {t("editorOfPress")} - {date}
            </p>
            <h3 className="font-semibold text-renas-brown-800 dark:text-white text-sm lg:text-base line-clamp-2 mb-3">
              <TranslatableText text={title} />
            </h3>
            <p className="text-sm text-renas-brown-600 dark:text-gray-300 line-clamp-2 mb-3">
              <TranslatableText text={content} />
            </p>
            {(slug || id) && (
              <div className="space-y-2">
                <Link href={`/${locale}${slug ? `/news/${slug}` : `/posts/${id}`}`}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                  >
                    Read More
                  </Button>
                </Link>
                {id && <LikeSaveButtons postId={id} />}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface NewsSectionProps {
  title: string
  children: React.ReactNode
  showNavigation?: boolean
  backgroundText?: string
  className?: string
}

export function NewsSection({ 
  title, 
  children, 
  showNavigation = true,
  backgroundText,
  className = ""
}: NewsSectionProps) {
  return (
    <section className={`py-8 ${className}`}>
      <div className="renas-container">
        <div className="relative">
          {backgroundText && (
            <div className="absolute -top-4 -right-4 text-8xl lg:text-9xl font-bold text-renas-beige-200 dark:text-gray-800 opacity-30 select-none pointer-events-none">
              {backgroundText}
            </div>
          )}
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl lg:text-3xl font-bold text-renas-brown-800 dark:text-white">
              {title}
            </h2>
            
            {showNavigation && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {children}
        </div>
      </div>
    </section>
  )
}

interface CategoryTabsProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryTabs({ 
  categories, 
  activeCategory, 
  onCategoryChange 
}: CategoryTabsProps) {
  const t = useTranslations("news.categories")
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "renas" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="text-xs"
        >
          {t(category)}
        </Button>
      ))}
    </div>
  )
}
