import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMemberAuth } from '../../lib/auth'
import { KDCMF_SEAL } from '../../lib/logos'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, GraduationCap, BookOpen } from 'lucide-react'

export default function MemberCourses() {
  const { profile, logout } = useMemberAuth()
  const [aes, setAes] = useState<any[]>([])
  const [kdi, setKdi] = useState<any[]>([])
  const [aesCourses, setAesCourses] = useState<any[]>([])
  const [kdiCourses, setKdiCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: aesEnroll }, { data: kdiEnroll }, { data: aesCat }, { data: kdiCat }] = await Promise.all([
      supabase.from('aes_enrollments').select('*, course:aes_courses(*)').eq('profile_id', profile?.id),
      supabase.from('kdi_enrollments').select('*, course:kdi_courses(*)').eq('profile_id', profile?.id),
      supabase.from('aes_courses').select('*').eq('is_published', true).order('sort_order'),
      supabase.from('kdi_courses').select('*').eq('is_published', true).order('sort_order'),
    ])
    setAes(aesEnroll || [])
    setKdi(kdiEnroll || [])
    setAesCourses((aesCat || []).filter((c: any) => !(aesEnroll || []).find((e: any) => e.course_id === c.id)))
    setKdiCourses((kdiCat || []).filter((c: any) => !(kdiEnroll || []).find((e: any) => e.course_id === c.id)))
    setLoading(false)
  }

  const enroll = async (courseId: string, type: 'aes' | 'kdi') => {
    const table = type === 'aes' ? 'aes_enrollments' : 'kdi_enrollments'
    await supabase.from(table).insert({ course_id: courseId, profile_id: profile?.id, status: 'active', payment_status: 'pending' })
    loadData()
  }

  const levelColor = (level: string) => {
    const map: Record<string, string> = {
      introductory: 'bg-green-100 text-green-700', beginner: 'bg-green-100 text-green-700',
      intermediate: 'bg-blue-100 text-blue-700', advanced: 'bg-purple-100 text-purple-700',
      certification: 'bg-gold-100 text-yellow-700',
    }
    return map[level] || 'badge-gray'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-crimson-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={KDCMF_SEAL} alt="KDCMF" className="w-8 h-8 rounded-full object-cover border border-gold-400/40" />
          <span className="font-display font-bold text-sm">KDCMF Member Portal</span>
        </div>
        <button onClick={logout} className="text-xs text-gray-400 hover:text-white font-body">Sign Out</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link to="/portal" className="flex items-center gap-1.5 text-sm text-crimson-600 font-body font-medium mb-6 hover:underline">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <h1 className="font-display text-2xl font-bold text-crimson-900 mb-8">My Courses</h1>

        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-8">
            {/* AES Enrolled */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap size={20} className="text-crimson-600" />
                <h2 className="font-display text-lg font-bold text-crimson-900">Academy of Episcopal Studies</h2>
              </div>
              {aes.length === 0 ? (
                <div className="card p-6 text-center text-gray-400 font-body text-sm">
                  No AES courses enrolled. Browse available courses below.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {aes.map(e => (
                    <div key={e.id} className="card p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display font-semibold text-gray-900 text-sm leading-tight">{e.course?.title}</h3>
                        <span className={`badge capitalize ml-2 flex-shrink-0 ${levelColor(e.course?.level)}`}>{e.course?.level}</span>
                      </div>
                      {e.course?.code && <div className="text-xs text-gray-400 font-body mb-2">{e.course.code}</div>}
                      <div className="flex items-center justify-between mt-3">
                        <span className={`badge capitalize ${e.status === 'completed' ? 'badge-green' : 'badge-gold'}`}>{e.status}</span>
                        <span className="text-xs text-gray-400 font-body">{e.course?.duration_hours}h course</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Available AES */}
              {aesCourses.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-600 font-body mb-3">Available Courses</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {aesCourses.map(c => (
                      <div key={c.id} className="card p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 font-body">{c.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`badge capitalize ${levelColor(c.level)}`}>{c.level}</span>
                            <span className="text-xs text-gray-400">{c.price > 0 ? `$${c.price}` : 'Free'}</span>
                          </div>
                        </div>
                        <button onClick={() => enroll(c.id, 'aes')}
                          className="btn-outline text-xs py-1.5 px-3 flex-shrink-0 ml-3">
                          Enroll
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* KDI Enrolled */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={20} className="text-crimson-600" />
                <h2 className="font-display text-lg font-bold text-crimson-900">Kingdom Dominion Institute</h2>
              </div>
              {kdi.length === 0 ? (
                <div className="card p-6 text-center text-gray-400 font-body text-sm">
                  No KDI courses enrolled. Browse available courses below.
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {kdi.map(e => (
                    <div key={e.id} className="card p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-display font-semibold text-gray-900 text-sm leading-tight">{e.course?.title}</h3>
                        <span className={`badge capitalize ml-2 flex-shrink-0 ${levelColor(e.course?.level)}`}>{e.course?.level}</span>
                      </div>
                      {e.course?.code && <div className="text-xs text-gray-400 font-body mb-2">{e.course.code}</div>}
                      <div className="flex items-center justify-between mt-3">
                        <span className={`badge capitalize ${e.status === 'completed' ? 'badge-green' : 'badge-gold'}`}>{e.status}</span>
                        <span className="text-xs text-gray-400 font-body">{e.course?.duration_hours}h course</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {kdiCourses.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-600 font-body mb-3">Available Courses</h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {kdiCourses.map(c => (
                      <div key={c.id} className="card p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900 font-body">{c.title}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`badge capitalize ${levelColor(c.level)}`}>{c.level}</span>
                            <span className="text-xs text-gray-400">{c.price > 0 ? `$${c.price}` : 'Free'}</span>
                          </div>
                        </div>
                        <button onClick={() => enroll(c.id, 'kdi')}
                          className="btn-outline text-xs py-1.5 px-3 flex-shrink-0 ml-3">
                          Enroll
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
