import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMemberAuth } from '../../lib/auth'
import { supabase } from '../../lib/supabase'
import { Save, CheckCircle, ArrowLeft } from 'lucide-react'

export default function MemberProfile() {
  const { profile, logout } = useMemberAuth()
  const [form, setForm] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    phone: (profile as any)?.phone || '',
    title: profile?.title || '',
    church_name: (profile as any)?.church_name || '',
    church_city: (profile as any)?.church_city || '',
    church_state: (profile as any)?.church_state || '',
    bio: (profile as any)?.bio || '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('profiles').update(form).eq('id', profile?.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const f = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-crimson-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gold-500 rounded-full flex items-center justify-center font-display font-bold text-crimson-900 text-xs">KD</div>
          <span className="font-display font-bold text-sm">KDCMF Member Portal</span>
        </div>
        <button onClick={logout} className="text-xs text-gray-400 hover:text-white font-body">Sign Out</button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link to="/portal" className="flex items-center gap-1.5 text-sm text-crimson-600 font-body font-medium mb-6 hover:underline">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <div className="card overflow-hidden">
          <div className="crimson-bar" />
          <div className="px-6 py-4 border-b border-gray-100">
            <h1 className="font-display text-xl font-bold text-crimson-900">My Profile</h1>
            <p className="text-sm text-gray-500 font-body">{profile?.email}</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">First Name</label><input className="input" value={form.first_name} onChange={e => f('first_name', e.target.value)} /></div>
              <div><label className="label">Last Name</label><input className="input" value={form.last_name} onChange={e => f('last_name', e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">Title</label><input className="input" value={form.title} onChange={e => f('title', e.target.value)} placeholder="Pastor, Bishop, Rev..." /></div>
              <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} /></div>
            </div>
            <div><label className="label">Church / Ministry Name</label><input className="input" value={form.church_name} onChange={e => f('church_name', e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="label">City</label><input className="input" value={form.church_city} onChange={e => f('church_city', e.target.value)} /></div>
              <div><label className="label">State</label><input className="input" value={form.church_state} onChange={e => f('church_state', e.target.value)} /></div>
            </div>
            <div><label className="label">Bio</label><textarea className="input" rows={3} value={form.bio} onChange={e => f('bio', e.target.value)} placeholder="Brief biography..." /></div>
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
            {saved ? (
              <div className="flex items-center gap-2 text-green-600 text-sm font-body"><CheckCircle size={15} /> Profile saved</div>
            ) : <div />}
            <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
