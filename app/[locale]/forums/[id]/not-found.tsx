import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MessageCircle, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
      <div className="renas-container py-8">
        <div className="text-center">
          <MessageCircle className="h-12 w-12 text-renas-brown-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-renas-brown-800 dark:text-white mb-2">
            Topic Not Found
          </h2>
          <p className="text-renas-brown-600 dark:text-gray-400 mb-4">
            The topic you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/forums">
            <Button variant="renas" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Forums
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

