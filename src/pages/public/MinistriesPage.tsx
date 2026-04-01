import { useEffect, useState } from 'react'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { MapPin, Globe, Building2, Search } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = {
  church: 'Member Church',
  ministry: 'Member Ministry',
  para_church: 'Para-Church Organization',
  affiliate: 'Affiliate',
}

const TYPE_COLORS: Record<string, string> = {
  church: 'bg-crimson-100 text-crimson-800',
  ministry: 'bg-blue-100 text-blue-800',
  para_church: 'bg-purple-100 text-purple-800',
  affiliate: 'bg-gray-100 text-gray-700',
}

const TYPE_GROUPS = [
  { key: 'church', label: 'Member Churches', description: 'Local congregations formally affiliated with KDCMF through a Church Affiliation Resolution.' },
  { key: 'ministry', label: 'Member Ministries', description: 'Independent ministries in full covenant fellowship with KDCMF.' },
  { key: 'para_church', label: 'Para-Church Organizations', description: 'Organizations aligned with the KDCMF mission serving in specialized ministry capacities.' },
  { key: 'affiliate', label: 'Affiliate Churches & Ministries', description: 'Churches and ministries in limited affiliation for training, fellowship, or credentialing support.' },
]

export default function MinistriesPage() {
  const [ministries, setMinistries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    supabase
      .from('ministries')
      .select('*')
      .eq('status', 'active')
      .order('name')
      .then(({ data }) => {
        setMinistries(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = ministries.filter(m => {
    const matchSearch = search === '' ||
      `${m.name} ${m.senior_pastor || ''} ${m.city || ''} ${m.state || ''}`.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || m.type === filterType
    return matchSearch && matchType
  })

  const grouped = TYPE_GROUPS.reduce((acc, group) => {
    const items = filtered.filter(m => m.type === group.key)
    if (items.length > 0) acc[group.key] = { ...group, items }
    return acc
  }, {} as Record<string, any>)

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Ministry Directory
          </h1>
          <p className="text-gray-200 font-body text-lg max-w-2xl mx-auto">
            A growing network of churches, ministries, and organizations united in covenant fellowship under Kingdom Dominion Covenant Ministries Fellowship Inc.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      {/* Covenant Statement */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 font-body leading-relaxed max-w-3xl mx-auto">
            KDCMF fully recognizes and respects the autonomy of each affiliated church and ministry. The Fellowship does not govern internal operations, real property, finances, or leadership appointments of local congregations. Affiliation is a covenantal partnership — not a legal or hierarchical control structure.
          </p>
          <p className="text-sm text-gold-600 font-body font-semibold mt-3 italic">
            "Can two walk together, except they be agreed?" — Amos 3:3
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-8 bg-gray-50 border-b border-gray-100 sticky top-16 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                className="input pl-9 bg-white"
                placeholder="Search by name, pastor, or location..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="input w-auto bg-white"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              {TYPE_GROUPS.map(g => (
                <option key={g.key} value={g.key}>{g.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Building2 size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-body text-lg">
                {search ? 'No ministries found matching your search.' : 'Ministry directory coming soon.'}
              </p>
              {!search && (
                <p className="text-gray-400 font-body text-sm mt-2">
                  Member churches and ministries will appear here once they are added to the directory.
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-14">
              {Object.entries(grouped).map(([key, group]: [string, any]) => (
                <div key={key}>
                  {/* Group heading */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="gold-bar w-12" style={{ height: '3px' }} />
                    <h2 className="font-display text-2xl font-bold text-crimson-900">{group.label}</h2>
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-sm text-gray-400 font-body">{group.items.length}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-body mb-6 ml-16">{group.description}</p>

                  {/* Ministry cards */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {group.items.map((m: any) => (
                      <div key={m.id} className="card p-5 hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-12 h-12 bg-crimson-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                            <span className="font-display font-bold text-white text-sm">
                              {m.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('')}
                            </span>
                          </div>
                          <span className={`badge text-xs ${TYPE_COLORS[m.type] || 'badge-gray'}`}>
                            {TYPE_LABELS[m.type] || m.type}
                          </span>
                        </div>

                        {/* Name */}
                        <h3 className="font-display font-bold text-crimson-900 text-base leading-snug mb-1">
                          {m.name}
                        </h3>

                        {/* Senior leader */}
                        {m.senior_pastor && (
                          <p className="text-sm font-body text-gold-700 font-semibold mb-2">
                            {m.pastor_title || 'Pastor'} {m.senior_pastor}
                          </p>
                        )}

                        {/* Description */}
                        {m.description && (
                          <p className="text-xs text-gray-500 font-body leading-relaxed mb-3 line-clamp-2">
                            {m.description}
                          </p>
                        )}

                        {/* Location */}
                        {(m.city || m.state) && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-body mt-auto pt-2 border-t border-gray-50">
                            <MapPin size={11} />
                            {[m.city, m.state, m.country !== 'USA' ? m.country : ''].filter(Boolean).join(', ')}
                          </div>
                        )}

                        {/* Website */}
                        {m.website && (
                          <a href={m.website} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-crimson-600 hover:underline font-body mt-1">
                            <Globe size={11} /> Visit Website
                          </a>
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
      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-2xl font-bold text-crimson-900 mb-3">
            Is Your Church or Ministry Listed?
          </h2>
          <p className="text-gray-600 font-body mb-6">
            If you are an affiliated member of KDCMF and your church or ministry does not appear in the directory, contact the Office of the Presiding Bishop to be added. If you are not yet affiliated, we invite you to apply for membership.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/join" className="btn-primary px-8 py-3">Apply for Membership</a>
            <a href="/contact" className="btn-outline px-8 py-3">Contact Us</a>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
