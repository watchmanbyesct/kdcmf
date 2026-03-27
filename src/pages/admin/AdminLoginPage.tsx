import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../lib/auth'
import { Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const { login, checkEmail } = useAdminAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [adminInfo, setAdminInfo] = useState<{ first_name?: string } | null>(null)

  const handleEmailStep = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await checkEmail(email)
    setLoading(false)
    if (!result.exists) {
      setError('No admin account found with that email address.')
      return
    }
    setAdminInfo(result.profile || null)
    setStep('password')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(email, password)
    setLoading(false)
    if (result.error) {
      setError(result.error)
      return
    }
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-crimson-950 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)',
        backgroundSize: '20px 20px'
      }} />

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield size={28} className="text-crimson-900" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">KDCMF Admin</h1>
          <p className="text-gray-400 font-body text-sm">Restricted access. Authorized personnel only.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="crimson-bar" />
          <div className="p-8">
            {step === 'email' ? (
              <>
                <h2 className="font-display text-xl font-semibold text-crimson-900 mb-1">Sign In</h2>
                <p className="text-sm text-gray-500 font-body mb-6">Enter your administrator email to continue.</p>
                <form onSubmit={handleEmailStep} className="space-y-4">
                  <div>
                    <label className="label">Email Address</label>
                    <input
                      type="email"
                      className="input"
                      placeholder="admin@kdcmf.org"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required autoFocus
                    />
                  </div>
                  {error && <p className="text-sm text-red-600 font-body bg-red-50 p-3 rounded">{error}</p>}
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Continue <ArrowRight size={16} /></>}
                  </button>
                </form>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-crimson-100 rounded-full flex items-center justify-center">
                    <span className="text-crimson-800 font-display font-bold text-sm">
                      {adminInfo?.first_name?.[0] || email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 font-body text-sm">
                      {adminInfo?.first_name ? `Welcome back, ${adminInfo.first_name}` : 'Welcome back'}
                    </div>
                    <div className="text-xs text-gray-500 font-body">{email}</div>
                  </div>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="label">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="input pr-10"
                        placeholder="Enter your password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required autoFocus
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  {error && <p className="text-sm text-red-600 font-body bg-red-50 p-3 rounded">{error}</p>}
                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={loading}>
                    {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Sign In to Admin'}
                  </button>
                  <button type="button" onClick={() => { setStep('email'); setError(''); setPassword('') }}
                    className="text-sm text-gray-500 hover:text-gray-700 font-body w-full text-center"
                  >
                    ← Use a different email
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6 font-body">
          © {new Date().getFullYear()} Kingdom Dominion Covenant Ministries Fellowship
        </p>
      </div>
    </div>
  )
}
