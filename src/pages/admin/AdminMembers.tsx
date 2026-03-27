import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit } from 'lucide-react'

interface Member {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: string
  membership_status: string
  ordination_status?: string
  title?: string
  church_name?: string
  church_city?: string
  church_state?: string
  created_at: string
}

const defaultForm = {
  email: '', first_name: '', last_name: '', phone: '', role: 'member',
  membership_status: 'pending', ordination_status: 'none', title: '',
  church_name: '', church_city: '', church_state: ''
}

export default function AdminMembers() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Member | null>(null)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { loadMembers() }, [])

  const loadMembers = async () => {
    setLoading(true)
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    setMembers(data || [])
    setLoading(false)
  }

  const filtered = members.filter(m => {
    const matchSearch = search === '' ||
      `${m.first_name} ${m.last_name} ${m.email} ${m.church_name || ''}`.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || m.membership_status === filter || m.role === filter
    return matchSearch && matchFilter
  })

  const openCreate = () => { setEditing(null); setForm(defaultForm); setError(''); setShowModal(true) }
  const openEdit = (m: Member) => {
    setEditing(m)
    setForm({ email: m.email, first_name: m.first_name, last_name: m.last_name, phone: m.phone || '',
      role: m.role, membership_status: m.membership_status, ordination_status: m.ordination_status || 'none',
      title: m.title || '', church_name: m.church_name || '', church_city: m.church_city || '', church_state: m.church_state || '' })
    setError(''); setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    if (!form.first_name || !form.last_name || !form.email) {
      setError('Name and email are required.'); setSaving(false); return
    }
    if (editing) {
      const { error: err } = await supabase.from('profiles').update(form).eq('id', editing.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('profiles').insert(form)
      if (err) { setError(err.message); setSaving(false); return }
    }
    setSaving(false); setShowModal(false); loadMembers()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this member? This cannot be undone.')) return
    await supabase.from('profiles').delete().eq('id', id)
    loadMembers()
  }

  return (
    <AdminLayout title="Members" subtitle="Manage clergy, member churches, and affiliate ministries">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search by name, email, or church..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Members</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="expired">Expired</option>
          <option value="clergy">Clergy</option>
          <option value="bishop">Bishops</option>
        </select>
        <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={openCreate}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Email</th>
                <th className="table-header">Church</th>
                <th className="table-header">Role</th>
                <th className="table-header">Status</th>
                <th className="table-header">Joined</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="table-cell text-center py-10">
                  <div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="table-cell text-center py-10 text-gray-400">No members found</td></tr>
              ) : filtered.map(m => (
                <tr key={m.id} className="table-row">
                  <td className="table-cell font-medium">
                    {m.title && <span className="text-xs text-crimson-700 font-body">{m.title} </span>}
                    {m.first_name} {m.last_name}
                  </td>
                  <td className="table-cell text-gray-500">{m.email}</td>
                  <td className="table-cell text-gray-500">{m.church_name || '—'}</td>
                  <td className="table-cell"><span className="badge-crimson capitalize">{m.role}</span></td>
                  <td className="table-cell">
                    <span className={`badge capitalize ${
                      m.membership_status === 'active' ? 'badge-green' :
                      m.membership_status === 'pending' ? 'badge-gold' : 'badge-gray'
                    }`}>{m.membership_status}</span>
                  </td>
                  <td className="table-cell text-gray-400 text-xs">{new Date(m.created_at).toLocaleDateString()}</td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(m)} className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded transition-colors"><Edit size={14} /></button>
                      <button onClick={() => handleDelete(m.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 font-body">
          Showing {filtered.length} of {members.length} members
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">{editing ? 'Edit Member' : 'Add Member'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">First Name *</label><input className="input" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} /></div>
                <div><label className="label">Last Name *</label><input className="input" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} /></div>
              </div>
              <div><label className="label">Email Address *</label><input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><label className="label">Title (e.g. Bishop, Pastor)</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Role</label>
                  <select className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="member">Member</option>
                    <option value="clergy">Clergy</option>
                    <option value="bishop">Bishop</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="label">Membership Status</label>
                  <select className="input" value={form.membership_status} onChange={e => setForm({ ...form, membership_status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Ordination Status</label>
                <select className="input" value={form.ordination_status} onChange={e => setForm({ ...form, ordination_status: e.target.value })}>
                  <option value="none">None</option>
                  <option value="licensed">Licensed</option>
                  <option value="ordained">Ordained</option>
                  <option value="bishop">Bishop</option>
                </select>
              </div>
              <div><label className="label">Church / Ministry Name</label><input className="input" value={form.church_name} onChange={e => setForm({ ...form, church_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">City</label><input className="input" value={form.church_city} onChange={e => setForm({ ...form, church_city: e.target.value })} /></div>
                <div><label className="label">State</label><input className="input" value={form.church_state} onChange={e => setForm({ ...form, church_state: e.target.value })} /></div>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
                {editing ? 'Save Changes' : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
