import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMemberAuth } from '../../lib/auth'
import { KDCMF_SEAL } from '../../lib/logos'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import PublicLayout from '../../components/public/PublicLayout'

export default function LoginPage() {
  const { login } = useMemberAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(email, password)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    navigate('/portal')
  }

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={KDCMF_SEAL} alt="KDCMF" className="w-16 h-16 rounded-full object-cover mx-auto mb-4 shadow border-2 border-gold-400" />
            <h1 className="font-display text-2xl font-bold text-crimson-900 mb-1">Member Sign In</h1>
            <p className="text-gray-500 font-body text-sm">Access your KDCMF member portal</p>
          </div>

          <div className="card overflow-hidden">
            <div className="crimson-bar" />
            <form onSubmit={handleLogin} className="p-8 space-y-4">
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" value={email}
                  onChange={e => setEmail(e.target.value)} required autoFocus
                  placeholder="your@email.com" />
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="input pr-10"
                    value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Enter your password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-3" disabled={loading}>
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <>Sign In <ArrowRight size={16} /></>
                }
              </button>
            </form>
            <div className="px-8 pb-6 space-y-3">
              <div className="border-t border-gray-100 pt-4 text-center">
                <p className="text-xs text-gray-400 font-body uppercase tracking-wider mb-3">Don't have an account?</p>
                <div className="space-y-2">
                  <Link to="/stay-connected"
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-gray-200 hover:border-crimson-300 hover:bg-crimson-50 transition-all group">
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-crimson-700 font-body">Stay Connected</div>
                      <div className="text-xs text-gray-400 font-body">Get updates, news, and event announcements</div>
                    </div>
                    <span className="text-crimson-600 text-lg">→</span>
                  </Link>
                  <Link to="/join"
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-gray-200 hover:border-crimson-300 hover:bg-crimson-50 transition-all group">
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-crimson-700 font-body">Apply for Membership</div>
                      <div className="text-xs text-gray-400 font-body">Join the fellowship as a pastor, church, or ministry</div>
                    </div>
                    <span className="text-crimson-600 text-lg">→</span>
                  </Link>
                  <Link to="/events"
                    className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg border border-gray-200 hover:border-crimson-300 hover:bg-crimson-50 transition-all group">
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-800 group-hover:text-crimson-700 font-body">Register for an Event</div>
                      <div className="text-xs text-gray-400 font-body">Attend without creating an account</div>
                    </div>
                    <span className="text-crimson-600 text-lg">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
