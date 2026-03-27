import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit } from 'lucide-react'

const defaultForm = {
  name: '', type: 'church', status: 'active', senior_pastor: '', pastor_title: 'Pastor',
  email: '', phone: '', website: '', address: '', city: '', state: '', country: 'USA', description: ''
}

export default function AdminMinistries() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('ministries').select('*').order('name')
    setItems(data || [])
    setLoading(false)
  }

  const filtered = items.filter(i =>
    search === '' || `${i.name} ${i.senior_pastor || ''} ${i.city || ''} ${i.state || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => { setEditing(null); setForm(defaultForm); setError(''); setShowModal(true) }
  const openEdit = (i: any) => {
    setEditing(i)
    setForm({ name: i.name, type: i.type, status: i.status, senior_pastor: i.senior_pastor || '',
      pastor_title: i.pastor_title || 'Pastor', email: i.email || '', phone: i.phone || '',
      website: i.website || '', address: i.address || '', city: i.city || '', state: i.state || '',
      country: i.country || 'USA', description: i.description || '' })
    setError(''); setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true); setError('')
    if (!form.name) { setError('Ministry name is required.'); setSaving(false); return }
    if (editing) {
      const { error: err } = await supabase.from('ministries').update(form).eq('id', editing.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('ministries').insert(form)
      if (err) { setError(err.message); setSaving(false); return }
    }
    setSaving(false); setShowModal(false); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this ministry?')) return
    await supabase.from('ministries').delete().eq('id', id)
    load()
  }

  const f = (k: string, v: string) => setForm({ ...form, [k]: v })

  return (
    <AdminLayout title="Ministry Directory" subtitle="Member churches, ministries, and affiliates">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search ministries..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}><Plus size={16} /> Add Ministry</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr>
              <th className="table-header">Ministry Name</th>
              <th className="table-header">Type</th>
              <th className="table-header">Senior Leader</th>
              <th className="table-header">Location</th>
              <th className="table-header">Status</th>
              <th className="table-header">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={6} className="table-cell text-center py-10"><div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              : filtered.length === 0 ? <tr><td colSpan={6} className="table-cell text-center py-10 text-gray-400">No ministries found</td></tr>
              : filtered.map(i => (
                <tr key={i.id} className="table-row">
                  <td className="table-cell font-medium">{i.name}</td>
                  <td className="table-cell"><span className="badge-crimson capitalize">{i.type.replace('_', ' ')}</span></td>
                  <td className="table-cell text-gray-500">{i.pastor_title} {i.senior_pastor || '—'}</td>
                  <td className="table-cell text-gray-500">{[i.city, i.state].filter(Boolean).join(', ') || '—'}</td>
                  <td className="table-cell"><span className={`badge capitalize ${i.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{i.status}</span></td>
                  <td className="table-cell"><div className="flex gap-2">
                    <button onClick={() => openEdit(i)} className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(i.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">{editing ? 'Edit Ministry' : 'Add Ministry'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="label">Ministry / Church Name *</label><input className="input" value={form.name} onChange={e => f('name', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Type</label>
                  <select className="input" value={form.type} onChange={e => f('type', e.target.value)}>
                    <option value="church">Local Church</option>
                    <option value="ministry">Ministry</option>
                    <option value="para_church">Para-Church</option>
                    <option value="affiliate">Affiliate</option>
                  </select>
                </div>
                <div><label className="label">Status</label>
                  <select className="input" value={form.status} onChange={e => f('status', e.target.value)}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Leader Title</label><input className="input" value={form.pastor_title} onChange={e => f('pastor_title', e.target.value)} placeholder="Pastor, Bishop, Rev." /></div>
                <div><label className="label">Senior Leader Name</label><input className="input" value={form.senior_pastor} onChange={e => f('senior_pastor', e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => f('email', e.target.value)} /></div>
                <div><label className="label">Phone</label><input className="input" value={form.phone} onChange={e => f('phone', e.target.value)} /></div>
              </div>
              <div><label className="label">Website</label><input className="input" value={form.website} onChange={e => f('website', e.target.value)} placeholder="https://" /></div>
              <div><label className="label">Address</label><input className="input" value={form.address} onChange={e => f('address', e.target.value)} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div><label className="label">City</label><input className="input" value={form.city} onChange={e => f('city', e.target.value)} /></div>
                <div><label className="label">State</label><input className="input" value={form.state} onChange={e => f('state', e.target.value)} /></div>
                <div><label className="label">Country</label><input className="input" value={form.country} onChange={e => f('country', e.target.value)} /></div>
              </div>
              <div><label className="label">Description</label><textarea className="input" rows={3} value={form.description} onChange={e => f('description', e.target.value)} /></div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
                {editing ? 'Save Changes' : 'Add Ministry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
