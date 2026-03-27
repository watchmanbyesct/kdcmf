import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit, Star } from 'lucide-react'

const CATEGORIES = [
  { value: 'presiding', label: 'Presiding' },
  { value: 'executive', label: 'Executive' },
  { value: 'national', label: 'National' },
  { value: 'regional', label: 'Regional' },
  { value: 'auxiliary', label: 'Auxiliary' },
  { value: 'honorary', label: 'Honorary' },
]

const defaultForm = {
  name: '', title: '', office: '', category: 'presiding',
  bio: '', church_name: '', church_city: '', church_state: '',
  email: '', phone: '', sort_order: 0, is_active: true
}

export default function AdminLeadership() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('leadership')
      .select('*')
      .order('category')
      .order('sort_order')
    setItems(data || [])
    setLoading(false)
  }

  const filtered = items.filter(i => {
    const matchSearch = search === '' ||
      `${i.name} ${i.title} ${i.office || ''} ${i.church_name || ''}`.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCategory === 'all' || i.category === filterCategory
    return matchSearch && matchCat
  })

  // Group by category
  const grouped = CATEGORIES.reduce((acc, cat) => {
    const members = filtered.filter(i => i.category === cat.value)
    if (members.length > 0) acc[cat.value] = { label: cat.label, members }
    return acc
  }, {} as Record<string, { label: string; members: any[] }>)

  const openCreate = () => {
    setEditing(null)
    setForm(defaultForm)
    setError('')
    setShowModal(true)
  }

  const openEdit = (i: any) => {
    setEditing(i)
    setForm({
      name: i.name, title: i.title, office: i.office || '',
      category: i.category, bio: i.bio || '',
      church_name: i.church_name || '', church_city: i.church_city || '',
      church_state: i.church_state || '', email: i.email || '',
      phone: i.phone || '', sort_order: i.sort_order || 0,
      is_active: i.is_active
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    if (!form.name || !form.title) {
      setError('Name and title are required.')
      setSaving(false)
      return
    }
    if (editing) {
      const { error: err } = await supabase.from('leadership').update(form).eq('id', editing.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('leadership').insert(form)
      if (err) { setError(err.message); setSaving(false); return }
    }
    setSaving(false)
    setShowModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this leader from the directory?')) return
    await supabase.from('leadership').delete().eq('id', id)
    load()
  }

  const f = (k: string, v: any) => setForm({ ...form, [k]: v })

  const categoryColor = (cat: string) => {
    const map: Record<string, string> = {
      presiding: 'bg-crimson-100 text-crimson-800',
      executive: 'bg-gold-100 text-yellow-800',
      national: 'bg-blue-100 text-blue-800',
      regional: 'bg-purple-100 text-purple-800',
      auxiliary: 'bg-green-100 text-green-800',
      honorary: 'bg-gray-100 text-gray-700',
    }
    return map[cat] || 'badge-gray'
  }

  return (
    <AdminLayout title="Leadership Directory" subtitle="Bishops, officers, and national leadership">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search by name, title, or church..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={openCreate}>
          <Plus size={16} /> Add Leader
        </button>
      </div>

      {/* Leadership grouped by category */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Star size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-body">No leaders found. Add your first leader to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([cat, group]) => (
            <div key={cat} className="card overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
                <span className={`badge capitalize ${categoryColor(cat)}`}>{group.label}</span>
                <span className="text-xs text-gray-400 font-body">{group.members.length} {group.members.length === 1 ? 'member' : 'members'}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="table-header">Name</th>
                      <th className="table-header">Title / Office</th>
                      <th className="table-header">Church</th>
                      <th className="table-header">Location</th>
                      <th className="table-header">Contact</th>
                      <th className="table-header">Status</th>
                      <th className="table-header">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.members.map(i => (
                      <tr key={i.id} className="table-row">
                        <td className="table-cell font-medium">{i.name}</td>
                        <td className="table-cell">
                          <div className="text-sm font-body text-gray-900">{i.title}</div>
                          {i.office && <div className="text-xs text-gray-400 font-body">{i.office}</div>}
                        </td>
                        <td className="table-cell text-gray-500">{i.church_name || '—'}</td>
                        <td className="table-cell text-gray-500">
                          {[i.church_city, i.church_state].filter(Boolean).join(', ') || '—'}
                        </td>
                        <td className="table-cell text-gray-500 text-xs">{i.email || '—'}</td>
                        <td className="table-cell">
                          <span className={`badge ${i.is_active ? 'badge-green' : 'badge-gray'}`}>
                            {i.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex gap-2">
                            <button onClick={() => openEdit(i)}
                              className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded transition-colors">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleDelete(i.id)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">
                {editing ? 'Edit Leader' : 'Add Leader'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input" value={form.name} onChange={e => f('name', e.target.value)}
                    placeholder="Bishop John Smith" />
                </div>
                <div>
                  <label className="label">Title *</label>
                  <input className="input" value={form.title} onChange={e => f('title', e.target.value)}
                    placeholder="Bishop, Presiding Bishop, Pastor..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Office / Position</label>
                  <input className="input" value={form.office} onChange={e => f('office', e.target.value)}
                    placeholder="1st Assistant Presiding Bishop..." />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={form.category} onChange={e => f('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Bio</label>
                <textarea className="input" rows={3} value={form.bio}
                  onChange={e => f('bio', e.target.value)}
                  placeholder="Brief biography..." />
              </div>
              <div>
                <label className="label">Church / Ministry Name</label>
                <input className="input" value={form.church_name} onChange={e => f('church_name', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City</label>
                  <input className="input" value={form.church_city} onChange={e => f('church_city', e.target.value)} />
                </div>
                <div>
                  <label className="label">State</label>
                  <input className="input" value={form.church_state} onChange={e => f('church_state', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input" value={form.email} onChange={e => f('email', e.target.value)} />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Sort Order</label>
                  <input type="number" className="input" value={form.sort_order}
                    onChange={e => f('sort_order', parseInt(e.target.value) || 0)} />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="is_active" checked={form.is_active}
                    onChange={e => f('is_active', e.target.checked)}
                    className="w-4 h-4 accent-crimson-700" />
                  <label htmlFor="is_active" className="text-sm font-body text-gray-700">Active (visible on site)</label>
                </div>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)}
                className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>
                {saving
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Save size={15} />}
                {editing ? 'Save Changes' : 'Add Leader'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
