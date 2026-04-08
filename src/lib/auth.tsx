import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  membership_status: string
  photo_url?: string
  title?: string
  church_name?: string
}

interface AdminAuthContext {
  profile: Profile | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
  checkEmail: (email: string) => Promise<{ exists: boolean; profile?: Partial<Profile> }>
}

interface MemberAuthContext {
  profile: Profile | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => void
  register: (data: RegisterData) => Promise<{ error?: string }>
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  church_name?: string
}

const AdminAuthCtx = createContext<AdminAuthContext | null>(null)
const MemberAuthCtx = createContext<MemberAuthContext | null>(null)

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

async function callEdgeFunction(fnName: string, body: object) {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`
    },
    body: JSON.stringify(body)
  })
  return res.json()
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('kdcmf_admin_token')
    if (stored) {
      callEdgeFunction('admin-login', { action: 'validate', token: stored }).then(data => {
        if (data.valid) { setProfile(data.profile); setToken(stored) }
        else localStorage.removeItem('kdcmf_admin_token')
        setLoading(false)
      })
    } else setLoading(false)
  }, [])

  const checkEmail = async (email: string) => {
    return callEdgeFunction('admin-login', { action: 'check_email', email })
  }

  const login = async (email: string, password: string) => {
    const data = await callEdgeFunction('admin-login', { action: 'login', email, password })
    if (data.error) return { error: data.error }
    setProfile(data.profile)
    setToken(data.token)
    localStorage.setItem('kdcmf_admin_token', data.token)
    return {}
  }

  const logout = () => {
    if (token) callEdgeFunction('admin-login', { action: 'logout', token })
    setProfile(null)
    setToken(null)
    localStorage.removeItem('kdcmf_admin_token')
  }

  return <AdminAuthCtx.Provider value={{ profile, token, loading, login, logout, checkEmail }}>{children}</AdminAuthCtx.Provider>
}

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('kdcmf_member_token')
    if (stored) {
      callEdgeFunction('member-auth', { action: 'validate', token: stored }).then(data => {
        if (data.valid) { setProfile(data.profile); setToken(stored) }
        else localStorage.removeItem('kdcmf_member_token')
        setLoading(false)
      })
    } else setLoading(false)
  }, [])

  const register = async (data: RegisterData) => {
    const res = await callEdgeFunction('member-auth', { action: 'register', ...data })
    if (res.error) return { error: res.error }
    return {}
  }

  const login = async (email: string, password: string) => {
    const data = await callEdgeFunction('member-auth', { action: 'login', email, password })
    if (data.error) return { error: data.error }
    setProfile(data.profile)
    setToken(data.token)
    localStorage.setItem('kdcmf_member_token', data.token)
    return {}
  }

  const logout = () => {
    if (token) callEdgeFunction('member-auth', { action: 'logout', token })
    setProfile(null)
    setToken(null)
    localStorage.removeItem('kdcmf_member_token')
  }

  return <MemberAuthCtx.Provider value={{ profile, token, loading, login, logout, register }}>{children}</MemberAuthCtx.Provider>
}

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthCtx)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

export const useMemberAuth = () => {
  const ctx = useContext(MemberAuthCtx)
  if (!ctx) throw new Error('useMemberAuth must be used within MemberAuthProvider')
  return ctx
}
