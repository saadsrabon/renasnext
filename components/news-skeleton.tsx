"use client"

import { Card, CardContent } from "@/components/ui/card"

interface NewsSkeletonProps {
  variant?: "main" | "featured" | "card" | "grid" | "list"
  className?: string
}

export function NewsSkeleton({ variant = "card", className = "" }: NewsSkeletonProps) {
  const baseSkeleton = "animate-pulse bg-gray-200 dark:bg-gray-700 rounded"
  
  if (variant === "main") {
    return (
      <div className={`relative ${className}`}>
        <div className="relative overflow-hidden rounded-2xl">
          {/* Main image skeleton */}
          <div className={`w-full ${baseSkeleton} h-96 lg:h-[500px]`} />
          
          {/* Gradient overlay skeleton */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Category tag skeleton */}
          <div className="absolute top-4 left-4">
            <div className={`${baseSkeleton} w-20 h-6 rounded-full`} />
          </div>
          
          {/* Content skeleton */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="max-w-2xl">
              {/* Author and date skeleton */}
              <div className="flex items-center gap-4 mb-2">
                <div className={`${baseSkeleton} w-24 h-4`} />
                <div className={`${baseSkeleton} w-20 h-4`} />
              </div>
              
              {/* Title skeleton */}
              <div className="space-y-2 mb-4">
                <div className={`${baseSkeleton} w-full h-8`} />
                <div className={`${baseSkeleton} w-3/4 h-8`} />
              </div>
              
              {/* Description skeleton */}
              <div className="space-y-2 mb-4">
                <div className={`${baseSkeleton} w-full h-4`} />
                <div className={`${baseSkeleton} w-5/6 h-4`} />
                <div className={`${baseSkeleton} w-4/6 h-4`} />
              </div>
              
              {/* Button skeleton */}
              <div className={`${baseSkeleton} w-24 h-8 rounded`} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === "featured") {
    return (
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
        {/* Main featured card */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl">
            <div className={`w-full ${baseSkeleton} h-48`} />
          </div>
          <Card className="mt-4 border-renas-brown-200 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 mb-2">
                <div className={`${baseSkeleton} w-20 h-3`} />
                <div className={`${baseSkeleton} w-16 h-3`} />
              </div>
              <div className="space-y-2 mb-2">
                <div className={`${baseSkeleton} w-full h-4`} />
                <div className={`${baseSkeleton} w-3/4 h-4`} />
              </div>
              <div className="space-y-1 mb-3">
                <div className={`${baseSkeleton} w-full h-3`} />
                <div className={`${baseSkeleton} w-2/3 h-3`} />
              </div>
              <div className={`${baseSkeleton} w-16 h-4`} />
            </CardContent>
          </Card>
        </div>
        
        {/* Dots skeleton */}
        <div className="flex items-center justify-center">
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i === 0 
                    ? "bg-renas-gold-500 dark:bg-renas-gold-400" 
                    : "border border-renas-gold-500 dark:border-renas-gold-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === "grid") {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <div className={`w-full ${baseSkeleton} h-48`} />
            </div>
            <Card className="mt-4 border-renas-brown-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`${baseSkeleton} w-20 h-3`} />
                  <div className={`${baseSkeleton} w-16 h-3`} />
                </div>
                <div className="space-y-2 mb-2">
                  <div className={`${baseSkeleton} w-full h-4`} />
                  <div className={`${baseSkeleton} w-3/4 h-4`} />
                </div>
                <div className="space-y-1 mb-3">
                  <div className={`${baseSkeleton} w-full h-3`} />
                  <div className={`${baseSkeleton} w-2/3 h-3`} />
                </div>
                <div className={`${baseSkeleton} w-16 h-4`} />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  if (variant === "list") {
    return (
      <div className={`space-y-6 ${className}`}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="relative">
            <div className="relative overflow-hidden rounded-2xl">
              <div className={`w-full ${baseSkeleton} h-48`} />
            </div>
            <Card className="mt-4 border-renas-brown-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`${baseSkeleton} w-20 h-3`} />
                  <div className={`${baseSkeleton} w-16 h-3`} />
                </div>
                <div className="space-y-2 mb-2">
                  <div className={`${baseSkeleton} w-full h-4`} />
                  <div className={`${baseSkeleton} w-3/4 h-4`} />
                </div>
                <div className="space-y-1 mb-3">
                  <div className={`${baseSkeleton} w-full h-3`} />
                  <div className={`${baseSkeleton} w-2/3 h-3`} />
                </div>
                <div className={`${baseSkeleton} w-16 h-4`} />
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  // Default card variant
  return (
    <div className={`relative ${className}`}>
      <div className="relative overflow-hidden rounded-2xl">
        <div className={`w-full ${baseSkeleton} h-48`} />
      </div>
      <Card className="mt-4 border-renas-brown-200 dark:border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-4 mb-2">
            <div className={`${baseSkeleton} w-20 h-3`} />
            <div className={`${baseSkeleton} w-16 h-3`} />
          </div>
          <div className="space-y-2 mb-2">
            <div className={`${baseSkeleton} w-full h-4`} />
            <div className={`${baseSkeleton} w-3/4 h-4`} />
          </div>
          <div className="space-y-1 mb-3">
            <div className={`${baseSkeleton} w-full h-3`} />
            <div className={`${baseSkeleton} w-2/3 h-3`} />
          </div>
          <div className={`${baseSkeleton} w-16 h-4`} />
        </CardContent>
      </Card>
    </div>
  )
}

// Specialized skeleton for weekly news section
export function WeeklyNewsSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`${className}`}>
      {/* Category tabs skeleton */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded w-20 h-8"
          />
        ))}
      </div>
      
      {/* Weekly news grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main post skeleton */}
        <div className="lg:col-span-2">
          <NewsSkeleton variant="main" />
        </div>
        
        {/* Side posts skeleton */}
        <div className="lg:col-span-2 grid grid-cols-1 gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <NewsSkeleton key={i} variant="card" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Specialized skeleton for live news section
export function LiveNewsSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${className}`}>
      {Array.from({ length: 2 }, (_, i) => (
        <div key={i} className="relative">
          <div className="relative overflow-hidden rounded-2xl">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 w-full h-48" />
            
            {/* Live badge skeleton */}
            <div className="absolute top-4 right-4">
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-12 h-6 rounded-full" />
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Content skeleton */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-20 h-5 rounded-full mb-2 inline-block" />
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-32 h-3 mb-2" />
              <div className="space-y-1">
                <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-full h-4" />
                <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-3/4 h-4" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

