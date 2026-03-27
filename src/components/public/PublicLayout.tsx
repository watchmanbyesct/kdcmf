import { type ReactNode } from 'react'
import PublicHeader from './Header'
import PublicFooter from './Footer'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}
