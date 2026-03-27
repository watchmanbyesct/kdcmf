import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../lib/auth'

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { profile, loading } = useAdminAuth()

  if (loading) return (
    <div className="min-h-screen bg-crimson-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gold-400 font-body text-sm">Loading...</p>
      </div>
    </div>
  )

  if (!profile) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
