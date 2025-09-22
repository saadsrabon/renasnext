export default function Loading() {
  return (
    <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
      <div className="renas-container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-renas-gold-600 mx-auto"></div>
          <p className="mt-2 text-renas-brown-600 dark:text-gray-400">Loading topic...</p>
        </div>
      </div>
    </div>
  )
}

