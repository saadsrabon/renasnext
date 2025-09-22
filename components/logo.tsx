"use client"

import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  locale: string
  className?: string
}

export function Logo({ locale, className = "" }: LogoProps) {
  return (
    <Link href={`/${locale}`} className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        {/* Main logo circle */}
        <div className="w-12 h-12 bg-gradient-to-br from-renas-gold-400 to-renas-gold-600 rounded-full flex items-center justify-center shadow-lg border-2 border-renas-gold-300">
          {/* Newspaper icon representation */}
          <div className="w-7 h-7 bg-white rounded-sm flex flex-col items-center justify-center shadow-inner">
            <div className="w-5 h-0.5 bg-renas-gold-600 mb-1"></div>
            <div className="w-4 h-0.5 bg-renas-gold-600 mb-1"></div>
            <div className="w-5 h-0.5 bg-renas-gold-600"></div>
          </div>
        </div>
        {/* Accent dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-renas-gold-300 rounded-full shadow-md border border-renas-gold-400"></div>
        {/* Small accent line */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-renas-gold-400 rounded-full"></div>
      </div>
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-tiro-bangla text-renas-brown-800 dark:text-white font-bold leading-tight">
          Renas
        </h1>
        <p className="text-xs font-bold text-renas-brown-600 dark:text-renas-gold-400 tracking-wider">
          PRESS
        </p>
      </div>
    </Link>
  )
}

// Alternative logo with image support
interface LogoWithImageProps {
  locale: string
  logoSrc?: string
  className?: string
}

export function LogoWithImage({ locale, logoSrc, className = "" }: LogoWithImageProps) {
  return (
    <Link href={`/${locale}`} className={`flex items-center gap-3 ${className}`}>
      {logoSrc ? (
        <div className="relative">
          <Image
            src={logoSrc}
            alt="Renas Press Logo"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
            priority
          />
        </div>
      ) : (
        <div className="relative">
          <div className="w-12 h-12 bg-renas-gold-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-renas-gold-600 font-bold text-lg">R</span>
            </div>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-renas-gold-300 rounded-full shadow-md"></div>
        </div>
      )}
      
      {/* Logo Text */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-tiro-bangla text-renas-brown-800 dark:text-white font-bold leading-tight">
          Renas
        </h1>
        <p className="text-xs font-bold text-renas-brown-600 dark:text-renas-gold-400 tracking-wider">
          PRESS
        </p>
      </div>
    </Link>
  )
}
