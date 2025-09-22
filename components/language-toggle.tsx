"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"

interface LanguageToggleProps {
  currentLocale: string
}

export function LanguageToggle({ currentLocale }: LanguageToggleProps) {
  const router = useRouter()
  const pathname = usePathname()

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'ar' ? 'en' : 'ar'
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-9 w-9 px-0"
    >
      <Languages className="h-4 w-4" />
      <span className="sr-only">Toggle language</span>
    </Button>
  )
}
