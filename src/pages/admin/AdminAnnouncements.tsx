import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit, Megaphone, Eye, EyeOff } from 'lucide-react'

const AUDIENCES = [
  { value: 'all', label: 'All Members' },
  { value: 'members', label: 'Members Only' },
  { value: 'clergy', label: 'Clergy Only' },
  { value: 'leadership', label: 'Leadership Only' },
  { value: 'auxiliary', label: 'Specific Auxiliary' },
]

const defaultForm = { title: '', body: '', audience: 'all', is_pinned: false, is_published: false, expires_at: '' }

export default function AdminAnnouncements() {
  const [items, setItems] = useState<any[]>([])
  const [auxiliaries, setAuxiliaries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => {
    setLoading(true)
    const [{ data: anns }, { data: auxs }] = await Promise.all([
      supabase.from('announcements').select('*').order('created_at', { ascending: false }),
      supabase.from('auxiliaries').select('id, name').eq('is_active', true)
    ])
    setItems(anns || [])
    setAuxiliaries(auxs || [])
    setLoading(false)
  }

  const filtered = items.filter(i => search === '' || i.title.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => { setEditing(null); setForm(defaultForm); setError(''); setShowModal(true) }
  const openEdit = (i: any) => { setEditing(i); setForm({ title: i.title, body: i.body, audience: i.audience, is_pinned: i.is_pinned, is_published: i.is_published, expires_at: i.expires_at ? i.expires_at.slice(0,10) : '', auxiliary_id: i.auxiliary_id || '' }); setError(''); setShowModal(true) }
  const handleSave = async () => {
    setSaving(true); setError('')
    if (!form.title || !form.body) { setError('Title and body are required.'); setSaving(false); return }
    const payload = { ...form, expires_at: form.expires_at || null, published_at: form.is_published ? new Date().toISOString() : null }
    if (editing) { await supabase.from('announcements').update(payload).eq('id', editing.id) }
    else { await supabase.from('announcements').insert(payload) }
    setSaving(false); setShowModal(false); load()
  }
  const handleDelete = async (id: string) => { if (!confirm('Delete?')) return; await supabase.from('announcements').delete().eq('id', id); load() }
  const togglePublish = async (i: any) => { await supabase.from('announcements').update({ is_published: !i.is_published, published_at: !i.is_published ? new Date().toISOString() : null }).eq('id', i.id); load() }
  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  return (
    <AdminLayout title="Announcements" subtitle="Fellowship-wide and targeted announcements">
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input className="input pl-9" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}><Plus size={16} /> Add Announcement</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? <div className="p-10 text-center"><div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" /></div>
        : filtered.length === 0 ? <div className="p-12 text-center"><Megaphone size={32} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-400 font-body">No announcements yet.</p></div>
        : (
          <div className="divide-y divide-gray-100">
            {filtered.map(i => (
              <div key={i.id} className="flex items-start gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {i.is_pinned && <span className="text-xs text-gold-600 font-semibold">📌 Pinned</span>}
                    <span className="font-display font-semibold text-crimson-900 text-sm">{i.title}</span>
                  </div>
                  <p className="text-xs text-gray-500 font-body line-clamp-2">{i.body}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="badge-crimson text-xs capitalize">{AUDIENCES.find(a => a.value === i.audience)?.label || i.audience}</span>
                    <span className="text-xs text-gray-400 font-body">{new Date(i.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePublish(i)} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${i.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {i.is_published ? <><Eye size={11} /> Live</> : <><EyeOff size={11} /> Draft</>}
                  </button>
                  <button onClick={() => openEdit(i)} className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded"><Edit size={14} /></button>
                  <button onClick={() => handleDelete(i.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b"><h2 className="font-display text-lg font-semibold text-crimson-900">{editing ? 'Edit' : 'Add'} Announcement</h2><button onClick={() => setShowModal(false)} className="text-gray-400"><X size={20} /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => f('title', e.target.value)} /></div>
              <div><label className="label">Body *</label><textarea className="input" rows={5} value={form.body} onChange={e => f('body', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Audience</label>
                  <select className="input" value={form.audience} onChange={e => f('audience', e.target.value)}>
                    {AUDIENCES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
                <div><label className="label">Expires</label><input type="date" className="input" value={form.expires_at} onChange={e => f('expires_at', e.target.value)} /></div>
              </div>
              {form.audience === 'auxiliary' && (
                <div><label className="label">Select Auxiliary</label>
                  <select className="input" value={form.auxiliary_id||''} onChange={e => f('auxiliary_id', e.target.value)}>
                    <option value="">-- Select --</option>
                    {auxiliaries.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </div>
              )}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_pinned} onChange={e => f('is_pinned', e.target.checked)} className="accent-crimson-700" /><span className="text-sm font-body">Pin to top</span></label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_published} onChange={e => f('is_published', e.target.checked)} className="accent-crimson-700" /><span className="text-sm font-body">Published</span></label>
              </div>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowModal(false)} className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>{saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}{editing ? 'Save' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
