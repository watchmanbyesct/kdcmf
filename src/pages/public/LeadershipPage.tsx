import { useEffect, useState } from 'react'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'

const CATEGORIES = [
  { value: 'presiding', label: 'Presiding Bishopric' },
  { value: 'executive', label: 'Executive Leadership' },
  { value: 'national', label: 'National Officers' },
  { value: 'regional', label: 'Regional Leadership' },
  { value: 'auxiliary', label: 'Auxiliary Leadership' },
  { value: 'honorary', label: 'Honorary' },
]

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('leadership')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('sort_order')
      .then(({ data }) => {
        setLeaders(data || [])
        setLoading(false)
      })
  }, [])

  const grouped = CATEGORIES.reduce((acc, cat) => {
    const members = leaders.filter(l => l.category === cat.value)
    if (members.length > 0) acc[cat.value] = { label: cat.label, members }
    return acc
  }, {} as Record<string, { label: string; members: any[] }>)

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Fellowship Leadership
          </h1>
          <p className="text-gray-200 font-body text-lg max-w-2xl mx-auto">
            Under the guidance of our Presiding Bishop, Bishop Owens F. Shepard, the leadership of KDCMF is committed to covenant, accountability, and Kingdom advancement.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      {/* Leaders */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : Object.keys(grouped).length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 font-body">Leadership directory coming soon.</p>
            </div>
          ) : (
            <div className="space-y-14">
              {Object.entries(grouped).map(([cat, group]) => (
                <div key={cat}>
                  {/* Category heading */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="gold-bar w-12" style={{ height: '3px' }} />
                    <h2 className="font-display text-2xl font-bold text-crimson-900">{group.label}</h2>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  {/* Leaders grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.members.map(leader => (
                      <div key={leader.id} className="card p-6 hover:shadow-md transition-shadow">
                        {/* Avatar */}
                        <div className="flex items-start gap-4 mb-4">
                          {leader.photo_url ? (
                            <img
                              src={leader.photo_url}
                              alt={leader.name}
                              className="w-16 h-16 rounded-full object-cover flex-shrink-0 border-2 border-gold-300"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-crimson-gradient flex items-center justify-center flex-shrink-0 border-2 border-gold-300">
                              <span className="font-display font-bold text-white text-lg">
                                {leader.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display font-bold text-crimson-900 text-lg leading-tight">{leader.name}</h3>
                            <p className="text-gold-600 font-body text-sm font-semibold mt-0.5">{leader.title}</p>
                            {leader.office && (
                              <p className="text-gray-500 font-body text-xs mt-0.5">{leader.office}</p>
                            )}
                          </div>
                        </div>

                        {/* Church info */}
                        {leader.church_name && (
                          <div className="border-t border-gray-100 pt-3 mt-3">
                            <p className="text-sm font-body text-gray-700 font-medium">{leader.church_name}</p>
                            {(leader.church_city || leader.church_state) && (
                              <p className="text-xs text-gray-400 font-body mt-0.5">
                                {[leader.church_city, leader.church_state].filter(Boolean).join(', ')}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Bio */}
                        {leader.bio && (
                          <p className="text-xs text-gray-500 font-body mt-3 leading-relaxed line-clamp-3">
                            {leader.bio}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-crimson-900 mb-3">Join the Fellowship</h2>
          <p className="text-gray-600 font-body mb-6">
            Are you a pastor, bishop, or ministry leader called to covenant fellowship? We welcome you.
          </p>
          <a href="/join" className="btn-primary px-8 py-3">Apply for Membership</a>
        </div>
      </section>
    </PublicLayout>
  )
}
