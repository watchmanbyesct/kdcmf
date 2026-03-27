import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit, FileText, Lock, Globe, Users, Shield } from 'lucide-react'

const ACCESS_LEVELS = [
  { value: 'public', label: 'Public', icon: <Globe size={13} />, color: 'bg-green-100 text-green-700' },
  { value: 'members', label: 'Members Only', icon: <Users size={13} />, color: 'bg-blue-100 text-blue-700' },
  { value: 'clergy', label: 'Clergy Only', icon: <Lock size={13} />, color: 'bg-purple-100 text-purple-700' },
  { value: 'leadership', label: 'Leadership Only', icon: <Shield size={13} />, color: 'bg-crimson-100 text-crimson-700' },
  { value: 'admin', label: 'Admin Only', icon: <Lock size={13} />, color: 'bg-gray-100 text-gray-700' },
]

const defaultForm = {
  title: '',
  description: '',
  category_id: '',
  file_url: '',
  file_name: '',
  access_level: 'members',
  version: '',
  effective_date: '',
  is_published: false,
}

export default function AdminDocuments() {
  const [documents, setDocuments] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [filterAccess, setFilterAccess] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [showCatModal, setShowCatModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(defaultForm)
  const [newCatName, setNewCatName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const [{ data: docs }, { data: cats }] = await Promise.all([
      supabase.from('documents').select('*, category:document_categories(id, name)').order('created_at', { ascending: false }),
      supabase.from('document_categories').select('*').order('sort_order'),
    ])
    setDocuments(docs || [])
    setCategories(cats || [])
    setLoading(false)
  }

  const filtered = documents.filter(d => {
    const matchSearch = search === '' ||
      `${d.title} ${d.description || ''}`.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || d.category_id === filterCat
    const matchAccess = filterAccess === 'all' || d.access_level === filterAccess
    return matchSearch && matchCat && matchAccess
  })

  const openCreate = () => {
    setEditing(null)
    setForm({ ...defaultForm, category_id: categories[0]?.id || '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (d: any) => {
    setEditing(d)
    setForm({
      title: d.title, description: d.description || '',
      category_id: d.category_id || '', file_url: d.file_url || '',
      file_name: d.file_name || '', access_level: d.access_level,
      version: d.version || '', effective_date: d.effective_date || '',
      is_published: d.is_published,
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    if (!form.title) { setError('Document title is required.'); setSaving(false); return }
    if (editing) {
      const { error: err } = await supabase.from('documents').update(form).eq('id', editing.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('documents').insert(form)
      if (err) { setError(err.message); setSaving(false); return }
    }
    setSaving(false)
    setShowModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document record?')) return
    await supabase.from('documents').delete().eq('id', id)
    load()
  }

  const togglePublished = async (d: any) => {
    await supabase.from('documents').update({ is_published: !d.is_published }).eq('id', d.id)
    load()
  }

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return
    await supabase.from('document_categories').insert({
      name: newCatName.trim(),
      slug: newCatName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      sort_order: categories.length + 1
    })
    setNewCatName('')
    setShowCatModal(false)
    load()
  }

  const f = (k: string, v: any) => setForm((prev: any) => ({ ...prev, [k]: v }))

  const getAccessLevel = (val: string) => ACCESS_LEVELS.find(a => a.value === val)

  return (
    <AdminLayout title="Documents Repository" subtitle="Constitution, bylaws, policies, and fellowship records">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search documents..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="input w-auto" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="input w-auto" value={filterAccess} onChange={e => setFilterAccess(e.target.value)}>
          <option value="all">All Access Levels</option>
          {ACCESS_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
        </select>
        <button onClick={() => setShowCatModal(true)} className="btn-outline text-sm whitespace-nowrap">
          + Category
        </button>
        <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={openCreate}>
          <Plus size={16} /> Add Document
        </button>
      </div>

      {/* Access level legend */}
      <div className="flex flex-wrap gap-2 mb-5">
        {ACCESS_LEVELS.map(a => (
          <span key={a.value} className={`badge flex items-center gap-1 ${a.color}`}>
            {a.icon} {a.label}
          </span>
        ))}
      </div>

      {/* Documents table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Document Title</th>
                <th className="table-header">Category</th>
                <th className="table-header">Access</th>
                <th className="table-header">Version</th>
                <th className="table-header">Effective Date</th>
                <th className="table-header">Published</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="table-cell text-center py-10">
                  <div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" />
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="table-cell text-center py-12">
                  <FileText size={32} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-400 font-body">No documents yet. Add your first fellowship document.</p>
                </td></tr>
              ) : filtered.map(d => {
                const access = getAccessLevel(d.access_level)
                return (
                  <tr key={d.id} className="table-row">
                    <td className="table-cell">
                      <div className="font-medium text-gray-900">{d.title}</div>
                      {d.description && <div className="text-xs text-gray-400 font-body truncate max-w-xs">{d.description}</div>}
                      {d.file_url && (
                        <a href={d.file_url} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-crimson-600 hover:underline font-body">
                          View file →
                        </a>
                      )}
                    </td>
                    <td className="table-cell text-gray-500 text-sm">{d.category?.name || '—'}</td>
                    <td className="table-cell">
                      {access && (
                        <span className={`badge flex items-center gap-1 w-fit ${access.color}`}>
                          {access.icon} {access.label}
                        </span>
                      )}
                    </td>
                    <td className="table-cell text-gray-500 text-sm">{d.version || '—'}</td>
                    <td className="table-cell text-gray-500 text-sm">
                      {d.effective_date ? new Date(d.effective_date).toLocaleDateString() : '—'}
                    </td>
                    <td className="table-cell">
                      <button onClick={() => togglePublished(d)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                          d.is_published ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}>
                        {d.is_published ? 'Live' : 'Draft'}
                      </button>
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(d)}
                          className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded transition-colors">
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDelete(d.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400 font-body">
          {filtered.length} of {documents.length} documents
        </div>
      </div>

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">Add Document Category</h2>
              <button onClick={() => setShowCatModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              <label className="label">Category Name</label>
              <input className="input" placeholder="e.g. Governing Documents, Minutes..."
                value={newCatName} onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()} autoFocus />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowCatModal(false)} className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleAddCategory} className="btn-primary">Add Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Document Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">
                {editing ? 'Edit Document' : 'Add Document'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Document Title *</label>
                <input className="input" value={form.title}
                  onChange={e => f('title', e.target.value)}
                  placeholder="KDCMF Constitution and Bylaws" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={2} value={form.description}
                  onChange={e => f('description', e.target.value)}
                  placeholder="Brief description of this document..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={form.category_id} onChange={e => f('category_id', e.target.value)}>
                    <option value="">-- Select Category --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Access Level</label>
                  <select className="input" value={form.access_level} onChange={e => f('access_level', e.target.value)}>
                    {ACCESS_LEVELS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">File URL</label>
                <input className="input" value={form.file_url}
                  onChange={e => f('file_url', e.target.value)}
                  placeholder="https://... (paste a direct link to the file)" />
                <p className="text-xs text-gray-400 font-body mt-1">
                  Upload your file to Supabase Storage or Google Drive and paste the link here.
                </p>
              </div>
              <div>
                <label className="label">File Name</label>
                <input className="input" value={form.file_name}
                  onChange={e => f('file_name', e.target.value)}
                  placeholder="kdcmf-constitution-2024.pdf" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Version</label>
                  <input className="input" value={form.version}
                    onChange={e => f('version', e.target.value)}
                    placeholder="2024, v2.1, Revised..." />
                </div>
                <div>
                  <label className="label">Effective Date</label>
                  <input type="date" className="input" value={form.effective_date}
                    onChange={e => f('effective_date', e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input type="checkbox" checked={form.is_published}
                  onChange={e => f('is_published', e.target.checked)}
                  className="w-4 h-4 accent-crimson-700" />
                <span className="text-sm font-body text-gray-700">Published (visible to authorized members)</span>
              </label>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded font-body">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)}
                className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>
                {saving
                  ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <Save size={15} />}
                {editing ? 'Save Changes' : 'Add Document'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
