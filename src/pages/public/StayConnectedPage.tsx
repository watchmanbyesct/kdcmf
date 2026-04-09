import { useState } from 'react'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { CheckCircle, Bell, Mail, Calendar, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

const INTERESTS = [
  { value: 'events', label: 'Events & Convocations', icon: <Calendar size={16} /> },
  { value: 'newsletter', label: 'Fellowship Newsletter', icon: <Mail size={16} /> },
  { value: 'training', label: 'Training & Education', icon: <BookOpen size={16} /> },
  { value: 'announcements', label: 'General Announcements', icon: <Bell size={16} /> },
]

const defaultForm = { first_name: '', last_name: '', email: '', phone: '', city: '', state: '', interests: [] as string[] }

export default function StayConnectedPage() {
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const toggleInterest = (val: string) => {
    setForm(p => ({
      ...p,
      interests: p.interests.includes(val) ? p.interests.filter(i => i !== val) : [...p.interests, val]
    }))
  }

  const handleSubmit = async () => {
    setError('')
    if (!form.first_name || !form.last_name || !form.email) {
      setError('Please fill in your name and email.')
      return
    }
    setSubmitting(true)
    const { error: err } = await supabase.from('site_users').upsert({
      ...form,
      confirmed_at: new Date().toISOString(),
      source: 'stay-connected'
    }, { onConflict: 'email' })
    if (err) { setError('Something went wrong. Please try again.'); setSubmitting(false); return }
    setSubmitted(true)
    setSubmitting(false)
  }

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  if (submitted) return (
    <PublicLayout>
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="card p-10">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-crimson-900 mb-3">You're Connected!</h2>
          <p className="text-gray-600 font-body leading-relaxed mb-6">
            Thank you, {form.first_name}. You will receive updates from Kingdom Dominion Covenant Ministries Fellowship based on your selected interests.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/events" className="btn-primary px-6 py-2.5">View Upcoming Events</Link>
            <Link to="/" className="btn-ghost px-6 py-2.5 border border-gray-300 text-gray-600">Go to Homepage</Link>
          </div>
        </div>
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Stay Connected</h1>
          <p className="text-gray-200 font-body text-lg max-w-xl mx-auto">
            Sign up to receive updates, event announcements, and news from Kingdom Dominion Covenant Ministries Fellowship.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="card p-8">
            <div className="crimson-bar rounded mb-6" />
            <p className="text-gray-500 font-body text-sm mb-6">
              This is for people who want to stay informed about KDCMF. This is not a membership application.
              If you are a pastor, church, or ministry leader looking to join the fellowship, visit our
              <Link to="/join" className="text-crimson-600 font-semibold hover:underline mx-1">Membership page</Link>instead.
            </p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">First Name *</label><input className="input" value={form.first_name} onChange={e => f('first_name', e.target.value)} /></div>
                <div><label className="label">Last Name *</label><input className="input" value={form.last_name} onChange={e => f('last_name', e.target.value)} /></div>
              </div>
              <div><label className="label">Email Address *</label><input type="email" className="input" value={form.email} onChange={e => f('email', e.target.value)} /></div>
              <div><label className="label">Phone Number</label><input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">City</label><input className="input" value={form.city} onChange={e => f('city', e.target.value)} /></div>
                <div><label className="label">State</label><input className="input" value={form.state} onChange={e => f('state', e.target.value)} placeholder="NY" /></div>
              </div>

              {/* Interests */}
              <div>
                <label className="label mb-2">What would you like to hear about?</label>
                <div className="grid grid-cols-2 gap-2">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest.value}
                      type="button"
                      onClick={() => toggleInterest(interest.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-body transition-all ${
                        form.interests.includes(interest.value)
                          ? 'bg-crimson-700 text-white border-crimson-700'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-crimson-300'
                      }`}
                    >
                      {interest.icon}
                      {interest.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg font-body">{error}</p>}

              <button onClick={handleSubmit} className="btn-primary w-full py-3" disabled={submitting}>
                {submitting
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                  : 'Sign Me Up'}
              </button>
              <p className="text-xs text-gray-400 font-body text-center">
                We respect your privacy. You can unsubscribe at any time.
              </p>
            </div>
          </div>

          {/* Other paths */}
          <div className="mt-8 grid sm:grid-cols-2 gap-4">
            <div className="card p-5 text-center">
              <p className="text-sm font-body text-gray-600 mb-3">Want to register for an upcoming event?</p>
              <Link to="/events" className="btn-outline text-sm py-2 px-4">View Events</Link>
            </div>
            <div className="card p-5 text-center">
              <p className="text-sm font-body text-gray-600 mb-3">Ready to join the fellowship?</p>
              <Link to="/join" className="btn-primary text-sm py-2 px-4">Apply for Membership</Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
