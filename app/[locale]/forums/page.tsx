"use client"

import { Header } from "@/components/header"
import { ForumSection } from "@/components/forum-section"

export default function ForumsPage({ params }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen bg-renas-beige-50 dark:bg-gray-900">
      <Header locale={params.locale} />
      <ForumSection locale={params.locale} />
    </div>
  )
}
