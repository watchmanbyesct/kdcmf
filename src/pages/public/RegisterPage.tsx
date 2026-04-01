import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMemberAuth } from '../../lib/auth'
import { KDCMF_SEAL } from '../../lib/logos'
import { Eye, EyeOff } from 'lucide-react'
import PublicLayout from '../../components/public/PublicLayout'

export default function RegisterPage() {
  const { register } = useMemberAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    church_name: '', password: '', confirm_password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.'); return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.'); return
    }
    setLoading(true)
    setError('')
    const result = await register({
      email: form.email, password: form.password,
      first_name: form.first_name, last_name: form.last_name,
      phone: form.phone, church_name: form.church_name
    })
    setLoading(false)
    if (result.error) { setError(result.error); return }
    navigate('/login?registered=true')
  }

  const f = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <img src={KDCMF_SEAL} alt="KDCMF" className="w-16 h-16 rounded-full object-cover mx-auto mb-4 shadow border-2 border-gold-400" />
            <h1 className="font-display text-2xl font-bold text-crimson-900 mb-1">Create Your Account</h1>
            <p className="text-gray-500 font-body text-sm">Set up your KDCMF member account</p>
          </div>

          <div className="card overflow-hidden">
            <div className="crimson-bar" />
            <form onSubmit={handleSubmit} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name *</label>
                  <input className="input" value={form.first_name} onChange={e => f('first_name', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Last Name *</label>
                  <input className="input" value={form.last_name} onChange={e => f('last_name', e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input type="email" className="input" value={form.email} onChange={e => f('email', e.target.value)} required />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} />
              </div>
              <div>
                <label className="label">Church / Ministry Name</label>
                <input className="input" value={form.church_name} onChange={e => f('church_name', e.target.value)} />
              </div>
              <div>
                <label className="label">Password *</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} className="input pr-10"
                    value={form.password} onChange={e => f('password', e.target.value)} required
                    placeholder="Minimum 8 characters" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Confirm Password *</label>
                <input type="password" className="input" value={form.confirm_password}
                  onChange={e => f('confirm_password', e.target.value)} required />
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}
              <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
                {loading
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  : 'Create Account'
                }
              </button>
            </form>
            <div className="px-8 pb-6 text-center">
              <p className="text-sm text-gray-500 font-body">
                Already have an account?{' '}
                <Link to="/login" className="text-crimson-700 font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  )
}
