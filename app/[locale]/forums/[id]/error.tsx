"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error('Forum topic error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
      <div className="renas-container py-8">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-renas-brown-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-renas-brown-800 dark:text-white mb-2">
            Something went wrong!
          </h2>
          <p className="text-renas-brown-600 dark:text-gray-400 mb-4">
            There was an error loading the topic. Please try again.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={reset}>
              Try again
            </Button>
            <Button 
              variant="renas" 
              onClick={() => router.push('/forums')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Forums
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

