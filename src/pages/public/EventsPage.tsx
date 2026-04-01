import { useEffect, useState } from 'react'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { Calendar, MapPin, Video, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { SAVE_THE_DATE_2026 } from '../../lib/logos'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('events').select('*')
      .eq('is_published', true)
      .order('start_date')
      .then(({ data }) => { setEvents(data || []); setLoading(false) })
  }, [])

  const upcoming = events.filter(e => new Date(e.end_date) >= new Date())
  const past = events.filter(e => new Date(e.end_date) < new Date())

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  const formatShortDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <PublicLayout>
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Events</h1>
          <p className="text-gray-200 font-body text-lg max-w-xl mx-auto">
            Convocations, conferences, and fellowship gatherings that strengthen the Body of Christ.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      {/* Save the Date Feature Banner */}
      <section className="py-10 bg-crimson-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-4">
            <span className="badge bg-gold-500 text-crimson-950 font-bold text-xs uppercase tracking-wider px-3 py-1">
              Upcoming Event
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gold-400/40">
            <img
              src={SAVE_THE_DATE_2026}
              alt="Save the Date — KDCMF Convocation 2026"
              className="w-full h-auto block"
            />
          </div>
          <div className="text-center mt-5">
            <Link to="/login" className="btn-gold px-8 py-3">Register Now</Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" /></div>
          ) : (
            <div className="space-y-12">
              {upcoming.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="gold-bar w-12" style={{ height: '3px' }} />
                    <h2 className="font-display text-2xl font-bold text-crimson-900">Upcoming Events</h2>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="space-y-6">
                    {upcoming.map(evt => (
                      <div key={evt.id} className={`card overflow-hidden ${evt.is_featured ? 'ring-2 ring-crimson-700' : ''}`}>
                        {evt.is_featured && <div className="crimson-bar" />}
                        <div className="p-6 md:p-8">
                          <div className="flex flex-col md:flex-row md:items-start gap-6">
                            {/* Date block */}
                            <div className="flex-shrink-0 w-20 h-20 bg-crimson-gradient rounded-xl flex flex-col items-center justify-center text-white shadow-md">
                              <div className="text-xs font-body font-semibold uppercase tracking-wider opacity-80">
                                {new Date(evt.start_date).toLocaleDateString('en-US', { month: 'short' })}
                              </div>
                              <div className="font-display text-3xl font-bold leading-none">
                                {new Date(evt.start_date).getDate()}
                              </div>
                            </div>
                            {/* Content */}
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                {evt.is_featured && <span className="badge bg-gold-100 text-yellow-700 text-xs">★ Featured</span>}
                                <span className="badge-crimson text-xs capitalize">
                                  {evt.type === 'convocation' ? 'Annual Convocation' : evt.type}
                                </span>
                              </div>
                              <h3 className="font-display text-2xl font-bold text-crimson-900 mb-2">{evt.title}</h3>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-500 font-body mb-3">
                                <span className="flex items-center gap-1.5">
                                  <Calendar size={14} />
                                  {formatDate(evt.start_date)}
                                  {evt.end_date !== evt.start_date && ` — ${formatShortDate(evt.end_date)}`}
                                </span>
                                {evt.is_virtual ? (
                                  <span className="flex items-center gap-1.5 text-blue-600"><Video size={14} /> Virtual Event</span>
                                ) : evt.location_name && (
                                  <span className="flex items-center gap-1.5">
                                    <MapPin size={14} />
                                    {evt.location_name}{evt.location_city && `, ${evt.location_city}, ${evt.location_state}`}
                                  </span>
                                )}
                              </div>
                              {evt.description && <p className="text-gray-600 font-body text-sm leading-relaxed mb-4">{evt.description}</p>}
                              <div className="flex flex-wrap gap-3">
                                {evt.registration_required && (
                                  <Link to="/login" className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5">
                                    Register Now <ChevronRight size={14} />
                                  </Link>
                                )}
                                {evt.price > 0 && (
                                  <span className="text-sm text-gray-500 font-body self-center">Registration: ${evt.price}</span>
                                )}
                                {evt.price === 0 && evt.registration_required && (
                                  <span className="text-sm text-green-600 font-body font-semibold self-center">Free Event</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {past.length > 0 && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="gold-bar w-12" style={{ height: '3px' }} />
                    <h2 className="font-display text-xl font-semibold text-gray-500">Past Events</h2>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {past.map(evt => (
                      <div key={evt.id} className="card p-5 opacity-70">
                        <div className="flex items-center gap-3">
                          <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                          <div>
                            <div className="font-display font-semibold text-gray-700 text-sm">{evt.title}</div>
                            <div className="text-xs text-gray-400 font-body">
                              {new Date(evt.start_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              {evt.location_city && ` · ${evt.location_city}, ${evt.location_state}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <div className="text-center py-20">
                  <Calendar size={40} className="text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-body text-lg">No events scheduled at this time.</p>
                  <p className="text-gray-400 font-body text-sm mt-2">Check back soon for upcoming convocations and conferences.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-crimson-900 mb-3">Member Registration</h2>
          <p className="text-gray-600 font-body mb-6">KDCMF members can register for events directly through the member portal.</p>
          <Link to="/login" className="btn-primary px-8 py-3">Sign In to Register</Link>
        </div>
      </section>
    </PublicLayout>
  )
}
