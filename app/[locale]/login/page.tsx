"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useAuth } from "@/lib/auth-context"
import { Loader2 } from "lucide-react"

export default function LoginPage({ params }: { params: { locale: string } }) {
  const t = useTranslations("common")
  const router = useRouter()
  const { login, user, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      router.push(`/${params.locale}`)
    }
  }, [user, router, params.locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const result = await login(email, password)
    
    if (result.success) {
      router.push(`/${params.locale}`)
    } else {
      setError(result.error || "Login failed")
    }
    
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-renas-beige-100 dark:bg-gray-900 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-renas-gold-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-renas-beige-100 dark:bg-gray-900 flex items-center justify-center p-4">
      {/* Theme and Language Toggles */}
      <div className="absolute top-4 right-4 flex gap-2">
        <ThemeToggle />
        <LanguageToggle currentLocale="ar" />
      </div>

      <Card className="w-full max-w-md bg-renas-beige-50 dark:bg-gray-800 border-renas-brown-600 dark:border-gray-700">
        <CardHeader className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-renas-brown-800 dark:text-white">
              {t("login")}
            </h1>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg">
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-renas-brown-800 dark:text-renas-gold-400 font-semibold text-base"
              >
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("yourEmail")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="renas-input bg-renas-beige-200 dark:bg-gray-700 border-renas-brown-600 dark:border-renas-gold-400 text-renas-brown-800 dark:text-white placeholder:text-renas-brown-600 dark:placeholder:text-renas-gold-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-renas-brown-800 dark:text-renas-gold-400 font-semibold text-base"
              >
                {t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={t("enterPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="renas-input bg-renas-beige-200 dark:bg-gray-700 border-renas-brown-600 dark:border-renas-gold-400 text-renas-brown-800 dark:text-white placeholder:text-renas-brown-600 dark:placeholder:text-renas-gold-300"
                required
              />
              <div className="text-right">
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-renas-brown-600 dark:text-renas-gold-400 hover:underline"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-renas-brown-700 dark:bg-renas-gold-600 hover:bg-renas-brown-800 dark:hover:bg-renas-gold-700 text-white font-semibold py-3 rounded-full disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("loggingIn")}
                </>
              ) : (
                t("login")
              )}
            </Button>

            <div className="text-center">
              <span className="text-renas-brown-600 dark:text-renas-gold-300">
                {t("dontHaveAccount")}{" "}
              </span>
              <Link 
                href="/signup" 
                className="text-renas-gold-600 dark:text-renas-gold-400 hover:underline font-medium"
              >
                {t("signup")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
