import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react'

const defaultForm = {
  name: '',
  slug: '',
  category_id: '',
  tagline: '',
  description: '',
  mission: '',
  vision: '',
  leader_name: '',
  leader_title: '',
  contact_email: '',
  is_active: true,
  is_published: false,
  sort_order: 0,
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export default function AdminAuxiliaries() {
  const [auxiliaries, setAuxiliaries] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showCatModal, setShowCatModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(defaultForm)
  const [newCatName, setNewCatName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [expandedCats, setExpandedCats] = useState<string[]>([])

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    const [{ data: auxData }, { data: catData }] = await Promise.all([
      supabase.from('auxiliaries').select('*, category:auxiliary_categories(id, name)').order('sort_order'),
      supabase.from('auxiliary_categories').select('*').order('sort_order'),
    ])
    setAuxiliaries(auxData || [])
    setCategories(catData || [])
    // Expand all categories by default
    setExpandedCats((catData || []).map((c: any) => c.id))
    setLoading(false)
  }

  const filtered = auxiliaries.filter(a =>
    search === '' || `${a.name} ${a.tagline || ''}`.toLowerCase().includes(search.toLowerCase())
  )

  // Group by category
  const grouped = categories.map(cat => ({
    ...cat,
    items: filtered.filter(a => a.category_id === cat.id)
  })).filter(cat => cat.items.length > 0)

  const uncategorized = filtered.filter(a => !a.category_id)

  const toggleCat = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id])
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ ...defaultForm, category_id: categories[0]?.id || '' })
    setError('')
    setShowModal(true)
  }

  const openEdit = (a: any) => {
    setEditing(a)
    setForm({
      name: a.name, slug: a.slug, category_id: a.category_id || '',
      tagline: a.tagline || '', description: a.description || '',
      mission: a.mission || '', vision: a.vision || '',
      leader_name: a.leader_name || '', leader_title: a.leader_title || '',
      contact_email: a.contact_email || '', is_active: a.is_active,
      is_published: a.is_published, sort_order: a.sort_order || 0,
    })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    if (!form.name) { setError('Auxiliary name is required.'); setSaving(false); return }
    const payload = { ...form, slug: form.slug || slugify(form.name) }
    if (editing) {
      const { error: err } = await supabase.from('auxiliaries').update(payload).eq('id', editing.id)
      if (err) { setError(err.message); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('auxiliaries').insert(payload)
      if (err) { setError(err.message); setSaving(false); return }
    }
    setSaving(false)
    setShowModal(false)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this auxiliary? This cannot be undone.')) return
    await supabase.from('auxiliaries').delete().eq('id', id)
    load()
  }

  const togglePublished = async (a: any) => {
    await supabase.from('auxiliaries').update({ is_published: !a.is_published }).eq('id', a.id)
    load()
  }

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return
    await supabase.from('auxiliary_categories').insert({
      name: newCatName.trim(),
      slug: slugify(newCatName.trim()),
      sort_order: categories.length + 1
    })
    setNewCatName('')
    setShowCatModal(false)
    load()
  }

  const f = (k: string, v: any) => setForm({ ...form, [k]: v })

  return (
    <AdminLayout title="Auxiliaries" subtitle="Women, men, youth, and general ministry pages">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input className="input pl-9" placeholder="Search auxiliaries..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button onClick={() => setShowCatModal(true)}
          className="btn-outline text-sm whitespace-nowrap">
          + Add Category
        </button>
        <button className="btn-primary flex items-center gap-2 whitespace-nowrap" onClick={openCreate}>
          <Plus size={16} /> Add Auxiliary
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-gold-50 border border-gold-200 rounded-lg px-4 py-3 mb-5 text-sm font-body text-yellow-800">
        <strong>Note:</strong> New auxiliary pages can be created here at any time without developer involvement. Each auxiliary gets its own public page automatically.
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {grouped.map(cat => (
            <div key={cat.id} className="card overflow-hidden">
              {/* Category header */}
              <button
                onClick={() => toggleCat(cat.id)}
                className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {expandedCats.includes(cat.id) ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  <span className="font-display font-semibold text-crimson-900">{cat.name}</span>
                  <span className="text-xs text-gray-400 font-body">{cat.items.length} {cat.items.length === 1 ? 'auxiliary' : 'auxiliaries'}</span>
                </div>
              </button>

              {expandedCats.includes(cat.id) && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="table-header">Auxiliary Name</th>
                        <th className="table-header">Tagline</th>
                        <th className="table-header">Leader</th>
                        <th className="table-header">URL Slug</th>
                        <th className="table-header">Published</th>
                        <th className="table-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.map((a: any) => (
                        <tr key={a.id} className="table-row">
                          <td className="table-cell font-medium">{a.name}</td>
                          <td className="table-cell text-gray-500 text-xs max-w-xs truncate">{a.tagline || '—'}</td>
                          <td className="table-cell text-gray-500">
                            {a.leader_name ? `${a.leader_title || ''} ${a.leader_name}`.trim() : '—'}
                          </td>
                          <td className="table-cell">
                            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">/auxiliaries/{a.slug}</code>
                          </td>
                          <td className="table-cell">
                            <button onClick={() => togglePublished(a)}
                              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                                a.is_published
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}>
                              {a.is_published ? <><Eye size={12} /> Live</> : <><EyeOff size={12} /> Draft</>}
                            </button>
                          </td>
                          <td className="table-cell">
                            <div className="flex gap-2">
                              <button onClick={() => openEdit(a)}
                                className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded transition-colors">
                                <Edit size={14} />
                              </button>
                              <button onClick={() => handleDelete(a.id)}
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
              )}
            </div>
          ))}

          {uncategorized.length > 0 && (
            <div className="card overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <span className="font-display font-semibold text-gray-600">Uncategorized</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Slug</th>
                    <th className="table-header">Published</th>
                    <th className="table-header">Actions</th>
                  </tr></thead>
                  <tbody>
                    {uncategorized.map((a: any) => (
                      <tr key={a.id} className="table-row">
                        <td className="table-cell font-medium">{a.name}</td>
                        <td className="table-cell"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{a.slug}</code></td>
                        <td className="table-cell">
                          <button onClick={() => togglePublished(a)}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {a.is_published ? 'Live' : 'Draft'}
                          </button>
                        </td>
                        <td className="table-cell"><div className="flex gap-2">
                          <button onClick={() => openEdit(a)} className="p-1.5 text-gray-400 hover:text-crimson-700 rounded"><Edit size={14} /></button>
                          <button onClick={() => handleDelete(a.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded"><Trash2 size={14} /></button>
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="card p-12 text-center">
              <p className="text-gray-400 font-body">No auxiliaries found.</p>
            </div>
          )}
        </div>
      )}

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">Add Category</h2>
              <button onClick={() => setShowCatModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6">
              <label className="label">Category Name</label>
              <input className="input" placeholder="e.g. Women, Men, Youth, Senior..."
                value={newCatName} onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()} autoFocus />
              <p className="text-xs text-gray-400 font-body mt-2">This creates a new grouping for auxiliary pages.</p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowCatModal(false)} className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleAddCategory} className="btn-primary">Add Category</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Auxiliary Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="crimson-bar" />
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-display text-lg font-semibold text-crimson-900">
                {editing ? 'Edit Auxiliary' : 'Add Auxiliary'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Auxiliary Name *</label>
                  <input className="input" value={form.name}
                    onChange={e => f('name', e.target.value)}
                    placeholder="Her Voice His Glory" />
                </div>
                <div>
                  <label className="label">Category</label>
                  <select className="input" value={form.category_id} onChange={e => f('category_id', e.target.value)}>
                    <option value="">-- Select Category --</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">URL Slug</label>
                  <input className="input" value={form.slug}
                    onChange={e => f('slug', e.target.value)}
                    placeholder="auto-generated from name" />
                  <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate</p>
                </div>
                <div>
                  <label className="label">Sort Order</label>
                  <input type="number" className="input" value={form.sort_order}
                    onChange={e => f('sort_order', parseInt(e.target.value) || 0)} />
                </div>
              </div>
              <div>
                <label className="label">Tagline</label>
                <input className="input" value={form.tagline}
                  onChange={e => f('tagline', e.target.value)}
                  placeholder="Women of Excellence, Serving with Purpose" />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="input" rows={3} value={form.description}
                  onChange={e => f('description', e.target.value)}
                  placeholder="Brief description of this auxiliary ministry..." />
              </div>
              <div>
                <label className="label">Mission Statement</label>
                <textarea className="input" rows={2} value={form.mission}
                  onChange={e => f('mission', e.target.value)} />
              </div>
              <div>
                <label className="label">Vision Statement</label>
                <textarea className="input" rows={2} value={form.vision}
                  onChange={e => f('vision', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Leader Name</label>
                  <input className="input" value={form.leader_name}
                    onChange={e => f('leader_name', e.target.value)} />
                </div>
                <div>
                  <label className="label">Leader Title</label>
                  <input className="input" value={form.leader_title}
                    onChange={e => f('leader_title', e.target.value)}
                    placeholder="Director, President, Minister..." />
                </div>
              </div>
              <div>
                <label className="label">Contact Email</label>
                <input type="email" className="input" value={form.contact_email}
                  onChange={e => f('contact_email', e.target.value)} />
              </div>
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_active}
                    onChange={e => f('is_active', e.target.checked)}
                    className="w-4 h-4 accent-crimson-700" />
                  <span className="text-sm font-body text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_published}
                    onChange={e => f('is_published', e.target.checked)}
                    className="w-4 h-4 accent-crimson-700" />
                  <span className="text-sm font-body text-gray-700">Published (visible on public site)</span>
                </label>
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
                {editing ? 'Save Changes' : 'Add Auxiliary'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
