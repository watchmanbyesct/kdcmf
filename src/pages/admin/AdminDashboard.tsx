import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Users, Building2, Calendar, GraduationCap, BookOpen, Heart, FileText, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAdminAuth } from '../../lib/auth'

interface Stats {
  members: number
  ministries: number
  events: number
  aes_enrollments: number
  kdi_enrollments: number
  donations_total: number
  pending_members: number
  documents: number
}

export default function AdminDashboard() {
  const { profile } = useAdminAuth()
  const [stats, setStats] = useState<Stats>({
    members: 0, ministries: 0, events: 0,
    aes_enrollments: 0, kdi_enrollments: 0,
    donations_total: 0, pending_members: 0, documents: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentMembers, setRecentMembers] = useState<any[]>([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [
        { count: members },
        { count: ministries },
        { count: events },
        { count: aes_enrollments },
        { count: kdi_enrollments },
        { count: pending_members },
        { count: documents },
        { data: donations },
        { data: recent }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ministries').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('aes_enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('kdi_enrollments').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('membership_status', 'pending'),
        supabase.from('documents').select('*', { count: 'exact', head: true }),
        supabase.from('donations').select('amount').eq('status', 'completed'),
        supabase.from('profiles').select('id, first_name, last_name, email, role, membership_status, church_name, created_at').order('created_at', { ascending: false }).limit(5)
      ])

      const total = donations?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0

      setStats({
        members: members || 0, ministries: ministries || 0, events: events || 0,
        aes_enrollments: aes_enrollments || 0, kdi_enrollments: kdi_enrollments || 0,
        donations_total: total, pending_members: pending_members || 0, documents: documents || 0
      })
      setRecentMembers(recent || [])
    } catch (err) {
      console.error('Dashboard stats error:', err)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { label: 'Total Members', value: stats.members, icon: <Users size={20} />, href: '/admin/members', color: 'text-crimson-700' },
    { label: 'Member Ministries', value: stats.ministries, icon: <Building2 size={20} />, href: '/admin/ministries', color: 'text-blue-600' },
    { label: 'Events', value: stats.events, icon: <Calendar size={20} />, href: '/admin/events', color: 'text-emerald-600' },
    { label: 'AES Enrollments', value: stats.aes_enrollments, icon: <GraduationCap size={20} />, href: '/admin/aes-courses', color: 'text-purple-600' },
    { label: 'KDI Enrollments', value: stats.kdi_enrollments, icon: <BookOpen size={20} />, href: '/admin/kdi-courses', color: 'text-indigo-600' },
    { label: 'Giving Total', value: `$${stats.donations_total.toLocaleString()}`, icon: <Heart size={20} />, href: '/admin/giving', color: 'text-rose-600' },
    { label: 'Pending Members', value: stats.pending_members, icon: <TrendingUp size={20} />, href: '/admin/members', color: 'text-amber-600' },
    { label: 'Documents', value: stats.documents, icon: <FileText size={20} />, href: '/admin/documents', color: 'text-teal-600' },
  ]

  return (
    <AdminLayout title="Command Center" subtitle={`Welcome back, ${profile?.first_name}. Here is today's overview.`}>
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statCards.map(card => (
              <Link key={card.label} to={card.href}
                className="card p-4 hover:shadow-md transition-shadow group"
              >
                <div className={`${card.color} mb-3 group-hover:scale-110 transition-transform inline-block`}>
                  {card.icon}
                </div>
                <div className="font-display text-2xl font-bold text-gray-900">{card.value}</div>
                <div className="text-xs text-gray-500 font-body mt-0.5">{card.label}</div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card p-5">
            <h2 className="font-display text-lg font-semibold text-crimson-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Add Member', href: '/admin/members', color: 'btn-primary' },
                { label: 'Add Ministry', href: '/admin/ministries', color: 'btn-outline' },
                { label: 'Create Event', href: '/admin/events', color: 'btn-outline' },
                { label: 'Upload Document', href: '/admin/documents', color: 'btn-outline' },
              ].map(action => (
                <Link key={action.label} to={action.href} className={`${action.color} text-sm text-center py-2`}>
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Members */}
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">Recent Members</h2>
              <Link to="/admin/members" className="text-sm text-crimson-700 hover:text-crimson-900 font-body font-medium">View all →</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Church</th>
                    <th className="table-header">Role</th>
                    <th className="table-header">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMembers.length === 0 ? (
                    <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-8">No members yet</td></tr>
                  ) : recentMembers.map(member => (
                    <tr key={member.id} className="table-row">
                      <td className="table-cell font-medium">{member.first_name} {member.last_name}</td>
                      <td className="table-cell text-gray-500">{member.email}</td>
                      <td className="table-cell text-gray-500">{member.church_name || '—'}</td>
                      <td className="table-cell">
                        <span className="badge-crimson capitalize">{member.role}</span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge capitalize ${
                          member.membership_status === 'active' ? 'badge-green' :
                          member.membership_status === 'pending' ? 'badge-gold' : 'badge-gray'
                        }`}>{member.membership_status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
