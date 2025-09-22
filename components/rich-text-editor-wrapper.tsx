"use client"

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('./rich-text-editor').then(mod => ({ default: mod.RichTextEditor })), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg">
      <div className="min-h-[300px] bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
      </div>
    </div>
  )
})

interface RichTextEditorWrapperProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditorWrapper(props: RichTextEditorWrapperProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={`border border-gray-300 dark:border-gray-600 rounded-lg ${props.className || ''}`}>
        <div className="min-h-[300px] bg-white dark:bg-gray-900 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
        </div>
      </div>
    )
  }

  return <RichTextEditor {...props} />
}
