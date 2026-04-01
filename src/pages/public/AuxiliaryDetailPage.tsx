import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { Mail, ChevronLeft } from 'lucide-react'

export default function AuxiliaryDetailPage() {
  const { slug } = useParams()
  const [aux, setAux] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('auxiliaries').select('*, category:auxiliary_categories(name)')
      .eq('slug', slug).eq('is_published', true).single()
      .then(({ data }) => { setAux(data); setLoading(false) })
  }, [slug])

  if (loading) return (
    <PublicLayout>
      <div className="flex justify-center py-32"><div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" /></div>
    </PublicLayout>
  )

  if (!aux) return (
    <PublicLayout>
      <div className="text-center py-32">
        <p className="text-gray-400 font-body text-lg">Auxiliary not found.</p>
        <Link to="/auxiliaries" className="btn-primary mt-6 inline-block">Back to Auxiliaries</Link>
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="gold-bar mx-auto w-24 mb-4" />
          {aux.category?.name && (
            <p className="text-gold-400 font-body font-semibold text-sm uppercase tracking-wider mb-2">{aux.category.name}</p>
          )}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-3">{aux.name}</h1>
          {aux.tagline && <p className="text-gray-200 font-body text-lg italic">{aux.tagline}</p>}
          <div className="gold-bar mx-auto w-24 mt-6" />
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/auxiliaries" className="flex items-center gap-1.5 text-sm text-crimson-600 font-body font-medium mb-8 hover:underline">
            <ChevronLeft size={14} /> Back to Auxiliaries
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {aux.description && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-crimson-900 mb-3">About {aux.name}</h2>
                  <p className="text-gray-600 font-body leading-relaxed">{aux.description}</p>
                </div>
              )}
              {aux.mission && (
                <div className="card p-6 border-l-4 border-crimson-700">
                  <h3 className="font-display text-lg font-bold text-crimson-900 mb-2">Mission</h3>
                  <p className="text-gray-600 font-body leading-relaxed italic">{aux.mission}</p>
                </div>
              )}
              {aux.vision && (
                <div className="card p-6 border-l-4 border-gold-500">
                  <h3 className="font-display text-lg font-bold text-crimson-900 mb-2">Vision</h3>
                  <p className="text-gray-600 font-body leading-relaxed italic">{aux.vision}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {(aux.leader_name || aux.contact_email) && (
                <div className="card p-5">
                  <h3 className="font-display font-bold text-crimson-900 text-sm mb-3 uppercase tracking-wider">Leadership</h3>
                  {aux.leader_name && (
                    <div className="mb-3">
                      <div className="w-12 h-12 bg-crimson-gradient rounded-full flex items-center justify-center mb-2">
                        <span className="font-display font-bold text-white text-sm">
                          {aux.leader_name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
                        </span>
                      </div>
                      <div className="font-body font-semibold text-gray-900 text-sm">{aux.leader_name}</div>
                      {aux.leader_title && <div className="text-xs text-gray-500 font-body">{aux.leader_title}</div>}
                    </div>
                  )}
                  {aux.contact_email && (
                    <a href={`mailto:${aux.contact_email}`}
                      className="flex items-center gap-2 text-sm text-crimson-600 hover:underline font-body">
                      <Mail size={14} /> {aux.contact_email}
                    </a>
                  )}
                </div>
              )}

              <div className="card p-5 bg-crimson-50 border-crimson-100">
                <p className="text-sm font-body text-crimson-800 leading-relaxed mb-3">
                  Interested in getting involved with {aux.name}?
                </p>
                <Link to="/contact" className="btn-primary text-sm py-2 w-full text-center block">Get Connected</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
