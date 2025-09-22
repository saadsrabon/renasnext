"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useAuth } from "@/lib/auth-context"
import { Logo } from "@/components/logo"
import { Menu, Search, X, User, LogOut } from "lucide-react"
import logo from "../app/assets/renaspresslogo.webp"
interface HeaderProps {
  locale: string
}

export function Header({ locale }: HeaderProps) {
  const t = useTranslations("common")
  const tNav = useTranslations("navigation")
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const navigationItems = [
    { key: "mainNews", href: "/" },
    { key: "economicNews", href: "/economic" },
    { key: "woman", href: "/woman" },
    { key: "sports", href: "/sports" },
    { key: "charity", href: "/charity" },
    { key: "dailyNews", href: "/daily-news" },
    { key: "politicalNews", href: "/political-news" },
    { key: "expatriates", href: "/expatriates" },
    { key: "forums", href: "/forums" },
    { key: "saved", href: "/saved" },
  ]

  return (
    <header className="bg-renas-beige-50 dark:bg-gray-900 border-b border-renas-brown-200 dark:border-gray-800">
      {/* Top Header */}
      <div className="renas-container">
        <div className="flex items-center justify-between py-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-renas-brown-400 dark:text-gray-400" />
              <Input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 bg-white dark:bg-gray-800 border-renas-brown-300 dark:border-gray-600 text-renas-brown-800 dark:text-white placeholder:text-renas-brown-400 dark:placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="flex items-center">
            <img src={logo.src} alt="Nass Logo" className="w-full" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle currentLocale={locale} />
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={`/${locale}/dashboard`}>
                  <Button variant="ghost" size="sm" className="text-renas-brown-600 dark:text-gray-300 hover:text-renas-gold-600">
                    <User className="h-4 w-4 mr-1" />
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  onClick={logout} 
                  variant="ghost" 
                  size="sm"
                  className="text-renas-brown-600 dark:text-gray-300 hover:text-renas-gold-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link href={`/${locale}/login`}>
                  <Button variant="renasOutline" size="sm">
                    {t("login")}
                  </Button>
                </Link>
                <Link href={`/${locale}/signup`}>
                  <Button variant="renas" size="sm">
                    {t("signup")}
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-renas-brown-200 dark:border-gray-800">
        <div className="renas-container">
          <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="flex flex-wrap items-center justify-center lg:justify-start py-4 gap-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}${item.href}`}
                  className={`text-sm font-medium transition-colors hover:text-renas-gold-600 dark:hover:text-renas-gold-400 ${
                    item.key === "mainNews"
                      ? "text-renas-brown-800 dark:text-renas-gold-400 border-b-2 border-renas-gold-500 dark:border-renas-gold-400 pb-1"
                      : "text-renas-brown-600 dark:text-gray-300"
                  }`}
                >
                  {tNav(item.key)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
