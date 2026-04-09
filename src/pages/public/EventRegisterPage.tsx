import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { Calendar, MapPin, Video, CheckCircle, ArrowLeft } from 'lucide-react'

const defaultForm = {
  first_name: '', last_name: '', email: '', phone: '', church_name: '', dietary_restrictions: '', special_needs: ''
}

function generateCode() {
  return 'KDCMF-' + Math.random().toString(36).toUpperCase().slice(2, 8)
}

export default function EventRegisterPage() {
  const { id } = useParams()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.from('events').select('*').eq('id', id).eq('is_published', true).single()
      .then(({ data }) => { setEvent(data); setLoading(false) })
  }, [id])

  const handleSubmit = async () => {
    setError('')
    if (!form.first_name || !form.last_name || !form.email) {
      setError('Please fill in your name and email.')
      return
    }
    setSubmitting(true)
    const code = generateCode()
    const { error: err } = await supabase.from('event_registrations').insert({
      event_id: id,
      ...form,
      confirmation_code: code,
      payment_status: event?.price > 0 ? 'pending' : 'waived',
      amount_paid: event?.price > 0 ? event.price : 0,
    })
    if (err) { setError('Registration failed. Please try again.'); setSubmitting(false); return }
    setConfirmationCode(code)
    setSubmitted(true)
    setSubmitting(false)
  }

  const f = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center py-32"><div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" /></div>
    </PublicLayout>
  )

  if (!event) return (
    <PublicLayout>
      <div className="text-center py-32">
        <p className="text-gray-400 font-body">Event not found.</p>
        <Link to="/events" className="btn-primary mt-4 inline-block">View All Events</Link>
      </div>
    </PublicLayout>
  )

  if (event.status === 'registration_coming_soon') return (
    <PublicLayout>
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-4">{event.title}</h1>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="card p-10">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔔</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-crimson-900 mb-3">Registration Opening Soon</h2>
          <p className="text-gray-600 font-body mb-6">Registration for {event.title} is not yet open. Please check back soon or follow our announcements for updates.</p>
          <Link to="/events" className="btn-primary px-8 py-3">Back to Events</Link>
        </div>
      </div>
    </PublicLayout>
  )

  if (submitted) return (
    <PublicLayout>
      <div className="max-w-xl mx-auto px-4 py-16">
        <div className="card p-10 text-center">
          <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-crimson-900 mb-2">You're Registered!</h2>
          <p className="text-gray-600 font-body mb-4">Thank you, {form.first_name}. Your registration for <strong>{event.title}</strong> has been received.</p>
          <div className="bg-crimson-50 border border-crimson-200 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 font-body mb-1">Your Confirmation Code</p>
            <p className="font-display text-2xl font-bold text-crimson-700 tracking-widest">{confirmationCode}</p>
            <p className="text-xs text-gray-400 font-body mt-1">Save this code — you will need it at check-in.</p>
          </div>
          {event.price > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 font-body">Payment of <strong>${event.price}</strong> is due at the event. We will have payment options available at registration.</p>
            </div>
          )}
          <Link to="/events" className="btn-primary px-8 py-3">Back to Events</Link>
        </div>
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-crimson-gradient py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link to="/events" className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-sm font-body mb-4 transition-colors">
            <ArrowLeft size={14} /> Back to Events
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">{event.title}</h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-200 font-body">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(event.start_date)}
            </span>
            {event.is_virtual ? (
              <span className="flex items-center gap-1.5 text-blue-300"><Video size={14} /> Virtual Event</span>
            ) : event.location_name && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} />
                {event.location_name}{event.location_city && `, ${event.location_city}, ${event.location_state}`}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">

            {/* Registration Form */}
            <div className="md:col-span-2">
              <h2 className="font-display text-2xl font-bold text-crimson-900 mb-6">Register for This Event</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="label">First Name *</label><input className="input" value={form.first_name} onChange={e => f('first_name', e.target.value)} /></div>
                  <div><label className="label">Last Name *</label><input className="input" value={form.last_name} onChange={e => f('last_name', e.target.value)} /></div>
                </div>
                <div><label className="label">Email Address *</label><input type="email" className="input" value={form.email} onChange={e => f('email', e.target.value)} /></div>
                <div><label className="label">Phone Number</label><input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} /></div>
                <div><label className="label">Church / Organization</label><input className="input" value={form.church_name} onChange={e => f('church_name', e.target.value)} /></div>
                <div><label className="label">Dietary Restrictions</label><input className="input" value={form.dietary_restrictions} onChange={e => f('dietary_restrictions', e.target.value)} placeholder="Leave blank if none" /></div>
                <div><label className="label">Special Needs or Accommodations</label><textarea className="input" rows={2} value={form.special_needs} onChange={e => f('special_needs', e.target.value)} placeholder="Leave blank if none" /></div>

                {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg font-body">{error}</p>}

                <button
                  onClick={handleSubmit}
                  className="btn-primary w-full py-3 text-base"
                  disabled={submitting}
                >
                  {submitting
                    ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    : event.price > 0 ? `Complete Registration — $${event.price}` : 'Complete Registration — Free'
                  }
                </button>
                <p className="text-xs text-gray-400 font-body text-center">
                  No account required. You will receive a confirmation code upon registration.
                </p>
              </div>
            </div>

            {/* Event Summary */}
            <div>
              <div className="card p-5 sticky top-6">
                <h3 className="font-display font-bold text-crimson-900 mb-4">Event Details</h3>
                <div className="space-y-3 text-sm font-body text-gray-600">
                  <div className="flex items-start gap-2"><Calendar size={14} className="text-crimson-600 mt-0.5 flex-shrink-0" /><span>{formatDate(event.start_date)}</span></div>
                  {event.end_date && event.end_date !== event.start_date && (
                    <div className="flex items-start gap-2"><Calendar size={14} className="text-crimson-600 mt-0.5 flex-shrink-0" /><span>Through {formatDate(event.end_date)}</span></div>
                  )}
                  {event.is_virtual ? (
                    <div className="flex items-center gap-2"><Video size={14} className="text-blue-500 flex-shrink-0" /><span>Virtual Event</span></div>
                  ) : event.location_name && (
                    <div className="flex items-start gap-2"><MapPin size={14} className="text-crimson-600 mt-0.5 flex-shrink-0" />
                      <span>{event.location_name}{event.location_address && <><br />{event.location_address}</>}{event.location_city && <><br />{event.location_city}, {event.location_state}</>}</span>
                    </div>
                  )}
                </div>
                {event.price > 0 ? (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-body text-gray-600">Registration Fee</span>
                      <span className="font-display font-bold text-crimson-900">${event.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-body mt-1">Payment collected at the event</p>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="text-green-600 font-body font-semibold text-sm">Free Event</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
