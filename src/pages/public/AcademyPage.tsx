import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../components/public/PublicLayout'
import { supabase } from '../../lib/supabase'
import { GraduationCap, Clock } from 'lucide-react'
import { AES_LOGO } from '../../lib/logos'

const CURRICULUM_LAYERS = [
  {
    title: 'Episcopal Foundations',
    desc: 'Establishes a shared theological, spiritual, and ethical framework for all AES participants.',
    areas: ['Theology of the Episcopacy', 'Episcopal Identity and Character', 'Doctrine, Unity, and Guarding the Faith', 'The Bishop and the Altar']
  },
  {
    title: 'Episcopal Function and Governance',
    desc: 'Advanced formation aligned to the functional responsibilities of bishops.',
    areas: ['Governance and Polity', 'Oversight and Pastoral Care at Scale', 'Apostolic Order, Protocol, and Consecratory Practice']
  },
  {
    title: 'Colloquia, Residencies, and Intensives',
    desc: 'Advanced formats for mature leaders including closed-door colloquia, case studies, and guided theological reflection.',
    areas: ['Closed-door Colloquia for Bishops', 'Case-Study Driven Discussions', 'Guided Theological Reflection', 'Supervised Residencies and Peer Learning']
  },
]

export default function AcademyPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('aes_courses').select('*').eq('is_published', true).order('sort_order')
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
                Academy of Episcopal Studies
              </h1>
              <p className="text-gray-200 font-body text-lg leading-relaxed max-w-xl">
                The senior-level educational and formational institution of KDCMF, established for the theological, pastoral, and administrative formation of bishops and episcopal leaders.
              </p>
              <p className="text-gold-400 font-body text-sm mt-4 italic">
                Operates under the direct authority of the Office of the Presiding Bishop and in accountability to the College of Bishops.
              </p>
            </div>
            <div className="flex-shrink-0">
              <img src={AES_LOGO} alt="Academy of Episcopal Studies"
                className="w-40 h-40 object-contain drop-shadow-xl"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Founding Pillar */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="card p-6 border-l-4 border-gold-500 bg-gold-50">
            <p className="text-sm font-body text-yellow-800 leading-relaxed">
              <strong>Founding Pillar:</strong> The Academy of Episcopal Studies was established upon the spiritual vision, episcopal leadership, and foundational work of <strong>Bishop Gerald West Phipps</strong>, whose pioneering commitment to apostolic order, episcopal integrity, and ministerial unity serves as the enduring cornerstone of the Academy. Bishop Phipps is hereby recognized in perpetuity as the Founding Pillar of the Academy of Episcopal Studies.
            </p>
          </div>
        </div>
      </section>

      {/* Purpose */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <div className="gold-bar w-12 mb-4" style={{ height: '3px' }} />
              <h2 className="section-title mb-4">Purpose and Identity</h2>
              <p className="text-gray-600 font-body leading-relaxed mb-4">
                AES exists to strengthen the episcopacy by providing structured instruction, guided reflection, and disciplined formation for those entrusted with apostolic oversight.
              </p>
              <p className="text-gray-600 font-body leading-relaxed mb-4">
                Its purpose is not to confer ecclesiastical rank, jurisdiction, or consecratory authority, but to prepare, refine, and support bishops in the faithful execution of their sacred responsibilities.
              </p>
              <p className="text-gray-600 font-body leading-relaxed">
                AES affirms that consecration is not the end of formation, but the beginning of deeper responsibility, requiring ongoing growth and refinement.
              </p>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-crimson-900 mb-4">Formation Philosophy</h3>
              <p className="text-gray-500 font-body text-sm mb-4">Education within AES is:</p>
              <ul className="space-y-2">
                {['Biblically anchored', 'Theologically rigorous', 'Ecclesiastically accountable', 'Practically responsive to real-world episcopal challenges', 'Spirit-led and prayerfully discerned'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm font-body text-gray-700">
                    <div className="w-1.5 h-1.5 bg-gold-500 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="section-title mb-3">Academic Structure</h2>
            <p className="section-subtitle">Three integrated layers supporting both bishops-elect and sitting bishops.</p>
          </div>
          <div className="space-y-5">
            {CURRICULUM_LAYERS.map((layer, i) => (
              <div key={layer.title} className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-crimson-gradient rounded-lg flex items-center justify-center text-white font-display font-bold text-sm flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold text-crimson-900 mb-1">{layer.title}</h3>
                    <p className="text-sm text-gray-500 font-body mb-3">{layer.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.areas.map(area => (
                        <span key={area} className="badge bg-crimson-50 text-crimson-700 text-xs">{area}</span>
                      ))}
                    </div>
                  </div>
                </div>
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
            <div className="grid sm:grid-cols-2 gap-5">
              {courses.map(course => (
                <div key={course.id} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {course.code && <div className="text-xs text-gray-400 font-body mb-1">{course.code}</div>}
                      <h3 className="font-display font-bold text-crimson-900">{course.title}</h3>
                    </div>
                    <span className={`badge text-xs capitalize ${course.price > 0 ? 'badge-crimson' : 'badge-green'}`}>
                      {course.price > 0 ? `$${course.price}` : 'Free'}
                    </span>
                  </div>
                  {course.description && <p className="text-sm text-gray-500 font-body mt-2 mb-3 leading-relaxed">{course.description}</p>}
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-body">
                    {course.duration_hours && <span className="flex items-center gap-1"><Clock size={11} /> {course.duration_hours}h</span>}
                    <span className="capitalize">{course.level}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Admission */}
      <section className="py-16 bg-crimson-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #c9a84c 0, #c9a84c 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <GraduationCap size={40} className="text-gold-400 mx-auto mb-4" />
          <h2 className="font-display text-3xl font-bold text-white mb-4">Admission Requirements</h2>
          <p className="text-gray-200 font-body mb-6">Participation in AES is limited to:</p>
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {['Sitting bishops in good standing', 'Bishops-elect with episcopal endorsement', 'Senior leaders formally invited or approved by the Presiding Bishop'].map(req => (
              <div key={req} className="bg-white/10 rounded-lg p-4 text-sm text-white font-body">{req}</div>
            ))}
          </div>
          <p className="text-gray-300 font-body text-sm mb-6">Admission is by endorsement, invitation, or formal approval, ensuring the integrity and seriousness of the Academy.</p>
          <Link to="/contact" className="btn-gold px-8 py-3">Contact the Office of the Presiding Bishop</Link>
        </div>
      </section>
    </PublicLayout>
  )
}
