import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMemberAuth } from '../../lib/auth'
import { KDCMF_SEAL } from '../../lib/logos'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, Calendar, MapPin, Video } from 'lucide-react'

export default function MemberEvents() {
  const { profile, logout } = useMemberAuth()
  const [events, setEvents] = useState<any[]>([])
  const [registrations, setRegistrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: evts }, { data: regs }] = await Promise.all([
      supabase.from('events').select('*').eq('is_published', true).order('start_date'),
      supabase.from('event_registrations').select('*').eq('email', profile?.email || ''),
    ])
    setEvents(evts || [])
    setRegistrations(regs || [])
    setLoading(false)
  }

  const isRegistered = (eventId: string) => registrations.some(r => r.event_id === eventId)

  const handleRegister = async (evt: any) => {
    if (!profile) return
    const code = `KDCMF-${Date.now().toString(36).toUpperCase()}`
    await supabase.from('event_registrations').insert({
      event_id: evt.id,
      profile_id: profile.id,
      first_name: profile.first_name,
      last_name: profile.last_name,
      email: profile.email,
      confirmation_code: code,
      payment_status: evt.price > 0 ? 'pending' : 'waived',
    })
    loadData()
  }

  const upcoming = events.filter(e => new Date(e.end_date) >= new Date())
  const past = events.filter(e => new Date(e.end_date) < new Date())

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-crimson-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={KDCMF_SEAL} alt="KDCMF" className="w-8 h-8 rounded-full object-cover border border-gold-400/40" />
          <span className="font-display font-bold text-sm">KDCMF Member Portal</span>
        </div>
        <button onClick={logout} className="text-xs text-gray-400 hover:text-white font-body">Sign Out</button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/portal" className="flex items-center gap-1.5 text-sm text-crimson-600 font-body font-medium mb-6 hover:underline">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 className="font-display text-2xl font-bold text-crimson-900 mb-8">Events</h1>

        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-8">
            {upcoming.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold text-crimson-900 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {upcoming.map(evt => (
                    <div key={evt.id} className="card p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-display font-bold text-gray-900">{evt.title}</h3>
                            {evt.is_featured && <span className="text-xs text-gold-600">★ Featured</span>}
                          </div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-body mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(evt.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                            {evt.is_virtual ? (
                              <span className="flex items-center gap-1 text-blue-600"><Video size={12} /> Virtual</span>
                            ) : evt.location_city && (
                              <span className="flex items-center gap-1"><MapPin size={12} />{evt.location_city}, {evt.location_state}</span>
                            )}
                            {evt.price > 0 && <span className="text-crimson-600 font-semibold">${evt.price}</span>}
                            {evt.price === 0 && <span className="text-green-600 font-semibold">Free</span>}
                          </div>
                          {evt.description && <p className="text-sm text-gray-500 font-body mt-2 leading-relaxed">{evt.description}</p>}
                        </div>
                        <div className="flex-shrink-0">
                          {isRegistered(evt.id) ? (
                            <span className="badge-green text-xs px-3 py-1.5">Registered ✓</span>
                          ) : evt.registration_required ? (
                            <button onClick={() => handleRegister(evt)} className="btn-primary text-xs py-2 px-4">
                              Register
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400 font-body">No registration required</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div>
                <h2 className="font-display text-lg font-semibold text-gray-500 mb-4">Past Events</h2>
                <div className="space-y-3">
                  {past.map(evt => (
                    <div key={evt.id} className="card p-4 opacity-70">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-display font-semibold text-gray-700 text-sm">{evt.title}</div>
                          <div className="text-xs text-gray-400 font-body">
                            {new Date(evt.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </div>
                        </div>
                        {isRegistered(evt.id) && <span className="badge-green text-xs">Attended</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {events.length === 0 && (
              <div className="card p-10 text-center">
                <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 font-body">No events scheduled at this time.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
