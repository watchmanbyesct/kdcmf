import { type ReactNode } from 'react'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children, title, subtitle }: {
  children: ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 lg:pt-4 pt-16">
          <div className="crimson-bar rounded mb-3 w-12" style={{ height: '3px' }} />
          <h1 className="font-display text-2xl font-bold text-crimson-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 font-body mt-0.5">{subtitle}</p>}
        </div>
        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
