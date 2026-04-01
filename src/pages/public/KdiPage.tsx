import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { BookOpen, Users } from 'lucide-react'
import { KDI_LOGO } from '../../lib/logos'

const CERTIFICATES = [
  { name: 'Certificate of Biblical Foundations', audience: 'All members', hours: 32 },
  { name: 'Certificate of Spiritual Formation', audience: 'All members', hours: 40 },
  { name: 'Certificate in Christian Living and Witness', audience: 'Lay members and ministry workers', hours: null },
  { name: 'Certificate in Kingdom Stewardship', audience: 'Lay members and ministry workers', hours: null },
  { name: 'Certificate in Church Life and Service', audience: 'Ministry workers and support teams', hours: null },
  { name: 'Certificate in Ministry Leadership', audience: 'Pastors and ministry leaders', hours: null },
  { name: 'Certificate in Deacon Ministry', audience: 'Deacon candidates', hours: null },
  { name: 'Certificate in Elder Ministry', audience: 'Elder candidates', hours: null },
  { name: 'Certificate in Adjutant Ministry and Sacred Protocol', audience: 'Adjutants and protocol teams', hours: null },
  { name: 'Certificate in Ministry Partnership and Family Care', audience: 'Ministry spouses and engaged individuals', hours: null },
]

export default function KdiPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('kdi_courses').select('*').eq('is_published', true).order('sort_order')
      .then(({ data }) => { setCourses(data || []); setLoading(false) })
  }, [])


  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-crimson-gradient py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 text-center md:text-left">
              <div className="gold-bar w-24 mb-6 mx-auto md:mx-0" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
                Kingdom Dominion Institute
              </h1>
              <p className="text-gray-200 font-body text-lg leading-relaxed max-w-xl">
                The educational and formational arm of KDCMF, providing disciplined, biblically grounded instruction that equips believers for faithful Christian living, informed service, and deeper understanding of Holy Scripture.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img src={KDI_LOGO} alt="Kingdom Dominion Institute"
                className="w-60 h-60 object-contain drop-shadow-xl"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Important Distinction */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="card p-5 border-l-4 border-gold-500 bg-gold-50">
            <p className="text-sm font-body text-yellow-800 leading-relaxed">
              <strong>Important:</strong> KDI does not confer ecclesiastical rank or authority. KDI provides biblical literacy, spiritual formation, leadership readiness, and practical discipleship. KDI certificates support but do not replace credentialing requirements. All consecratory and ordination authority remains within the Fellowship's credentialing processes.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <div className="gold-bar w-12 mb-4" style={{ height: '3px' }} />
              <h2 className="section-title mb-4">Mission</h2>
              <p className="text-gray-600 font-body leading-relaxed mb-4">
                The mission of the Kingdom Dominion Institute is to provide disciplined, biblically grounded instruction and spiritual formation that equips believers for faithful Christian living, informed service, and deeper understanding of Holy Scripture.
              </p>
              <p className="text-gray-600 font-body leading-relaxed">
                KDI exists to strengthen the church by cultivating biblical literacy, spiritual maturity, and ministry competence across clergy and lay membership — without presuming leadership calling or ecclesiastical rank.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-crimson-900 mb-4">Who KDI Serves</h3>
              <div className="space-y-2">
                {['Lay members', 'Ministry workers', 'Deacons', 'Elders', 'Adjutants', 'Ministry spouses', 'Emerging leaders'].map(s => (
                  <div key={s} className="flex items-center gap-2 text-sm font-body text-gray-700">
                    <Users size={13} className="text-crimson-600 flex-shrink-0" />
                    {s}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 font-body mt-4 italic">KDI affirms that not all believers are called to leadership, but all believers are called to growth, faithfulness, and spiritual development.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Model */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Three-Layer Academic Model</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { num: '1', title: 'Core Formation Curriculum', desc: 'Required for all KDI participants. Establishes foundational biblical literacy and spiritual maturity regardless of track.' },
              { num: '2', title: 'Track-Specific Development', desc: 'Targeted learning aligned to role and calling. Provides specialized formation for ministry functions.' },
              { num: '3', title: 'Workshop & Intensive Model', desc: 'Short-form, stand-alone or thematic instruction. Enables flexible, event-based deployment.' },
            ].map(layer => (
              <div key={layer.num} className="card p-6">
                <div className="w-10 h-10 bg-crimson-gradient rounded-lg flex items-center justify-center text-white font-display font-bold text-sm mb-3">{layer.num}</div>
                <h3 className="font-display font-bold text-crimson-900 mb-2">{layer.title}</h3>
                <p className="text-sm text-gray-500 font-body leading-relaxed">{layer.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      {!loading && courses.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <h2 className="section-title mb-3">Available Courses</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {courses.map(c => (
                <div key={c.id} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {c.code && <div className="text-xs text-gray-400 font-body mb-1">{c.code}</div>}
                      <h3 className="font-display font-bold text-crimson-900 text-sm">{c.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Certificates */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Certificate Programs</h2>
            <p className="section-subtitle">12 certificate pathways aligned to calling, role, and readiness.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {CERTIFICATES.map(cert => (
              <div key={cert.name} className="card p-4 flex items-start gap-3">
                <BookOpen size={16} className="text-crimson-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-display font-semibold text-crimson-900">{cert.name}</div>
                  <div className="text-xs text-gray-400 font-body">{cert.audience}{cert.hours ? ` · ${cert.hours} contact hours` : ''}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enroll CTA */}
      <section className="py-14 bg-crimson-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">Begin Your Formation Journey</h2>
          <p className="text-gray-200 font-body mb-8 max-w-xl mx-auto">
            KDI is open to lay members, ministry workers, and clergy at all stages. Sign in to your member portal to enroll in available courses.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/login" className="btn-gold px-8 py-3">Sign In to Enroll</Link>
            <Link to="/register" className="btn-ghost px-8 py-3">Create an Account</Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
