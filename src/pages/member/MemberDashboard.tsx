import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMemberAuth } from '../../lib/auth'
import { KDCMF_SEAL } from '../../lib/logos'
import { supabase } from '../../lib/supabase'
import { BookOpen, Calendar, FileText, User, LogOut, GraduationCap, Bell } from 'lucide-react'

export default function MemberDashboard() {
  const { profile, logout } = useMemberAuth()
  const [events, setEvents] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [aesEnrollments, setAesEnrollments] = useState<any[]>([])
  const [kdiEnrollments, setKdiEnrollments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: evts }, { data: anns }, { data: aes }, { data: kdi }] = await Promise.all([
      supabase.from('events').select('*').eq('is_published', true).gte('end_date', new Date().toISOString()).order('start_date').limit(3),
      supabase.from('announcements').select('*').eq('is_published', true).order('created_at', { ascending: false }).limit(5),
      supabase.from('aes_enrollments').select('*, course:aes_courses(title, level)').eq('profile_id', profile?.id).limit(5),
      supabase.from('kdi_enrollments').select('*, course:kdi_courses(title, level)').eq('profile_id', profile?.id).limit(5),
    ])
    setEvents(evts || [])
    setAnnouncements(anns || [])
    setAesEnrollments(aes || [])
    setKdiEnrollments(kdi || [])
    setLoading(false)
  }

  const navItems = [
    { label: 'My Courses', href: '/portal/courses', icon: <BookOpen size={20} />, desc: 'AES & KDI enrollments' },
    { label: 'Events', href: '/portal/events', icon: <Calendar size={20} />, desc: 'Register for events' },
    { label: 'Documents', href: '/portal/documents', icon: <FileText size={20} />, desc: 'Fellowship resources' },
    { label: 'My Profile', href: '/portal/profile', icon: <User size={20} />, desc: 'Update your information' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-crimson-900 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0 border border-gold-400/40">
                <img src={KDCMF_SEAL} alt="KDCMF" className="w-full h-full object-cover" />
              </div>
            <div>
              <div className="font-display font-bold text-white text-sm leading-tight">KDCMF Member Portal</div>
              <div className="text-gold-400 text-xs font-body">Kingdom Dominion Covenant Ministries Fellowship</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300 font-body hidden sm:block">
              {profile?.title && `${profile.title} `}{profile?.first_name} {profile?.last_name}
            </span>
            <button onClick={logout}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-body">
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-crimson-900">
            Welcome, {profile?.title && `${profile.title} `}{profile?.first_name}
          </h1>
          <p className="text-gray-500 font-body mt-1">
            {profile?.church_name ? `${profile.church_name} — ` : ''}
            <span className={`badge capitalize ml-1 ${
              profile?.membership_status === 'active' ? 'badge-green' :
              profile?.membership_status === 'pending' ? 'badge-gold' : 'badge-gray'
            }`}>{profile?.membership_status}</span>
          </p>
        </div>

        {/* Nav Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {navItems.map(item => (
            <Link key={item.href} to={item.href}
              className="card p-5 hover:shadow-md transition-shadow group"
            >
              <div className="w-10 h-10 bg-crimson-50 text-crimson-700 rounded-lg flex items-center justify-center mb-3 group-hover:bg-crimson-100 transition-colors">
                {item.icon}
              </div>
              <div className="font-display font-semibold text-gray-900 text-sm">{item.label}</div>
              <div className="text-xs text-gray-400 font-body mt-0.5">{item.desc}</div>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* My Enrollments */}
          <div className="md:col-span-2 space-y-4">
            {/* AES */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-crimson-600" />
                  <h2 className="font-display font-semibold text-crimson-900">Academy of Episcopal Studies</h2>
                </div>
                <Link to="/portal/courses" className="text-xs text-crimson-600 font-body font-medium hover:underline">View all →</Link>
              </div>
              {loading ? (
                <div className="p-6 text-center"><div className="w-5 h-5 border-2 border-crimson-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
              ) : aesEnrollments.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-400 text-sm font-body mb-3">No AES courses enrolled yet.</p>
                  <Link to="/academy-of-episcopal-studies" className="text-sm text-crimson-600 font-body font-medium hover:underline">Browse courses →</Link>
                </div>
              ) : aesEnrollments.map(e => (
                <div key={e.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900 font-body">{e.course?.title}</div>
                    <div className="text-xs text-gray-400 font-body capitalize">{e.course?.level} · {e.status}</div>
                  </div>
                  <span className={`badge capitalize ${e.status === 'completed' ? 'badge-green' : 'badge-gold'}`}>{e.status}</span>
                </div>
              ))}
            </div>

            {/* KDI */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-crimson-600" />
                  <h2 className="font-display font-semibold text-crimson-900">Kingdom Dominion Institute</h2>
                </div>
                <Link to="/portal/courses" className="text-xs text-crimson-600 font-body font-medium hover:underline">View all →</Link>
              </div>
              {loading ? (
                <div className="p-6 text-center"><div className="w-5 h-5 border-2 border-crimson-600 border-t-transparent rounded-full animate-spin mx-auto" /></div>
              ) : kdiEnrollments.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-400 text-sm font-body mb-3">No KDI courses enrolled yet.</p>
                  <Link to="/kingdom-dominion-institute" className="text-sm text-crimson-600 font-body font-medium hover:underline">Browse courses →</Link>
                </div>
              ) : kdiEnrollments.map(e => (
                <div key={e.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900 font-body">{e.course?.title}</div>
                    <div className="text-xs text-gray-400 font-body capitalize">{e.course?.level} · {e.status}</div>
                  </div>
                  <span className={`badge capitalize ${e.status === 'completed' ? 'badge-green' : 'badge-gold'}`}>{e.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            {/* Upcoming Events */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-crimson-600" />
                  <h2 className="font-display font-semibold text-crimson-900 text-sm">Upcoming Events</h2>
                </div>
                <Link to="/portal/events" className="text-xs text-crimson-600 font-body font-medium hover:underline">All →</Link>
              </div>
              {events.length === 0 ? (
                <div className="p-5 text-center text-gray-400 text-sm font-body">No upcoming events.</div>
              ) : events.map(evt => (
                <div key={evt.id} className="px-5 py-3 border-b border-gray-50 last:border-0">
                  <div className="text-sm font-medium text-gray-900 font-body leading-tight">{evt.title}</div>
                  <div className="text-xs text-gray-400 font-body mt-0.5">
                    {new Date(evt.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {evt.location_city && (
                    <div className="text-xs text-gray-400 font-body">{evt.location_city}, {evt.location_state}</div>
                  )}
                </div>
              ))}
            </div>

            {/* Announcements */}
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-gray-100">
                <Bell size={18} className="text-crimson-600" />
                <h2 className="font-display font-semibold text-crimson-900 text-sm">Announcements</h2>
              </div>
              {announcements.length === 0 ? (
                <div className="p-5 text-center text-gray-400 text-sm font-body">No announcements.</div>
              ) : announcements.map(ann => (
                <div key={ann.id} className="px-5 py-3 border-b border-gray-50 last:border-0">
                  <div className="text-sm font-medium text-gray-900 font-body leading-tight">{ann.title}</div>
                  <div className="text-xs text-gray-400 font-body mt-0.5 line-clamp-2">{ann.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
