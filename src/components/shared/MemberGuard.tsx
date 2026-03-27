import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useMemberAuth } from '../../lib/auth'

export default function MemberGuard({ children }: { children: ReactNode }) {
  const { profile, loading } = useMemberAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm font-body">Loading your portal...</p>
      </div>
    </div>
  )

  if (!profile) return <Navigate to="/login" replace />
  return <>{children}</>
}
