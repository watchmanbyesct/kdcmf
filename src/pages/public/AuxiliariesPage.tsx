import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { ChevronRight } from 'lucide-react'

export default function AuxiliariesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [auxiliaries, setAuxiliaries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabase.from('auxiliary_categories').select('*').order('sort_order'),
      supabase.from('auxiliaries').select('*').eq('is_published', true).eq('is_active', true).order('sort_order')
    ]).then(([{ data: cats }, { data: auxs }]) => {
      setCategories(cats || [])
      setAuxiliaries(auxs || [])
      setLoading(false)
    })
  }, [])

  const grouped = categories.map(cat => ({
    ...cat,
    items: auxiliaries.filter(a => a.category_id === cat.id)
  })).filter(cat => cat.items.length > 0)

  return (
    <PublicLayout>
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">Fellowship Auxiliaries</h1>
          <p className="text-gray-200 font-body text-lg max-w-2xl mx-auto">
            Ministry for every member of the body — women, men, youth, and beyond.
          </p>
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" /></div>
          ) : auxiliaries.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-body">Auxiliary pages coming soon.</div>
          ) : (
            <div className="space-y-14">
              {grouped.map(group => (
                <div key={group.id}>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="gold-bar w-12" style={{ height: '3px' }} />
                    <h2 className="font-display text-2xl font-bold text-crimson-900">{group.name}</h2>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.items.map((aux: any) => (
                      <Link key={aux.id} to={`/auxiliaries/${aux.slug}`}
                        className="card overflow-hidden group hover:shadow-lg transition-shadow"
                      >
                        {aux.banner_url ? (
                          <img src={aux.banner_url} alt={aux.name} className="w-full h-32 object-cover" />
                        ) : (
                          <div className="bg-crimson-gradient h-2" />
                        )}
                        <div className="p-6">
                          <span className="text-xs font-semibold font-body text-gold-600 uppercase tracking-wider">{group.name}</span>
                          <h3 className="font-display text-xl font-bold text-crimson-900 mt-1 mb-2 group-hover:text-crimson-700 transition-colors">{aux.name}</h3>
                          {aux.tagline && <p className="text-sm text-gray-500 font-body italic mb-3">{aux.tagline}</p>}
                          {aux.description && <p className="text-sm text-gray-600 font-body leading-relaxed line-clamp-3 mb-4">{aux.description}</p>}
                          <span className="text-crimson-700 text-sm font-semibold font-body inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                            Learn More <ChevronRight size={14} />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-crimson-900 mb-3">Get Involved</h2>
          <p className="text-gray-600 font-body mb-6">Connect with an auxiliary ministry and find your place in the fellowship body.</p>
          <Link to="/contact" className="btn-primary px-8 py-3">Contact Us</Link>
        </div>
      </section>
    </PublicLayout>
  )
}
