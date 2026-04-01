import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMemberAuth } from '../../lib/auth'
import { KDCMF_SEAL } from '../../lib/logos'
import { supabase } from '../../lib/supabase'
import { ArrowLeft, FileText, Download, Search } from 'lucide-react'

export default function MemberDocuments() {
  const { profile, logout } = useMemberAuth()
  const [documents, setDocuments] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const role = profile?.role || 'member'
    const accessLevels = role === 'admin' || role === 'bishop'
      ? ['public', 'members', 'clergy', 'leadership', 'admin']
      : role === 'clergy'
      ? ['public', 'members', 'clergy']
      : ['public', 'members']

    const [{ data: docs }, { data: cats }] = await Promise.all([
      supabase.from('documents').select('*, category:document_categories(id, name)')
        .eq('is_published', true)
        .in('access_level', accessLevels)
        .order('created_at', { ascending: false }),
      supabase.from('document_categories').select('*').order('sort_order'),
    ])
    setDocuments(docs || [])
    setCategories(cats || [])
    setLoading(false)
  }

  const filtered = documents.filter(d => {
    const matchSearch = search === '' || d.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = filterCat === 'all' || d.category_id === filterCat
    return matchSearch && matchCat
  })

  const formatSize = (bytes: number) => {
    if (!bytes) return ''
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/portal" className="flex items-center gap-1.5 text-sm text-crimson-600 font-body font-medium mb-6 hover:underline">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
        <h1 className="font-display text-2xl font-bold text-crimson-900 mb-6">Fellowship Documents</h1>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input pl-9 text-sm" placeholder="Search documents..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="input w-auto text-sm" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32"><div className="w-8 h-8 border-4 border-crimson-700 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="card p-10 text-center">
            <FileText size={32} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-body">No documents available.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(doc => (
              <div key={doc.id} className="card p-4 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <FileText size={20} className="text-crimson-400 flex-shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 font-body text-sm">{doc.title}</div>
                    {doc.description && <div className="text-xs text-gray-400 font-body mt-0.5 truncate">{doc.description}</div>}
                    <div className="flex items-center gap-3 mt-1">
                      {doc.category?.name && <span className="text-xs text-gray-400 font-body">{doc.category.name}</span>}
                      {doc.version && <span className="text-xs text-gray-400 font-body">v{doc.version}</span>}
                      {doc.file_size && <span className="text-xs text-gray-400 font-body">{formatSize(doc.file_size)}</span>}
                    </div>
                  </div>
                </div>
                {doc.file_url && (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-semibold text-crimson-600 hover:text-crimson-800 font-body flex-shrink-0 border border-crimson-200 px-3 py-1.5 rounded hover:bg-crimson-50 transition-colors">
                    <Download size={12} /> Download
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
