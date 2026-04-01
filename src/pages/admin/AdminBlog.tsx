import { useEffect, useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { supabase } from '../../lib/supabase'
import { Search, Plus, X, Save, Trash2, Edit, Newspaper, Eye, EyeOff } from 'lucide-react'

const defaultForm = { title:'', slug:'', excerpt:'', content:'', category_id:'', status:'draft', is_featured:false }
function slugify(t: string) { return t.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') }

export default function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState<any>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])
  const load = async () => {
    setLoading(true)
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('blog_posts').select('*, category:blog_categories(name), author:profiles(first_name, last_name)').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*').order('sort_order')
    ])
    setPosts(p || []); setCategories(c || []); setLoading(false)
  }

  const filtered = posts.filter(p => {
    const ms = search === '' || p.title.toLowerCase().includes(search.toLowerCase())
    const mf = filter === 'all' || p.status === filter
    return ms && mf
  })

  const openCreate = () => { setEditing(null); setForm({ ...defaultForm, category_id: categories[0]?.id || '' }); setError(''); setShowModal(true) }
  const openEdit = (p: any) => { setEditing(p); setForm({ title: p.title, slug: p.slug, excerpt: p.excerpt||'', content: p.content||'', category_id: p.category_id||'', status: p.status, is_featured: p.is_featured }); setError(''); setShowModal(true) }
  const handleSave = async () => {
    setSaving(true); setError('')
    if (!form.title) { setError('Title required'); setSaving(false); return }
    const payload = { ...form, slug: form.slug || slugify(form.title), published_at: form.status === 'published' ? new Date().toISOString() : null }
    if (editing) { await supabase.from('blog_posts').update(payload).eq('id', editing.id) }
    else { await supabase.from('blog_posts').insert(payload) }
    setSaving(false); setShowModal(false); load()
  }
  const handleDelete = async (id: string) => { if (!confirm('Delete post?')) return; await supabase.from('blog_posts').delete().eq('id', id); load() }
  const toggleStatus = async (p: any) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published'
    await supabase.from('blog_posts').update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null }).eq('id', p.id); load()
  }
  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }))

  return (
    <AdminLayout title="Blog & News" subtitle="Publish fellowship news and Kingdom teaching">
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input className="input pl-9" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} /></div>
        <select className="input w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All Posts</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <button className="btn-primary flex items-center gap-2" onClick={openCreate}><Plus size={16} /> New Post</button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr><th className="table-header">Title</th><th className="table-header">Category</th><th className="table-header">Status</th><th className="table-header">Date</th><th className="table-header">Actions</th></tr></thead>
            <tbody>
              {loading ? <tr><td colSpan={5} className="table-cell text-center py-10"><div className="w-6 h-6 border-2 border-crimson-700 border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
              : filtered.length === 0 ? <tr><td colSpan={5} className="table-cell text-center py-12"><Newspaper size={32} className="text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No posts found.</p></td></tr>
              : filtered.map(p => (
                <tr key={p.id} className="table-row">
                  <td className="table-cell">
                    <div className="font-medium text-gray-900">{p.title}</div>
                    {p.is_featured && <span className="text-xs text-gold-600 font-body">★ Featured</span>}
                  </td>
                  <td className="table-cell text-gray-500 text-sm">{p.category?.name || '—'}</td>
                  <td className="table-cell">
                    <button onClick={() => toggleStatus(p)} className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold transition-colors ${p.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                      {p.status === 'published' ? <><Eye size={11} /> Published</> : <><EyeOff size={11} /> Draft</>}
                    </button>
                  </td>
                  <td className="table-cell text-gray-400 text-xs">{new Date(p.created_at).toLocaleDateString()}</td>
                  <td className="table-cell"><div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-crimson-700 hover:bg-crimson-50 rounded"><Edit size={14} /></button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
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
            <div className="flex items-center justify-between px-6 py-4 border-b"><h2 className="font-display text-lg font-semibold text-crimson-900">{editing ? 'Edit Post' : 'New Post'}</h2><button onClick={() => setShowModal(false)} className="text-gray-400"><X size={20} /></button></div>
            <div className="p-6 space-y-4">
              <div><label className="label">Title *</label><input className="input" value={form.title} onChange={e => f('title', e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category</label><select className="input" value={form.category_id} onChange={e => f('category_id', e.target.value)}><option value="">-- Select --</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label className="label">Status</label><select className="input" value={form.status} onChange={e => f('status', e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></select></div>
              </div>
              <div><label className="label">Excerpt</label><textarea className="input" rows={2} value={form.excerpt} onChange={e => f('excerpt', e.target.value)} placeholder="Brief summary shown in listings..." /></div>
              <div><label className="label">Content</label><textarea className="input" rows={8} value={form.content} onChange={e => f('content', e.target.value)} placeholder="Full post content..." /></div>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.is_featured} onChange={e => f('is_featured', e.target.checked)} className="accent-crimson-700" /><span className="text-sm font-body text-gray-700">Featured post</span></label>
              {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button onClick={() => setShowModal(false)} className="btn-ghost text-gray-600 border border-gray-300">Cancel</button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2" disabled={saving}>{saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}{editing ? 'Save' : 'Publish'}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
