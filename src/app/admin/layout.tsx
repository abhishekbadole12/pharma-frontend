import React from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import '@/app/globals.css'

export const metadata = {
  title: 'Admin - Dhan Laxmi Pharma'
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-3 py-4 sm:px-4 sm:py-6 flex flex-col lg:flex-row gap-4 lg:gap-6">
        <aside className="w-full lg:w-72 lg:shrink-0">
          <AdminSidebar />
        </aside>
        <section className="flex-1">{children}</section>
      </div>
    </div>
  )
}
